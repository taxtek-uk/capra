import { Shell } from "@/components/admin/Shell";
import { currentAdmin } from "@/lib/admin";

export const metadata = { title: "Dashboard", robots: { index: false, follow: false } };

async function signOut() {
  "use server";
  const { clearAdminCookie } = await import("@/lib/admin");
  await clearAdminCookie();
  const { redirect } = await import("next/navigation");
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await currentAdmin();
  return <Shell signOut={signOut} user={me && { name: me.name, role: me.role }}>{children}</Shell>;
}
