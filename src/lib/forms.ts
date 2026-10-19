/** Shared parsing for the /admin editors. Kept out of the "use server" files so it can be tested. */

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);

/** "a, b, b, " → ["a","b"] */
export const csvList = (s: string) =>
  [...new Set(s.split(",").map((v) => v.trim()).filter(Boolean))].slice(0, 20);

/** "Q: …" / "A: …" lines, in pairs. Anything unpaired is dropped rather than half-saved. */
export function parseFaqs(raw: string) {
  const out: { q: string; a: string }[] = [];
  let q = "";
  for (const line of raw.split("\n").map((l) => l.trim()).filter(Boolean)) {
    if (/^q[:.]/i.test(line)) q = line.replace(/^q[:.]\s*/i, "");
    else if (/^a[:.]/i.test(line) && q) {
      out.push({ q, a: line.replace(/^a[:.]\s*/i, "") });
      q = "";
    }
  }
  return out.slice(0, 12);
}

/** Trust boundary for image fields: our own /images folder and nothing else. */
export const safeImagePath = (v: string) => (/^\/images\/[\w./-]+$/.test(v) ? v : "");

/**
 * One CSV cell (RFC 4180) that is safe to open in a spreadsheet: a value starting with = + - @ (or a tab
 * or carriage return) is prefixed with ' and can never run as a formula.
 */
export function csvCell(v: unknown) {
  let s = v == null ? "" : v instanceof Date ? v.toISOString() : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return /[",\r\n]/.test(s) || s !== s.trim() ? `"${s.replace(/"/g, '""')}"` : s;
}

export const toCsv = (rows: unknown[][]) => rows.map((r) => r.map(csvCell).join(",")).join("\r\n") + "\r\n";
