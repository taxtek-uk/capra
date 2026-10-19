/** Single source of truth for brand, contact and legal identity. */
export const BRAND = {
  name: "CAPRA",
  legalName: "Salman Industries",
  domain: "https://www.capra.pk",
  tagline: "Make Life Easy.",
  description: "Stainless steel vacuum jugs, flasks and insulated bottles, made by Salman Industries in Gujranwala and delivered across Pakistan with cash on delivery.",
  locale: "en-PK",
  founded: "2019",
  address: {
    street: "Makki Road, Jinnah Colony, on Same Nala",
    city: "Gujranwala",
    region: "Punjab",
    country: "Pakistan",
    full: "Makki Road, Jinnah Colony, on Same Nala, Gujranwala, Punjab, Pakistan",
  },
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
  whatsapp: "0311 0075000",
  whatsappIntl: "+923110075000",
  whatsappLink: "https://wa.me/923110075000",
  email: "info@capra.pk",
} as const;

/** Published trade contact, Dealer Catalogue 2026 pp. 1, 10–11; retail stays in CONTACT. */
export const TRADE = {
  whatsapp: "0333 3324568",
  whatsappIntl: "+923333324568",
  whatsappLink: "https://wa.me/923333324568",
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
 * Money and delivery terms. Prices are whole rupees. The owner's choice (19 Oct 2026): the shop sells at the
 * factory list price, so retail = the price list in src/content/products.ts.
 */
export const COMMERCIAL = {
  currency: "PKR",
  deliveryFee: 250,
  freeDeliveryFrom: 5000,
  dispatch: "1–2 working days",
  deliveryTime: "2–5 working days after dispatch",
  warrantyMonths: 24,
  returnDays: 7,
  /** The wholesale carton for bottles: 36 pieces, four colours mixed. */
  cartonPieces: 36,
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
