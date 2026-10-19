export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

/** Whole rupees, the way Pakistani shops write them: "Rs 1,480". */
export const pkr = (n: number) => `Rs ${Math.round(n).toLocaleString("en-PK")}`;

export function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

/** Pakistani phone in any common shape (0300 1234567, +92 300 1234567, 055-4253697) → digits with a leading 0. */
export function normalisePhone(raw: string) {
  const d = raw.replace(/\D/g, "").replace(/^0092/, "92");
  return d.startsWith("92") ? `0${d.slice(2)}` : d;
}
/** A mobile (03xx, 11 digits) or a landline with area code (0xx…, 10–11 digits). */
export const isPkPhone = (raw: string) => /^0\d{9,10}$/.test(normalisePhone(raw));
