import { Resend } from "resend";
import { BRAND, COMMERCIAL, CONTACT, SOCIAL } from "./brand";

/** TO_EMAIL is the shop inbox for new orders and enquiries; SEND_CUSTOMER_COPY=false stops the customer copies. */
export const MAIL = {
  from: process.env.EMAIL_FROM ?? `${BRAND.name} <${CONTACT.email}>`,
  to: (process.env.TO_EMAIL || CONTACT.inbox).split(",").map((s) => s.trim()).filter(Boolean),
  bcc: process.env.BCC_EMAIL ? [process.env.BCC_EMAIL] : undefined,
  sendCustomerCopy: String(process.env.SEND_CUSTOMER_COPY ?? "true").toLowerCase() === "true",
  supportEmail: process.env.SUPPORT_EMAIL || CONTACT.email,
  supportPhone: process.env.SUPPORT_PHONE || CONTACT.phone,
};

export async function sendEmail(input: { subject: string; html: string; to?: string[]; replyTo?: string; cc?: string[]; bcc?: string[] }) {
  const key = process.env.RESEND_API_KEY;
  if (!key || process.env.EMAIL_DRY_RUN === "1") { console.warn(`[email] ${key ? "EMAIL_DRY_RUN" : "RESEND_API_KEY unset"}; not sending:`, input.subject, "→", (input.to ?? MAIL.to).join(",")); return { skipped: true }; }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({ from: MAIL.from, to: input.to ?? MAIL.to, cc: input.cc, bcc: input.bcc ?? MAIL.bcc, replyTo: input.replyTo ?? CONTACT.email, subject: input.subject, html: input.html });
  if (error) throw new Error(error.message);
  return { skipped: false };
}

/* ─────────────────────────────────────────────────────────────────────────────
   Presentation primitives.

   Email clients are not browsers: no flexbox, no grid, no external CSS, no web
   fonts worth relying on. Everything below is tables and inline styles, sized
   for a 640px column that degrades to full width on a phone. Palette matches
   the site tokens in globals.css; Georgia stands in for Fraunces.
   ──────────────────────────────────────────────────────────────────────────── */

const INK = "#0b0a09";
const BONE = "#faf8f4";
const BONE_100 = "#f4efe8";
const STONE = "#8d8378";
const BRASS = "#c9a96e";
const LINE = "#e6ded3";
const SANS = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

/** Small uppercase label that opens a section. */
export const eyebrow = (t: string) => `<p style="margin:0 0 6px;font-family:${SANS};font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:${STONE}">${t}</p>`;

/** Section heading with a hairline beneath it. */
export const section = (title: string, body: string, label?: string) =>
  `<div style="margin:32px 0 0">${label ? eyebrow(label) : ""}<h2 style="margin:0 0 14px;font-family:${SERIF};font-weight:400;font-size:19px;line-height:1.3;color:${INK}">${title}</h2><div style="border-top:1px solid ${LINE};padding-top:14px">${body}</div></div>`;

/** Label / value row for specification and detail tables. */
export const row = (k: string, v: string) =>
  `<tr><td style="padding:9px 0;font-family:${SANS};font-size:13px;color:${STONE};width:42%;vertical-align:top;border-bottom:1px solid ${LINE}">${k}</td><td style="padding:9px 0;font-family:${SANS};font-size:13px;color:${INK};vertical-align:top;border-bottom:1px solid ${LINE}">${v}</td></tr>`;

export const table = (rows: string) => `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${rows}</table>`;

/** Priced line: description left, amount right-aligned and non-wrapping. */
export const lineRow = (label: string, amount: string, note?: string) =>
  `<tr><td style="padding:10px 12px 10px 0;font-family:${SANS};font-size:13px;line-height:1.5;color:${INK};border-bottom:1px solid ${LINE}">${label}${note ? `<br><span style="font-size:12px;color:${STONE}">${note}</span>` : ""}</td><td style="padding:10px 0;font-family:${SANS};font-size:13px;color:${INK};text-align:right;white-space:nowrap;vertical-align:top;border-bottom:1px solid ${LINE}">${amount}</td></tr>`;

/** Subtotal / VAT line beneath a priced table. */
export const totalRow = (label: string, amount: string, strong = false) =>
  `<tr><td style="padding:${strong ? "12px" : "8px"} 12px ${strong ? "12px" : "8px"} 0;font-family:${SANS};font-size:${strong ? "14px" : "13px"};color:${strong ? INK : STONE};${strong ? "font-weight:600;" : ""}">${label}</td><td style="padding:${strong ? "12px" : "8px"} 0;font-family:${SANS};font-size:${strong ? "14px" : "13px"};color:${INK};text-align:right;white-space:nowrap;${strong ? "font-weight:600;" : ""}">${amount}</td></tr>`;

