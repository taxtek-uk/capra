/** Contact and wholesale enquiry emails: the customer's copy and the lead for the shop inbox. */
import { emailShell, section, row, table, panel, button, MAIL } from "@/lib/email";
import { BRAND, CONTACT } from "@/lib/brand";
import { escapeHtml } from "@/lib/utils";

const e = escapeHtml;
const dash = (s?: string | null) => (s ? escapeHtml(s) : "—");
const br = (s: string) => escapeHtml(s).replace(/\n/g, "<br>");

export const KIND_LABEL: Record<string, string> = { contact: "General enquiry", wholesale: "Wholesale enquiry", product: "Product question", warranty: "Warranty claim" };

export interface EnquiryEmailInput {
  ref: string; kind: string; name: string; email: string; phone: string; city: string; company: string;
  subject: string; message: string; product?: string; quantity: string; page: string;
  meta: { ref?: string | null; utmSource?: string | null; utmCampaign?: string | null; landingPath?: string | null };
  ip: string;
}

export function buildEnquiryEmails(d: EnquiryEmailInput) {
  const label = KIND_LABEL[d.kind] ?? "Enquiry";
  const detailRows =
    (d.subject ? row("About", e(d.subject)) : "") + (d.product ? row("Product", e(d.product)) : "") +
    (d.quantity ? row("Quantity", e(d.quantity)) : "") + (d.message ? row("Message", br(d.message)) : "");

  const customerHtml = emailShell(
    "Thank you, we have your message",
    `<p style="margin:22px 0 0;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.65;color:#141210">Assalam-o-Alaikum ${e(d.name.split(" ")[0])},</p>
<p style="margin:12px 0 0;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.65;color:#3d3833">Thank you for contacting ${BRAND.name}. Our team will reply within one working day${d.phone ? `, by phone or WhatsApp on ${e(d.phone)}` : ""}.</p>
${section("What you sent us", table(row("Reference", `<strong>${e(d.ref)}</strong>`) + row("Type", e(label)) + detailRows), "Your message")}
${panel("Anything to add, such as a photo or your order number? Reply to this email or WhatsApp us; both reach the same team.")}
${button(`${BRAND.domain}/shop`, "Browse the range")}
<p style="margin:6px 0 0;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.65;color:#3d3833">Urgent? WhatsApp <a href="${CONTACT.whatsappLink}" style="color:#7a5d4a">${CONTACT.whatsapp}</a> or call ${MAIL.supportPhone}, ${BRAND.hours.display}.</p>`,
    { preheader: `Reference ${d.ref}: we reply within one working day.`, meta: [{ label: "Reference", value: d.ref }, { label: "Type", value: label }] },
  );

  const adminHtml = emailShell(
    `New ${label.toLowerCase()}`,
    `${section("Contact", table(row("Name", e(d.name)) + row("Phone", d.phone ? `<a href="tel:${e(d.phone)}" style="color:#7a5d4a">${e(d.phone)}</a>` : "—") + row("Email", d.email ? `<a href="mailto:${e(d.email)}" style="color:#7a5d4a">${e(d.email)}</a>` : "—") + row("City", dash(d.city)) + row("Business", dash(d.company))), "Lead")}
${section("Message", table(row("Reference", e(d.ref)) + row("Type", e(d.kind)) + (detailRows || row("Message", "—"))), "What they asked")}
${section("Attribution", table(row("Sent from", dash(d.page)) + row("Landing page", dash(d.meta.landingPath)) + row("Referral code", dash(d.meta.ref)) + row("UTM", dash([d.meta.utmSource, d.meta.utmCampaign].filter(Boolean).join(" · "))) + row("IP", e(d.ip))), "Source")}
${button(`${BRAND.domain}/admin/enquiries`, "Open in admin")}`,
    { preheader: `${d.name} · ${label}${d.city ? ` · ${d.city}` : ""}`, meta: [{ label: "Reference", value: d.ref }, { label: "Type", value: label }] },
  );

  return { customerHtml, adminHtml, customerSubject: `We've received your message · ${d.ref}`, adminSubject: `[${label}] ${d.company ? d.company + " · " : ""}${d.name} · ${d.ref}` };
}
