/** Single source of truth for brand, contact and legal identity. */
export const BRAND = {
  name: "CAPRA",
  legalName: "CAPRA",
  domain: "https://www.capra.pk",
  tagline: "Make Life Easy.",
  description: "Stainless steel vacuum jugs, flasks and insulated bottles, made in Gujranwala and delivered across Pakistan with cash on delivery.",
  locale: "en-PK",
  founded: "2019",
  /** The factory. */
  address: {
    street: "Sheikhupura Road",
    city: "Gujranwala",
    region: "Punjab",
    country: "Pakistan",
    full: "Sheikhupura Road, Gujranwala",
  },
  showroom: "Muslim Road, Gujranwala",
  /** Gujranwala city centre, not the factory gate: replace with the exact pin from Google Maps when the profile is set up. */
  geo: { latitude: 32.1877, longitude: 74.1945 },
  /** ponytail: assumed hours (Mon–Sat, 9–6). Confirm with the owner; they feed JSON-LD and llms.txt. */
  hours: { display: "Mon – Sat, 9:00 – 18:00", opens: "09:00", closes: "18:00", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
  mark: "/images/brand/capra-mark.webp",
  markPng: "/images/brand/capra-mark.png",
  logoSquare: "/images/brand/capra-logo-square.png",
} as const;

export const CONTACT = {
  phone: "055 4253697",
  phoneTel: "tel:+92554253697",
  whatsapp: "0333 3324568",
  whatsappIntl: "+923333324568",
  whatsappLink: "https://wa.me/923333324568",
  email: "info@capra.pk",
  /** Where Resend delivers new orders and enquiries (owner, 22 Oct 2026); TO_EMAIL overrides. */
  inbox: "salmankhanindustries@gmail.com",
} as const;

/** Trade contact: the same WhatsApp as retail (owner, 20 Oct 2026). */
export const TRADE = {
  whatsapp: CONTACT.whatsapp,
  whatsappIntl: CONTACT.whatsappIntl,
  whatsappLink: CONTACT.whatsappLink,
  catalogue: "/documents/capra-dealer-catalogue-2026.pdf",
  catalogueDate: "1 October 2026",
} as const;

/** A WhatsApp chat opened with a message already typed, e.g. an order reference. */
export const whatsappWith = (text: string) => `${CONTACT.whatsappLink}?text=${encodeURIComponent(text)}`;

export const SOCIAL = {
  facebook: "https://facebook.com/capra.pk",
} as const;

/**
 * Where we deliver, biggest markets first. Drives `areaServed`, the delivery page and /llms.txt —
 * never hardcode a city in a page.
 */
export const SERVICE_AREAS = [
  "Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Gujranwala", "Multan", "Sialkot", "Peshawar",
  "Hyderabad", "Quetta", "Bahawalpur", "Sargodha", "Sahiwal", "Gujrat", "Sheikhupura", "Abbottabad", "Mardan",
] as const;

export const PROVINCES = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Kashmir"] as const;

/**
 * Money and delivery terms. Prices are whole rupees. The owner's choice (20 Oct 2026): retail = the factory list
 * + Rs 200 per size, as written in src/content/products.ts.
 */
export const COMMERCIAL = {
  currency: "PKR",
  /** No flat fee: the customer pays the courier or builty charge at actual cost (owner, 27 Oct 2026). */
  deliveryShort: "At actual cost",
  deliveryTerms: "Delivery (courier or builty) is not included in our prices: you pay the actual charge for your parcel.",
  dispatch: "1–2 working days",
  deliveryTime: "2–5 working days after dispatch",
  warrantyMonths: 24,
  returnDays: 7,
  /** The wholesale carton for bottles: 36 pieces, four colours mixed. */
  cartonPieces: 36,
  /** Jugs and flasks are sold by the carton: 12 pieces minimum per model (owner, 27 Oct 2026). */
  jugCartonPieces: 12,
} as const;

/**
 * Manual payment accounts, shown on the order page and in the order email once filled in. Leave a value
 * empty and the customer is told we will send the details on WhatsApp instead. Never put these in a page.
 */
export const PAYMENT_ACCOUNTS = {
  bank: { title: "", bank: "", iban: "" },
  jazzcash: { title: "", number: "" },
  easypaisa: { title: "", number: "" },
} as const;