/** The headline figure, set apart from the line items. */
export const grandTotal = (label: string, amount: string, foot?: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;margin-top:14px;background:${INK};border-radius:10px"><tr><td style="padding:18px 20px;font-family:${SANS};font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:${BRASS}">${label}</td><td style="padding:18px 20px;font-family:${SERIF};font-size:26px;color:${BONE};text-align:right;white-space:nowrap">${amount}</td></tr>${foot ? `<tr><td colspan="2" style="padding:0 20px 16px;font-family:${SANS};font-size:12px;color:rgba(250,248,244,.6)">${foot}</td></tr>` : ""}</table>`;

/** Tinted callout panel. `tone` picks the accent. */
export const panel = (body: string, tone: "neutral" | "warn" = "neutral") =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:separate;margin:16px 0;background:${tone === "warn" ? "#fbf3ee" : BONE_100};border-left:3px solid ${tone === "warn" ? "#a13d2d" : BRASS};border-radius:6px"><tr><td style="padding:14px 16px;font-family:${SANS};font-size:13px;line-height:1.6;color:${tone === "warn" ? "#7c2f22" : "#6f665c"}">${body}</td></tr></table>`;

/** Numbered next-steps sequence . */
export const steps = (items: { title: string; body: string }[]) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${items
    .map((s, i) => `<tr><td style="padding:12px 14px 12px 0;width:34px;vertical-align:top;font-family:${SERIF};font-size:18px;color:${BRASS};border-bottom:${i === items.length - 1 ? "0" : `1px solid ${LINE}`}">${String(i + 1).padStart(2, "0")}</td><td style="padding:12px 0;vertical-align:top;border-bottom:${i === items.length - 1 ? "0" : `1px solid ${LINE}`}"><p style="margin:0 0 3px;font-family:${SANS};font-size:13px;font-weight:600;color:${INK}">${s.title}</p><p style="margin:0;font-family:${SANS};font-size:13px;line-height:1.55;color:${STONE}">${s.body}</p></td></tr>`)
    .join("")}</table>`;

export const button = (href: string, label: string) =>
  `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:20px 0"><tr><td style="background:${INK};border-radius:999px"><a href="${href}" style="display:inline-block;padding:12px 26px;font-family:${SANS};font-size:13px;font-weight:600;color:${BONE};text-decoration:none">${label}</a></td></tr></table>`;

/**
 * Outer shell. `meta` renders as a reference strip under the title — quote
 * reference and date — and `preheader` is the grey preview line most clients
 * show beside the subject.
 */
export function emailShell(title: string, body: string, opts: { meta?: { label: string; value: string }[]; preheader?: string } = {}) {
  const metaStrip = opts.meta?.length
    ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin-top:18px;border-top:1px solid rgba(250,248,244,.16)"><tr>${opts.meta
        .map((m) => `<td style="padding:14px 16px 0 0;font-family:${SANS};vertical-align:top"><span style="display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:${BRASS}">${m.label}</span><span style="display:block;margin-top:3px;font-size:14px;color:${BONE}">${m.value}</span></td>`)
        .join("")}</tr></table>`
    : "";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${title}</title></head>
<body style="margin:0;padding:0;background:${BONE_100};-webkit-font-smoothing:antialiased">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0">${opts.preheader}</div>` : ""}
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${BONE_100}"><tr><td align="center" style="padding:28px 12px">
<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:640px;border-collapse:separate">
  <tr><td style="background:${INK};border-top:4px solid ${BRASS};border-radius:14px 14px 0 0;padding:26px 30px 26px">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%"><tr>
      <!-- PNG pre-flattened onto INK: WebP and transparency break in Gmail's image proxy and Outlook. -->
      <td style="vertical-align:middle"><a href="${BRAND.domain}" style="text-decoration:none"><img src="${BRAND.domain}/images/brand/logo-email.png" alt="${BRAND.name}" width="180" height="48" style="display:block;width:180px;height:48px;border:0;outline:none;text-decoration:none"></a></td>
      <td style="vertical-align:middle;text-align:right;font-family:${SANS};font-size:10px;line-height:1.6;letter-spacing:.2em;text-transform:uppercase;color:${BRASS}">${BRAND.tagline.replace(/\.$/, "")}<br><span style="color:rgba(250,248,244,.55)">Since ${BRAND.founded}</span></td>
    </tr></table>
    <h1 style="margin:22px 0 0;font-family:${SERIF};font-weight:400;font-size:27px;line-height:1.25;color:${BONE}">${title}</h1>
    ${metaStrip}
  </td></tr>
  <tr><td style="background:${BONE};border:1px solid ${LINE};border-top:0;padding:8px 30px 30px">${body}</td></tr>
  <tr><td style="background:${BONE_100};border:1px solid ${LINE};border-top:0;border-radius:0 0 14px 14px;padding:4px 18px">${promises()}</td></tr>
  <tr><td style="padding:16px 0 0">${businessCard()}</td></tr>
  <tr><td style="padding:18px 14px 0;font-family:${SANS};font-size:11px;line-height:1.7;color:${STONE};text-align:center">
    You are receiving this email because of an order, enquiry or sign-in request at capra.pk. If it reached you by mistake, please delete it and let us know at <a href="mailto:${MAIL.supportEmail}" style="color:${STONE}">${MAIL.supportEmail}</a>.
    Prices are in Pakistani rupees and delivery times are estimates. Our team will never ask for your sign-in code; before paying by bank, JazzCash or Easypaisa, check the account details against your order email or our WhatsApp ${CONTACT.whatsapp}.<br>
    <span style="display:inline-block;margin-top:10px">© ${new Date().getFullYear()} ${BRAND.name}. All rights reserved. Made in ${BRAND.address.city}, Pakistan.</span>
  </td></tr>
