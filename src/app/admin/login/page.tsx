import { redirect } from "next/navigation";
import Image from "next/image";
import { headers } from "next/headers";
import { signIn, currentAdmin, hasAdminUsers } from "@/lib/admin";
import { rateLimit } from "@/lib/ratelimit";
import { Btn, Card, Field, Input } from "@/components/admin/ui";
import { BRAND } from "@/lib/brand";

export const metadata = { title: "Admin sign in", robots: { index: false, follow: false } };

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  // Two windows: one per address (a targeted guess) and one per IP (a spray).
  if (!(await rateLimit(`admin:${ip}`, 10, 15 * 60_000)).ok || !(await rateLimit(`admin:${email}`, 8, 15 * 60_000)).ok)
    redirect("/admin/login?e=slow");
  if (!email || !password || !(await signIn(email, password))) redirect("/admin/login?e=1");
  redirect("/admin");
}

export default async function Page({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await currentAdmin()) redirect("/admin");
  const { e } = await searchParams;
  const seeded = await hasAdminUsers();
  return (
    <Card className="w-full max-w-sm p-7">
      <div className="flex items-center gap-2">
        <Image src={BRAND.mark} alt="" width={28} height={28} className="h-7 w-7 rounded-md object-contain" />
        <span className="text-sm font-semibold text-zinc-900">{BRAND.name}</span>
      </div>
      <h1 className="mt-6 text-lg font-semibold text-zinc-900">Sign in to the dashboard</h1>
      <p className="mt-1 text-sm text-zinc-500">Use your email address and password.</p>
      <form action={login} className="mt-6 grid gap-4">
        <Field label="Email">
          <Input name="email" type="email" autoComplete="username" required autoFocus />
        </Field>
        <Field label="Password">
          <Input name="password" type="password" autoComplete="current-password" required />
        </Field>
        {e && <p className="text-sm text-rose-700" role="alert">{e === "slow" ? "Too many attempts. Wait a few minutes." : "That email and password do not match."}</p>}
        <Btn type="submit">Sign in</Btn>
        {!seeded && (
          <p className="text-xs text-zinc-500">
            No users yet. Run <code className="rounded bg-zinc-100 px-1 py-0.5">node scripts/seed-admin-user.mjs</code> to create the first owner.
          </p>
        )}
      </form>
    </Card>
  );
}
