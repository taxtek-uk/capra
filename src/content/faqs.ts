import { COMMERCIAL, CONTACT, BRAND } from "@/lib/brand";

const fee = `Rs ${COMMERCIAL.deliveryFee}`;
const free = `Rs ${COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")}`;

/** Answers shown on the help, delivery and shop pages, and marked up as FAQPage for search and answer engines. */
export const ORDER_FAQ = [
  { q: "Do you offer cash on delivery?", a: `Yes. Cash on delivery is available everywhere in Pakistan: pay the courier when your parcel arrives. You can also pay by bank transfer, JazzCash or Easypaisa.` },
  { q: "How much is delivery?", a: `Delivery is ${fee} to any city in Pakistan, and free on orders of ${free} or more.` },
  { q: "How long does delivery take?", a: `We dispatch from Gujranwala within ${COMMERCIAL.dispatch} of confirming your order. Most parcels arrive ${COMMERCIAL.deliveryTime}; big cities are usually quickest.` },
  { q: "Will you call me before sending?", a: "Yes. We call or WhatsApp every new order to confirm the address and the colours before it is packed." },
  { q: "Do I need an account to order?", a: "No. You can check out as a guest with just your name, phone number and address. An email address is optional, but it gets you an emailed receipt and order tracking." },
] as const;

export const AFTERCARE_FAQ = [
  { q: "What if my flask arrives damaged?", a: `Open the parcel when it arrives. If anything is damaged or wrong, WhatsApp a photo to ${CONTACT.whatsapp} within ${COMMERCIAL.returnDays} days and we will replace it free.` },
  { q: "Can I return a flask?", a: `Unused items in their original packaging can be returned within ${COMMERCIAL.returnDays} days of delivery. Message us first and we will arrange it.` },
  { q: "What does the warranty cover?", a: `Every ${BRAND.name} product has a ${COMMERCIAL.warrantyMonths}-month warranty against manufacturing faults, including loss of vacuum that is not caused by a fall or misuse.` },
  { q: "Where are CAPRA flasks made?", a: `${BRAND.name} is made in our own factory in ${BRAND.address.city}, Punjab, and has been since ${BRAND.founded}.` },
] as const;

export const SHOP_FAQ = [...ORDER_FAQ.slice(0, 3), AFTERCARE_FAQ[2]];