</table></td></tr></table></body></html>`;
}

/** Three short promises under the message, from the commercial terms. */
function promises() {
  const cell = (title: string, sub: string) =>
    `<td style="width:33%;padding:14px 8px;vertical-align:top;text-align:center;font-family:${SANS}"><span style="display:block;font-size:12px;font-weight:600;color:${INK}">${title}</span><span style="display:block;margin-top:2px;font-size:11px;line-height:1.5;color:${STONE}">${sub}</span></td>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%"><tr>${cell("Cash on delivery", "All over Pakistan")}${cell(`${COMMERCIAL.warrantyMonths}-month warranty`, "Manufacturing faults")}${cell(`${COMMERCIAL.returnDays}-day returns`, "Unused, in the box")}</tr></table>`;
}

/** Company details on ink: two columns that stack on a phone, then policy links. */
function businessCard() {
  const link = `color:${BONE};text-decoration:none`;
  const item = (label: string, value: string) =>
    `<p style="margin:0 0 10px;font-family:${SANS};font-size:13px;line-height:1.5;color:${BONE}"><span style="display:block;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:rgba(250,248,244,.55)">${label}</span>${value}</p>`;
  const col = (heading: string, items: string) =>
    `<div style="display:inline-block;width:100%;max-width:270px;vertical-align:top;text-align:left"><p style="margin:0 0 12px;font-family:${SERIF};font-size:16px;color:${BRASS}">${heading}</p>${items}</div>`;
  const policies = [["Delivery &amp; returns", "/delivery"], ["Warranty", "/warranty"], ["Care guide", "/care-guide"], ["Privacy", "/privacy-policy"], ["Terms", "/terms-of-service"]]
    .map(([l, h]) => `<a href="${BRAND.domain}${h}" style="color:rgba(250,248,244,.7);text-decoration:underline">${l}</a>`)
    .join(" &nbsp;·&nbsp; ");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;background:${INK};border-radius:14px"><tr><td style="padding:24px 30px 6px;font-size:0">
    ${col("Visit us", item("Showroom", BRAND.showroom) + item("Factory", BRAND.address.full) + item("Hours", BRAND.hours.display))}
    ${col("Talk to us", item("Phone", `<a href="${CONTACT.phoneTel}" style="${link}">${MAIL.supportPhone}</a>`) + item("WhatsApp", `<a href="${CONTACT.whatsappLink}" style="${link}">${CONTACT.whatsapp}</a>`) + item("Email", `<a href="mailto:${MAIL.supportEmail}" style="${link}">${MAIL.supportEmail}</a>`) + item("Online", `<a href="${BRAND.domain}" style="${link}">capra.pk</a> · <a href="${SOCIAL.facebook}" style="${link}">Facebook</a>`))}
  </td></tr><tr><td style="padding:4px 30px 22px;border-top:1px solid rgba(250,248,244,.12);font-family:${SANS};font-size:11px;line-height:2;color:rgba(250,248,244,.7)">${policies}</td></tr></table>`;
}
