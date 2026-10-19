import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";

/**
 * /admin access = a row in `site_admins` plus its password. The cookie carries
 * `id.expiry.hmac` — never the password or its hash — and every read re-checks the
 * row, so deleting a user signs them out. ADMIN_DASH_TOKEN (also the visit-hash
 * salt) is the signing key: rotating it signs everyone out.
 */
const COOKIE = "capra_admin";
const MAX_AGE = 60 * 60 * 24 * 30;
const secret = () => process.env.ADMIN_DASH_TOKEN ?? "";
const sign = (body: string) => createHmac("sha256", secret()).update(body).digest("hex");

export type AdminUser = { id: number; name: string; email: string; role: string };
export const isOwner = (u: AdminUser | null) => u?.role === "owner";
export const ROLES = ["owner", "staff"] as const;

/* ─── Passwords ─────────────────────────────────────────────────────────── */
// scrypt from node:crypto: bcrypt/argon2 would be a native dependency for the same job.
export const hashPassword = (pw: string) => {
  const salt = randomBytes(16);
  return `scrypt$${salt.toString("hex")}$${scryptSync(pw, salt, 64).toString("hex")}`;
};
export function verifyPassword(pw: string, stored: string) {
  const [scheme, saltHex, hashHex] = (stored || "").split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const want = Buffer.from(hashHex, "hex");
  const got = scryptSync(pw, Buffer.from(saltHex, "hex"), want.length || 64);
  return want.length === got.length && timingSafeEqual(want, got);
}

/* ─── Session ───────────────────────────────────────────────────────────── */
/** Cached per request: the layout and the page both ask, one query answers. */
export const currentAdmin = cache(async (): Promise<AdminUser | null> => {
  if (!secret()) return null;
  const raw = (await cookies()).get(COOKIE)?.value ?? "";
  const [id, exp, mac] = raw.split(".");
  if (!id || !exp || !mac) return null;
  const want = Buffer.from(sign(`${id}.${exp}`)), got = Buffer.from(mac);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  if (!(Number(exp) > Date.now())) return null;
  const sql = db();
  if (!sql) return null;
  const [u] = await sql`select id, name, email, role from site_admins where id = ${Number(id)}`;
  return u ? { ...(u as AdminUser), id: Number(u.id) } : null;
});

export async function requireAdmin() {
  const u = await currentAdmin();
  if (!u) redirect("/admin/login");
  return u;
}
/** Guards user management: only owners may add or remove people. */
export async function requireOwner() {
  const u = await requireAdmin();
  if (!isOwner(u)) redirect("/admin");
  return u;
}

/** Verifies a sign-in and stamps the session cookie. Null on any bad credential. */
export async function signIn(email: string, password: string): Promise<AdminUser | null> {
  const sql = db();
  if (!sql) return null;
  const [row] = await sql`select id, name, email, role, password_hash from site_admins where email = ${email.trim().toLowerCase()}`;
  if (!row || !verifyPassword(password, String(row.password_hash))) return null;
  const id = Number(row.id);
  const body = `${id}.${Date.now() + MAX_AGE * 1000}`;
  (await cookies()).set(COOKIE, `${body}.${sign(body)}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: MAX_AGE,
  });
  await sql`update site_admins set last_login_at = now() where id = ${id}`;
  return { id, name: String(row.name), email: String(row.email), role: String(row.role) };
}
export async function clearAdminCookie() { (await cookies()).delete(COOKIE); }

/** True when nobody has been seeded yet — the sign-in screen says how to fix it. */
export async function hasAdminUsers() {
  const sql = db();
  if (!sql) return false;
  const [r] = await sql`select count(*)::int as n from site_admins`;
  return Number(r?.n ?? 0) > 0;
}
