/**
 * Shop order emails: the customer's receipt and the packing copy for the shop inbox.
 * Every figure comes from the server-priced cart; nothing here recalculates money.
 */
import { emailShell, section, row, table, panel, button, lineRow, totalRow, grandTotal, steps, MAIL } from "@/lib/email";
import { BRAND, COMMERCIAL, CONTACT, PAYMENT_ACCOUNTS } from "@/lib/brand";
import { escapeHtml, pkr } from "@/lib/utils";
import type { PricedCart } from "@/lib/shop";
import { orderPath, PAYMENT_LABEL, type OrderRow, type PaymentMethod } from "@/lib/orders";

const e = escapeHtml;
const dash = (s?: string | null) => (s ? escapeHtml(s) : "—");

export interface OrderEmailInput {
  ref: string;
  cart: Pick<PricedCart, "lines" | "subtotal" | "delivery" | "total" | "count">;
  contact: OrderRow["contact"];
  address: OrderRow["address"];
  paymentMethod: PaymentMethod;
  page: string;
  meta: { ref?: string | null; utmSource?: string | null; utmCampaign?: string | null; landingPath?: string | null };
  ip: string;
}

const addressBlock = (a: OrderRow["address"]) => [a.line1, a.line2, a.city, a.province, a.postcode].filter(Boolean).map(e).join("<br>");

const itemsTable = (cart: OrderEmailInput["cart"]) =>
  table(
    cart.lines.map((l) => lineRow(`${l.qty} × ${e(l.name)}`, pkr(l.amount), [l.variantLabel, l.sku].filter(Boolean).map(e).join(" · "))).join("") +
      totalRow("Subtotal", pkr(cart.subtotal)) +
      totalRow("Delivery", cart.delivery ? pkr(cart.delivery) : "Free"),
  );

/** How to pay, in the customer's email and on the order page. Account numbers come only from brand.ts. */
export function paymentInstructions(method: PaymentMethod, ref: string, total: number) {
  if (method === "cod") return `Pay ${pkr(total)} in cash to the courier when your parcel arrives. Please keep the exact amount ready.`;
  const a = method === "bank" ? PAYMENT_ACCOUNTS.bank : method === "jazzcash" ? PAYMENT_ACCOUNTS.jazzcash : PAYMENT_ACCOUNTS.easypaisa;
  const detail = "iban" in a ? (a.iban ? `${a.bank} · ${a.title} · IBAN ${a.iban}` : "") : a.number ? `${a.title} · ${a.number}` : "";
  return detail
    ? `Send ${pkr(total)} by ${PAYMENT_LABEL[method]} to ${detail}, with ${ref} as the reference, then WhatsApp the receipt to ${CONTACT.whatsapp}. We dispatch once it arrives.`
    : `We will WhatsApp you our ${PAYMENT_LABEL[method]} details on ${CONTACT.whatsapp} shortly. Send ${pkr(total)} with ${ref} as the reference and reply with the receipt; we dispatch once it arrives.`;
}

