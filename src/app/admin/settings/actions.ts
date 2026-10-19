"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireAdmin, requireOwner, hashPassword, verifyPassword, ROLES } from "@/lib/admin";
import { db } from "@/lib/db";

const NewUser = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(160),
  role: z.enum(ROLES),
  password: z.string().min(10).max(200),
});

export async function addUser(formData: FormData) {
  await requireOwner();
  const sql = db();
  if (!sql) redirect("/admin/settings?e=db");
  const parsed = NewUser.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/admin/settings?e=invalid");
  const { name, role, password } = parsed.data;
  const email = parsed.data.email.toLowerCase();
  const [dupe] = await sql`select 1 from site_admins where email = ${email}`;
  if (dupe) redirect("/admin/settings?e=dupe");
  await sql`insert into site_admins (name, email, role, password_hash)
            values (${name}, ${email}, ${role}, ${hashPassword(password)})`;
  redirect("/admin/settings?e=added");
}

export async function removeUser(formData: FormData) {
  const me = await requireOwner();
  const sql = db();
  const id = Number(formData.get("id"));
  if (!sql || !Number.isInteger(id)) redirect("/admin/settings?e=invalid");
  if (id === me.id) redirect("/admin/settings?e=self");
  // Never leave the dashboard without an owner — nobody could add users again.
  const [rest] = await sql`select count(*)::int as n from site_admins where role = 'owner' and id <> ${id}`;
  if (Number(rest?.n ?? 0) < 1) redirect("/admin/settings?e=lastowner");
  await sql`delete from site_admins where id = ${id}`;
  redirect("/admin/settings?e=removed");
}

export async function changePassword(formData: FormData) {
  const me = await requireAdmin();
  const sql = db();
  if (!sql) redirect("/admin/settings?e=db");
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 10 || next.length > 200) redirect("/admin/settings?e=weak");
  const [row] = await sql`select password_hash from site_admins where id = ${me.id}`;
  if (!row || !verifyPassword(current, String(row.password_hash))) redirect("/admin/settings?e=wrongpw");
  await sql`update site_admins set password_hash = ${hashPassword(next)} where id = ${me.id}`;
  redirect("/admin/settings?e=pwchanged");
}

/** Owners can set a password they cannot read; the alternative is deleting the user. */
export async function resetPassword(formData: FormData) {
  await requireOwner();
  const sql = db();
  const id = Number(formData.get("id"));
  const next = String(formData.get("next") ?? "");
  if (!sql || !Number.isInteger(id)) redirect("/admin/settings?e=invalid");
  if (next.length < 10 || next.length > 200) redirect("/admin/settings?e=weak");
  await sql`update site_admins set password_hash = ${hashPassword(next)} where id = ${id}`;
  redirect("/admin/settings?e=pwreset");
}
