// Creates or updates one /admin sign-in. Idempotent: re-running resets that user's
// password and role. The password is never defaulted — pass it, or set ADMIN_SEED_PASSWORD:
//   node scripts/seed-admin-user.mjs "Name" email@example.com owner 'password'
import { neon } from "@neondatabase/serverless";
import { randomBytes, scryptSync } from "node:crypto";
import fs from "node:fs";

const env = Object.fromEntries(fs.existsSync(".env.local")
  ? fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#"))
      .map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; })
  : []);

const url = env.CAPRA_DATABASE_URL || process.env.CAPRA_DATABASE_URL || process.env.DATABASE_URL || env.DATABASE_URL;
if (!url) { console.error("No CAPRA_DATABASE_URL / DATABASE_URL"); process.exit(1); }

const [name = "", email = "", role = "owner", password = process.env.ADMIN_SEED_PASSWORD] = process.argv.slice(2);
if (!name || !email) { console.error('Usage: node scripts/seed-admin-user.mjs "Name" email@example.com owner "password"'); process.exit(1); }
if (!["owner", "staff"].includes(role)) { console.error("role must be owner or staff"); process.exit(1); }
// No default password: a credential in a committed file is a credential in the repo's history.
if (!password) { console.error("Pass the password as the 4th argument, or set ADMIN_SEED_PASSWORD."); process.exit(1); }
if (password.length < 10) { console.error("password must be at least 10 characters"); process.exit(1); }

// Same format src/lib/admin.ts verifies: scrypt$<salt>$<hash>.
const salt = randomBytes(16);
const hash = `scrypt$${salt.toString("hex")}$${scryptSync(password, salt, 64).toString("hex")}`;

const sql = neon(url);
await sql`insert into site_admins (name, email, role, password_hash)
          values (${name}, ${email.toLowerCase()}, ${role}, ${hash})
          on conflict (email) do update set name = excluded.name, role = excluded.role, password_hash = excluded.password_hash`;
const rows = await sql`select name, email, role from site_admins order by created_at`;
console.log("site_admins:", rows.map((r) => `${r.name} <${r.email}> (${r.role})`).join(", "));