export function buildOrderEmails(d: OrderEmailInput) {
  const cod = d.paymentMethod === "cod";
  const money = grandTotal(cod ? "Pay on delivery" : "Total", pkr(d.cart.total), cod ? "Cash to the courier when it arrives." : `By ${PAYMENT_LABEL[d.paymentMethod]}.`);

  const customerHtml = emailShell(
    "We have your order",
    `<p style="margin:22px 0 0;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.65;color:#141210">Assalam-o-Alaikum ${e(d.contact.name.split(" ")[0])},</p>
<p style="margin:12px 0 0;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.65;color:#3d3833">Thank you for ordering from ${BRAND.name}. We will call or WhatsApp you on ${e(d.contact.phone)} to confirm before we dispatch.</p>

${section("Your order", itemsTable(d.cart) + money, `Reference ${e(d.ref)}`)}

${section("Delivery", table(row("Name", e(d.contact.name)) + row("Address", addressBlock(d.address)) + row("Phone", dash(d.contact.phone)) + (d.contact.notes ? row("Your notes", e(d.contact.notes)) : "")), "Where it is going")}

${panel(e(paymentInstructions(d.paymentMethod, d.ref, d.cart.total)), cod ? "neutral" : "warn")}

${steps([
      { title: "We confirm", body: "A quick call or WhatsApp from our team to check your address." },
      { title: "We dispatch", body: `Packed in Gujranwala within ${COMMERCIAL.dispatch}, with a courier tracking number.` },
      { title: "You receive it", body: `Usually ${COMMERCIAL.deliveryTime}, anywhere in Pakistan.` },
    ])}

${button(`${BRAND.domain}${orderPath(d.ref)}`, "View your order")}

<p style="margin:6px 0 0;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.65;color:#3d3833">Questions? WhatsApp <a href="${CONTACT.whatsappLink}" style="color:#7a5d4a">${CONTACT.whatsapp}</a> or call <a href="${CONTACT.phoneTel}" style="color:#7a5d4a">${MAIL.supportPhone}</a>, ${BRAND.hours.display}. Everything we make carries a ${COMMERCIAL.warrantyMonths}-month warranty.</p>`,
    { preheader: `Order ${d.ref} · ${pkr(d.cart.total)}`, meta: [{ label: "Order", value: d.ref }, { label: "Total", value: pkr(d.cart.total) }, { label: "Payment", value: PAYMENT_LABEL[d.paymentMethod] }] },
  );

  const adminHtml = emailShell(
    "New order",
    `${section("Customer", table(row("Name", e(d.contact.name)) + row("Phone", `<a href="tel:${e(d.contact.phone)}" style="color:#7a5d4a">${e(d.contact.phone)}</a>`) + row("Email", d.contact.email ? `<a href="mailto:${e(d.contact.email)}" style="color:#7a5d4a">${e(d.contact.email)}</a>` : "—")), "Who")}

${section("Ship to", table(row("Address", addressBlock(d.address)) + (d.contact.notes ? row("Notes", e(d.contact.notes)) : "")), "Where")}

${section("Items", itemsTable(d.cart) + money, "Packing list")}

${section("Attribution", table(row("Ordered from", dash(d.page)) + row("Landing page", dash(d.meta.landingPath)) + row("Referral code", dash(d.meta.ref)) + row("UTM", dash([d.meta.utmSource, d.meta.utmCampaign].filter(Boolean).join(" · "))) + row("IP", e(d.ip))), "Source")}

${button(`${BRAND.domain}/admin/orders/${d.ref}`, "Open in admin")}`,
    { preheader: `${d.contact.name} · ${d.address.city} · ${pkr(d.cart.total)} · ${d.cart.count} item(s)`, meta: [{ label: "Order", value: d.ref }, { label: "Total", value: pkr(d.cart.total) }, { label: "Payment", value: PAYMENT_LABEL[d.paymentMethod] }] },
  );

  return {
    customerHtml,
    adminHtml,
    customerSubject: `We have your order · ${d.ref}`,
    adminSubject: `[Order · ${PAYMENT_LABEL[d.paymentMethod]}] ${pkr(d.cart.total)} · ${d.contact.name} · ${d.address.city} · ${d.ref}`,
  };
}

/** Sent when an order is marked shipped in /admin. */
export function buildDespatchEmail(d: { ref: string; name: string; tracking: string; count: number }) {
  return {
    subject: `Your order is on its way · ${d.ref}`,
    html: emailShell(
      "Your order is on its way",
      `<p style="margin:22px 0 0;font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.65;color:#141210">Assalam-o-Alaikum ${e(d.name.split(" ")[0])},</p>
<p style="margin:12px 0 0;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.65;color:#3d3833">Your order has left our Gujranwala factory.</p>

${section("Dispatch", table(row("Order", e(d.ref)) + row("Tracking", dash(d.tracking)) + row("Items", String(d.count))), "On its way")}

${button(`${BRAND.domain}${orderPath(d.ref)}`, "View your order")}`,
      { preheader: `Order ${d.ref} dispatched${d.tracking ? ` · ${d.tracking}` : ""}`, meta: [{ label: "Order", value: d.ref }, { label: "Tracking", value: d.tracking || "—" }] },
    ),
  };
}
