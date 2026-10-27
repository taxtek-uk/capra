/** "Email me my basket" and its one optional reminder. Customer only. Every figure was priced on the server. */
import { emailShell, section, table, lineRow, totalRow, grandTotal, button, panel } from "@/lib/email";
import { escapeHtml, pkr } from "@/lib/utils";
import { COMMERCIAL, CONTACT } from "@/lib/brand";
import type { PricedCart } from "@/lib/shop";

const e = escapeHtml;

export function savedBasketEmail(d: { cart: PricedCart; link: string; remind: boolean }) {
  const body =
    `<p style="margin:24px 0 0;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.6;color:#0b0a09">Here is the basket you saved. Open it on any phone or computer and check out when you are ready, with cash on delivery.</p>` +
    button(e(d.link), "Open my basket") +
    section("Your basket", table(d.cart.lines.map((l) => lineRow(`${l.qty} × ${e(l.name)}`, pkr(l.amount), e(l.variantLabel))).join("") + totalRow("Delivery", COMMERCIAL.deliveryShort)) + grandTotal("Total", pkr(d.cart.total), "Prices are today's list prices and are confirmed when you check out."), "Saved") +
    panel(`Questions about a size or colour? WhatsApp ${e(CONTACT.whatsapp)}.`) +
    (d.remind ? `<p style="margin:16px 0 0;font-family:Inter,Arial,sans-serif;font-size:12px;color:#6a6157">You asked for one reminder tomorrow if you have not ordered yet. That is the only reminder we will send.</p>` : "");
  return { subject: `Your CAPRA basket: ${pkr(d.cart.total)}`, html: emailShell("Your basket, saved.", body, { preheader: `${d.cart.count} item(s), ${pkr(d.cart.total)}, with a link back to your basket.` }) };
}

export function basketReminderEmail(d: { total: number; link: string }) {
  const body =
    `<p style="margin:24px 0 0;font-family:Inter,Arial,sans-serif;font-size:14px;line-height:1.6;color:#0b0a09">Yesterday you saved a basket of <strong>${pkr(d.total)}</strong>. It is still there: open it, change anything you like and order with cash on delivery.</p>` +
    button(e(d.link), "Open my basket") +
    `<p style="margin:16px 0 0;font-family:Inter,Arial,sans-serif;font-size:12px;color:#6a6157">You asked for this reminder when you saved your basket. We will not send another.</p>`;
  return { subject: "Your saved CAPRA basket", html: emailShell("Your basket is waiting.", body, { preheader: "Pick up where you left off." }) };
}
