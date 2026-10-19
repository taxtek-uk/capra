// Applies docs/schema.sql to the Neon database in .env.local. Idempotent. Run: node scripts/apply-schema.mjs
import { neon } from "@neondatabase/serverless";
import fs from "node:fs";
const env = Object.fromEntries(fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8").split("\n").filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, "")]; }) : []);

const url = env.CAPRA_DATABASE_URL || process.env.CAPRA_DATABASE_URL || process.env.DATABASE_URL || env.DATABASE_URL;
if (!url) { console.error("No CAPRA_DATABASE_URL / DATABASE_URL"); process.exit(1); }
const sql = neon(url);
// Strip comments before splitting on ";" — a semicolon inside a trailing comment would cut a statement in half.
const src = fs.readFileSync("docs/schema.sql", "utf8").split("\n").map((l) => l.replace(/--.*$/, "")).join("\n");
for (const stmt of src.split(";").map((s) => s.trim()).filter(Boolean)) await sql.query(stmt);
const t = await sql`select table_name from information_schema.tables where table_schema='public' order by 1`;
console.log("tables:", t.map((x) => x.table_name).join(", "));
