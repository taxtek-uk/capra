import { requireAdmin, isOwner } from "@/lib/admin";
import { db } from "@/lib/db";
import { SetupNotice } from "@/app/admin/_parts";
import { ago, Btn, Card, CardHead, Field, Input, PageHead, Pill, Select, Table, Td, Tr } from "@/components/admin/ui";
import { addUser, removeUser, changePassword, resetPassword } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Settings", robots: { index: false, follow: false } };

const NOTE: Record<string, [string, boolean]> = {
  added: ["User added.", true],
  removed: ["User removed.", true],
  pwchanged: ["Your password has been changed.", true],
  pwreset: ["That user's password has been reset.", true],
  invalid: ["Check the fields and try again — a password needs at least 10 characters.", false],
  weak: ["A password needs at least 10 characters.", false],
  dupe: ["Someone already uses that email address.", false],
  self: ["You cannot remove your own account.", false],
  lastowner: ["That is the last owner — promote someone else first.", false],
  wrongpw: ["Your current password is not right.", false],
  db: ["No database connection.", false],
};

type Row = { id: number; name: string; email: string; role: string; last_login_at: string | null; created_at: string };

export default async function Page({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  const me = await requireAdmin();
  const { e } = await searchParams;
  const sql = db();
  if (!sql) return <SetupNotice reason="Settings needs the database. Set DATABASE_URL, then apply the schema." />;
  const owner = isOwner(me);
  const users = owner
    ? ((await sql`select id::int as id, name, email, role, last_login_at, created_at from site_admins order by created_at`) as Row[])
    : [];
  const note = e ? NOTE[e] : undefined;

  return (
    <>
      <PageHead title="Settings" sub={owner ? "Who can sign in to this dashboard." : "Your dashboard account."} />

      {note && (
        <p className={`mb-5 rounded-lg border px-4 py-2.5 text-sm ${note[1] ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-rose-200 bg-rose-50 text-rose-800"}`} role="status">
          {note[0]}
        </p>
      )}

      {owner && (
      <Card>
        <CardHead title="System users" sub="Owners can add and remove users. Staff can use the dashboard and change their own password." />
        <Table head={["Name", "Email", "Role", "Last sign-in", "Added", ""]} empty="No users yet.">
          {users.map((u) => (
            <Tr key={u.id}>
              <Td className="font-medium text-zinc-900">
                {u.name}
                {u.id === me.id && <span className="ml-2 text-xs font-normal text-zinc-400">you</span>}
              </Td>
              <Td className="text-zinc-600">{u.email}</Td>
              <Td><Pill tone={u.role === "owner" ? "ink" : "neutral"}>{u.role}</Pill></Td>
              <Td className="whitespace-nowrap text-zinc-500">{u.last_login_at ? ago(u.last_login_at) : "never"}</Td>
              <Td className="whitespace-nowrap text-zinc-500">{ago(u.created_at)}</Td>
              <Td>
                {u.id !== me.id && (
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <form action={resetPassword} className="flex items-center gap-1.5">
                      <input type="hidden" name="id" value={u.id} />
                      <Input name="next" type="password" placeholder="New password" autoComplete="new-password" minLength={10} required className="w-40 py-1.5" />
                      <Btn variant="ghost" type="submit" className="py-1.5">Reset</Btn>
                    </form>
                    <form action={removeUser}>
                      <input type="hidden" name="id" value={u.id} />
                      <Btn variant="danger" type="submit" className="py-1.5">Remove</Btn>
                    </form>
                  </div>
                )}
              </Td>
            </Tr>
          ))}
        </Table>
      </Card>
      )}

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        {owner && (
          <Card>
            <CardHead title="Add a user" sub="They sign in at /admin/login with this email and password." />
            <form action={addUser} className="grid gap-4 p-5 pt-4">
              <Field label="Name"><Input name="name" required minLength={2} maxLength={120} /></Field>
              <Field label="Email"><Input name="email" type="email" required maxLength={160} /></Field>
              <Field label="Role" hint="Owners can add and remove users. Staff get the dashboard only.">
                <Select name="role" defaultValue="staff"><option value="staff">Staff</option><option value="owner">Owner</option></Select>
              </Field>
              <Field label="Password" hint="At least 10 characters. Share it with them directly — it is stored hashed and cannot be read back.">
                <Input name="password" type="password" autoComplete="new-password" required minLength={10} maxLength={200} />
              </Field>
              <Btn type="submit" className="justify-self-start">Add user</Btn>
            </form>
          </Card>
        )}

        <Card>
          <CardHead title="Your password" sub={`${me.email} · ${me.role}`} />
          <form action={changePassword} className="grid gap-4 p-5 pt-4">
            <Field label="Current password"><Input name="current" type="password" autoComplete="current-password" required /></Field>
            <Field label="New password" hint="At least 10 characters."><Input name="next" type="password" autoComplete="new-password" required minLength={10} maxLength={200} /></Field>
            <Btn type="submit" className="justify-self-start">Change password</Btn>
          </form>
        </Card>
      </div>
    </>
  );
}
