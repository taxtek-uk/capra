/**
 * The CAPRA range and its prices — the shop's pricing source of truth.
 *
 * Every price is the factory price list dated 1 October 2026 plus Rs 200 per size (whole rupees; owner,
 * 20 Oct 2026). A coloured finish is the "C" model of the same size (CSLD-1 for
 * SLD-1) at +Rs 100, exactly as the list says. Never write a price anywhere else: pages, emails, JSON-LD and
 * /llms.txt all read from here through src/lib/shop.ts.
 */
import { COMMERCIAL } from "@/lib/brand";

export type Family ="vacuum-jugs" | "insulated-bottles";

export interface Size {
  value: string;
  label: string;
  /** Model code on the price list, without the colour prefix. */
  model: string;
  price: number;
  /** Litres, for comparison tables and structured data. */
  litres: number;
}

export interface Colour {
  value: string;
  label: string;
  /** Swatch colour for the picker. */
  hex: string;
  /** Added to the size price. */
  add: number;
  /** Prepended to the model code: "C" makes SLD-1 into CSLD-1. */
  prefix: string;
  /** Index into `images` that shows this colour. */
  image: number;
}

export interface Series {
  slug: string;
  family: Family;
  /** Shown everywhere: "SLD Vacuum Jug". The brand is added where it reads well. */
  name: string;
  series: string;
  summary: string;
  description: string[];
  features: string[];
  sizes: Size[];
  colours: Colour[];
  /** True when the colour is a preference we confirm from a mixed carton, not a separate model. */
  colourByRequest?: boolean;
  images: { src: string; alt: string }[];
  specs: [string, string][];
  bestFor: string;
  seo: { title: string; description: string; keywords: string[] };
  faqs: { q: string; a: string }[];
}

const img = (slug: string, n: number | "card", alt: string) => ({ src: `/images/products/${slug}-${n}.webp`, alt });

const STEEL: Colour = { value: "steel", label: "Stainless steel", hex: "#c9ccd1", add: 0, prefix: "", image: 0 };
const coloured = (value: string, label: string, hex: string, image: number): Colour => ({ value, label, hex, add: 100, prefix: "C", image });
const pick = (value: string, label: string, hex: string, image = 0): Colour => ({ value, label, hex, add: 0, prefix: "", image });

const JUG_SPECS: [string, string][] = [
  ["Body", "304 stainless steel, inside and out"],
  ["Insulation", "Double-wall vacuum"],
  ["Use", "Hot and cold drinks"],
  ["Care", "Hand wash; do not put in the microwave or freezer"],
];

export const SERIES: Series[] = [
  {
    slug: "sld-vacuum-jug",
    family: "vacuum-jugs",
    name: "SLD Vacuum Jug",
    series: "SLD",
    summary: "The classic rounded tea jug with a black pour lid. 1, 2 or 3 litres, in steel or copper.",
    description: [
      "The SLD is the jug most homes in Pakistan picture when they say thermos: a round, stable stainless steel body, a wide black handle and a screw-in pour lid that you tip to serve. Fill it with chai after breakfast and pour cups through the morning; fill it with iced water in summer and it stays cold on the table.",
      "It comes in three sizes. The 1 litre serves two or three people, the 2 litre suits a family table or a small office, and the 3 litre is the one for guests, mehfils and long days at the shop. The copper finish is the same jug in a warm metallic colour.",
    ],
    features: ["Double-wall vacuum keeps tea hot and water cold", "Unbreakable stainless steel, no glass inside", "Screw-in pour lid that seals when closed", "Wide handle and a flat, stable base"],
    sizes: [
      { value: "1l", label: "1 litre", model: "SLD-1", price: 1680, litres: 1 },
      { value: "2l", label: "2 litres", model: "SLD-2", price: 1785, litres: 2 },
      { value: "3l", label: "3 litres", model: "SLD-3", price: 2100, litres: 3 },
    ],
    colours: [STEEL, coloured("copper", "Copper", "#7b3f22", 2)],
    images: [
      img("sld", "card", "CAPRA SLD stainless steel vacuum jug with black pour lid and handle"),
      img("sld", 2, "CAPRA SLD vacuum jug in brushed stainless steel"),
      img("sld", 3, "CAPRA SLD vacuum jug in copper finish (CSLD)"),
      img("sld", 4, "CAPRA vacuum jugs beside their gift box with a cup of tea"),
      img("sld", 5, "CAPRA vacuum jugs in red, steel, blue and rose colours"),
      img("sld", 1, "CAPRA SLD jug from the handle side, beside its box"),
      img("sld", 6, "Top view of the CAPRA SLD jug's pour lid"),
    ],
    specs: [["Sizes", "1, 2 and 3 litres"], ["Lid", "Screw-in pour lid"], ...JUG_SPECS],
    bestFor: "Family chai, guests and the office",
    seo: {
      title: "SLD Vacuum Jug 1L, 2L, 3L – Price in Pakistan",
      description: "CAPRA SLD stainless steel vacuum jug for tea and water, 1, 2 and 3 litres, from Rs 1,680. Steel or copper. Cash on delivery across Pakistan.",
      keywords: ["vacuum jug price in pakistan", "thermos jug for tea", "1 litre thermos", "2 litre thermos", "3 litre thermos", "chai flask"],
    },
    faqs: [
      { q: "Which size SLD jug should I buy?", a: "The 1 litre pours about four cups of chai, the 2 litre about eight and the 3 litre about twelve. Most families choose the 2 litre; the 3 litre is for guests and offices." },
      { q: "What is the difference between SLD and CSLD?", a: "Nothing but the finish. CSLD is the same SLD jug in copper colour and costs Rs 100 more than the steel one in each size." },
    ],
  },
  {
    slug: "rit-push-button-flask",
    family: "vacuum-jugs",
    name: "RIT Push-Button Flask",
    series: "RIT",
    summary: "One-hand pouring: press the red tab and pour. 1 or 2 litres, in steel or blue.",
    description: [
      "The RIT is a vacuum flask with a push-button lid. Hold the handle, press the red tab with your thumb and pour; let go and it closes. Nothing to unscrew between cups, which is why it is popular for offices, counters and anyone serving a table one-handed.",
      "The body is polished stainless steel with a black lid and handle, and the blue version adds a deep colour finish. The lid lifts off completely for filling and cleaning.",
    ],
    features: ["Push-button pour lid, one-hand use", "Lid lifts off for easy filling and washing", "Double-wall vacuum stainless steel", "Steel or deep blue finish"],
    sizes: [
      { value: "1l", label: "1 litre", model: "RIT-010", price: 1753, litres: 1 },
      { value: "2l", label: "2 litres", model: "RIT-020", price: 1858, litres: 2 },
    ],
    colours: [STEEL, coloured("blue", "Blue", "#1f4fa8", 1)],
    images: [
      img("rit", "card", "CAPRA RIT push-button vacuum flask in polished stainless steel"),
      img("rit", 2, "CAPRA RIT push-button flask in blue (CRIT)"),
      img("rit", 3, "CAPRA push-button flasks in blue and white"),
      img("rit", 4, "CAPRA RIT stainless steel flask on a dark background"),
      img("rit", 5, "CAPRA RIT flask standing on its gift box"),
      img("rit", 6, "Pressing the red release tab on the CAPRA RIT lid to pour"),
      img("rit", 7, "The wide opening of the CAPRA RIT flask with the lid off"),
      img("rit", 8, "The CAPRA RIT push-button lid with its red tab"),
    ],
    specs: [["Sizes", "1 and 2 litres"], ["Lid", "Push-button pour lid with release tab"], ...JUG_SPECS],
    bestFor: "Offices, counters and one-hand serving",
    seo: {
      title: "RIT Push-Button Vacuum Flask 1L & 2L – Pakistan",
      description: "CAPRA RIT push-button vacuum flask: press to pour, 1 or 2 litres, steel or blue, from Rs 1,753. Delivered across Pakistan, cash on delivery.",
      keywords: ["push button thermos", "vacuum flask price in pakistan", "office thermos", "hot and cold flask"],
    },
    faqs: [
      { q: "Does the push-button lid leak?", a: "The lid closes when you release the tab. Keep the flask upright when it is full and make sure the lid is screwed down fully after filling." },
      { q: "Can I take the lid off to clean it?", a: "Yes. The whole lid unscrews, so you can wash the lid and reach inside the flask with a bottle brush." },
    ],
  },
  {
    slug: "cpr-vacuum-pot",
    family: "vacuum-jugs",
    name: "CPR Vacuum Pot",
    series: "CPR",
    summary: "A tall, straight-sided vacuum pot that holds more on a small table. 1 or 2 litres, steel or red.",
    description: [
      "The CPR is our upright vacuum pot: a straighter body that takes up less room on a dastarkhwan or office desk, with a flat black lid, a firm handle and a brushed steel finish. It comes boxed, which makes it an easy gift for weddings and Eid.",
      "Choose the brushed steel for a classic look or the glossy red for colour on the table.",
    ],
    features: ["Upright body that fits small tables", "Flat lid with a firm seal", "Brushed or glossy red stainless steel", "Gift box included"],
    sizes: [
      { value: "1l", label: "1 litre", model: "CPR-010", price: 2058, litres: 1 },
      { value: "2l", label: "2 litres", model: "CPR-020", price: 2165, litres: 2 },
    ],
    colours: [STEEL, coloured("red", "Red", "#b3121b", 1)],
    images: [
      img("cpr", "card", "CAPRA CPR vacuum pot in brushed stainless steel"),
      img("cpr", 3, "CAPRA CPR vacuum pot in glossy red (CCPR)"),
      img("cpr", 1, "CAPRA CPR vacuum pot on a shop shelf"),
      img("cpr", 4, "CAPRA CPR vacuum pot beside its yellow gift box"),
      img("cpr", 5, "CAPRA vacuum pot and gift box on a shop shelf"),
    ],
    specs: [["Sizes", "1 and 2 litres"], ["Lid", "Flat screw lid with pour spout"], ["Packaging", "Gift box"], ...JUG_SPECS],
    bestFor: "Gifts and small tables",
    seo: {
      title: "CPR Vacuum Pot 1L & 2L – Thermos Price in Pakistan",
      description: "CAPRA CPR stainless steel vacuum pot, 1 or 2 litres, brushed steel or red, from Rs 2,058. A boxed gift for Eid and weddings. Delivered across Pakistan.",
      keywords: ["vacuum pot", "thermos gift", "thermos price in pakistan", "stainless steel tea pot flask"],
    },
    faqs: [
      { q: "Does the CPR come in a gift box?", a: "Yes, every CPR vacuum pot comes in its own printed CAPRA box." },
      { q: "What is CCPR?", a: "CCPR is the CPR pot in glossy red. It is Rs 100 more than the steel CPR of the same size." },
    ],
  },
  {
    slug: "skm-vacuum-coffee-pot",
    family: "vacuum-jugs",
    name: "SKM Coffee Pot Flask",
    series: "SKM",
    summary: "A slim, tall coffee-pot shape with a steel flip lid. 1, 2 or 3 litres, steel or green.",
    description: [
      "The SKM has the tall, elegant line of a hotel coffee pot: a slim stainless steel body, a polished steel flip lid and a black handle. It looks at home on a breakfast table or a meeting room tray, and pours cleanly from a narrow spout.",
      "Three sizes, from a 1 litre for two people to a 3 litre for a full table, and a glossy green finish if you want colour.",
    ],
    features: ["Slim coffee-pot shape with a narrow spout", "Polished steel flip lid", "Double-wall vacuum stainless steel", "Steel or glossy green"],
    sizes: [
      { value: "1l", label: "1 litre", model: "SKM-1", price: 2058, litres: 1 },
      { value: "2l", label: "2 litres", model: "SKM-2", price: 2165, litres: 2 },
      { value: "3l", label: "3 litres", model: "SKM-3", price: 2480, litres: 3 },
    ],
    colours: [STEEL, coloured("green", "Green", "#0f6e5a", 2)],
    images: [
      img("skm", "card", "CAPRA SKM stainless steel coffee pot flask with steel lid"),
      img("skm", 2, "CAPRA SKM flask on a wooden board with lemons"),
      img("skm", 3, "CAPRA SKM coffee pot flask in green (CSKM)"),
      img("skm", 4, "Two CAPRA SKM flasks on a breakfast table"),
      img("skm", 5, "CAPRA SKM flasks in 2 and 1 litre sizes"),
      img("skm", 6, "The spout and handle of the CAPRA SKM flask"),
    ],
    specs: [["Sizes", "1, 2 and 3 litres"], ["Lid", "Steel flip lid with press lever"], ...JUG_SPECS],
    bestFor: "Coffee, breakfast tables and meetings",
    seo: {
      title: "SKM Coffee Pot Vacuum Flask 1–3L – Pakistan",
      description: "CAPRA SKM stainless steel coffee pot flask with steel flip lid, 1, 2 or 3 litres, from Rs 2,058. Steel or green, cash on delivery across Pakistan.",
      keywords: ["coffee flask", "coffee pot thermos", "vacuum flask pakistan", "hot water flask"],
    },
    faqs: [
      { q: "Is the SKM only for coffee?", a: "No. It keeps tea, kahwa and hot water hot, and cold water cold, like every CAPRA jug. The coffee-pot shape just pours neatly into small cups." },
      { q: "How does the lid open?", a: "Press the lever on the steel flip lid to pour; it closes again when you release it." },
    ],
  },
  {
    slug: "ykc-vacuum-jug",
    family: "vacuum-jugs",
    name: "YKC Vacuum Jug",
    series: "YKC",
    summary: "A tall jug with a red release tab and a coloured band. 1, 2 or 3 litres, steel or orange.",
    description: [
      "The YKC pairs a tall stainless steel body with a black flip-top lid, a red release tab and a thin coloured band near the base. Press the tab to pour, release it to close.",
      "It is offered in 1, 2 and 3 litres in steel, and in a bright orange finish that stands out on any table.",
    ],
    features: ["Flip-top lid with red release tab", "Tall body with a coloured band", "Double-wall vacuum stainless steel", "Steel or bright orange"],
    sizes: [
      { value: "1l", label: "1 litre", model: "YKC-1", price: 1860, litres: 1 },
      { value: "2l", label: "2 litres", model: "YKC-2", price: 1965, litres: 2 },
      { value: "3l", label: "3 litres", model: "YKC-3", price: 2280, litres: 3 },
    ],
    colours: [STEEL, coloured("orange", "Orange", "#e2502d", 1)],
    images: [
      img("ykc", "card", "CAPRA YKC stainless steel vacuum jug with red release tab"),
      img("ykc", 2, "CAPRA YKC vacuum jug in orange (CYKC) on a table"),
    ],
    specs: [["Sizes", "1, 2 and 3 litres"], ["Lid", "Flip-top lid with release tab"], ...JUG_SPECS],
    bestFor: "A bright everyday jug",
    seo: {
      title: "YKC Vacuum Jug 1L, 2L, 3L – Thermos Pakistan",
      description: "CAPRA YKC stainless steel vacuum jug with flip-top lid, 1, 2 or 3 litres, from Rs 1,860. Steel or orange. Cash on delivery anywhere in Pakistan.",
      keywords: ["vacuum jug", "thermos for chai", "stainless steel thermos jug", "hot and cold jug"],
    },
    faqs: [
      { q: "What is CYKC?", a: "CYKC is the YKC jug in orange, Rs 100 more than the steel YKC of the same size." },
      { q: "Which is bigger, YKC-2 or YKC-3?", a: "YKC-3 holds 3 litres, YKC-2 holds 2 litres and YKC-1 holds 1 litre." },
    ],
  },
  {
    slug: "ms-sports-bottle",
    family: "insulated-bottles",
    name: "MS Sports Bottle",
    series: "MS",
    summary: "An insulated stainless steel bottle with a carry strap. 600 or 750 ml, in five colours.",
    description: [
      "The MS sports bottle is a double-wall stainless steel bottle printed with SPORTS down the side, with a fabric sleeve at the neck and a carry strap. It goes to school, the gym, the cricket ground and the car, keeping water cold in summer and tea hot in winter.",
      "Two sizes: 600 ml for a school bag and 750 ml for a long day out. Pick the colour you would like; bottles are packed four colours to a carton, so if one runs short we call you before sending another.",
    ],
    features: ["Double-wall insulated stainless steel", "Carry strap and grip sleeve", "Leak-resistant screw cap", "Five colours"],
    sizes: [
      { value: "600ml", label: "600 ml", model: "MS-600", price: 885, litres: 0.6 },
      { value: "750ml", label: "750 ml", model: "MS-750", price: 915, litres: 0.75 },
    ],
    colours: [pick("black", "Black", "#1b1b1b", 2), pick("blue", "Blue", "#1d3f8f", 0), pick("red", "Red", "#b3121b", 0), pick("gold", "Gold", "#b08d57", 0), pick("silver", "Silver", "#c9ccd1", 0)],
    colourByRequest: true,
    images: [
      img("ms", "card", "CAPRA MS sports bottles in black, red, blue, gold and silver"),
      img("ms", 1, "CAPRA MS sports bottles in silver, red and navy"),
      img("ms", 3, "CAPRA MS sports bottles in black and bronze with straps"),
      img("ms", 4, "Black CAPRA MS insulated sports bottle"),
      img("ms", 5, "CAPRA MS sports bottles and their boxes in many colours"),
      img("ms", 6, "Navy CAPRA MS sports bottle with its carry strap"),
    ],
    specs: [["Sizes", "600 ml and 750 ml"], ["Body", "Stainless steel, double-wall"], ["Cap", "Screw cap"], ["Carry", "Fabric strap"], ["Wholesale", "36 pieces per carton, 4 colours mixed"]],
    bestFor: "School, gym and travel",
    seo: {
      title: "MS Insulated Sports Bottle 600ml & 750ml – Pakistan",
      description: "CAPRA MS stainless steel insulated sports bottle with strap, 600 ml or 750 ml, from Rs 885. Hot and cold. Cash on delivery all over Pakistan.",
      keywords: ["sports water bottle", "insulated water bottle price in pakistan", "steel water bottle for school", "750ml bottle"],
    },
    faqs: [
      { q: "Can I choose the colour?", a: "Yes, choose your colour when you order. Bottles come four colours to a carton, so if your colour is short we will call you before sending a different one." },
      { q: "Is it good for school?", a: "Yes. The 600 ml fits most school bags, the strap makes it easy to carry, and the steel body does not crack when dropped." },
    ],
  },
  {
    slug: "bm-bullet-flask",
    family: "insulated-bottles",
    name: "BM Bullet Flask",
    series: "BM",
    summary: "A slim, classic bullet flask with a cup lid. 600 ml or 1 litre, in black, blue or silver.",
    description: [
      "The BM is the slim bullet flask: a smooth stainless steel cylinder with a domed cap that comes off as a cup. It slides into a bag or a car door and keeps tea or coffee hot for the commute and water cold on the way back.",
      "Choose 600 ml for one person or 1 litre to share. Colours are packed four to a carton, so if your colour is short we call you before we send.",
    ],
    features: ["Slim bullet shape for bags and car doors", "Cap doubles as a cup", "Double-wall insulated stainless steel", "Black, blue or silver"],
    sizes: [
      { value: "600ml", label: "600 ml", model: "BM600", price: 905, litres: 0.6 },
      { value: "1l", label: "1 litre", model: "BM1000", price: 1050, litres: 1 },
    ],
    colours: [pick("black", "Black", "#2a2b2e", 0), pick("blue", "Blue", "#1e6fc2", 0), pick("silver", "Silver", "#c9ccd1", 0)],
    colourByRequest: true,
    images: [
      img("bm", "card", "CAPRA BM bullet flasks in black, blue and silver"),
      img("bm", 2, "Three CAPRA BM bullet flasks on a wet surface"),
      img("bm", 3, "CAPRA insulated bottles in black, blue, red and silver with box"),
      img("bm", 4, "CAPRA silver bullet flasks with their gift boxes"),
    ],
    specs: [["Sizes", "600 ml and 1 litre"], ["Body", "Stainless steel, double-wall"], ["Cap", "Cup cap and inner stopper"], ["Wholesale", "36 pieces per carton, 4 colours mixed"]],
    bestFor: "Commuting, office and travel",
    seo: {
      title: "BM Bullet Flask 600ml & 1L – Vacuum Bottle Pakistan",
      description: "CAPRA BM stainless steel bullet vacuum flask with cup lid, 600 ml or 1 litre, from Rs 905. Black, blue or silver. Cash on delivery in Pakistan.",
      keywords: ["bullet flask", "vacuum bottle price in pakistan", "1 litre thermos bottle", "tea flask for travel"],
    },
    faqs: [
      { q: "Does the BM flask have a cup?", a: "Yes. The top cap unscrews and works as a cup, with a stopper underneath that keeps the drink sealed." },
      { q: "Is 1 litre too big to carry?", a: "The 1 litre is still slim enough for most bags and a car door. The 600 ml is lighter if it is just for you." },
    ],
  },
];

export const FAMILIES: Record<Family, { name: string; short: string; path: string; eyebrow: string; lede: string; hero: string; heroAlt: string; seo: { title: string; description: string } }> = {
  "vacuum-jugs": {
    name: "Vacuum jugs & flasks",
    short: "Vacuum jugs",
    path: "/vacuum-jugs",
    eyebrow: "1, 2 and 3 litres",
    lede: "Stainless steel jugs for chai, coffee, kahwa and cold water: five shapes, steel or a colour finish, at factory prices.",
    hero: "/images/banners/jugs-dark.webp",
    heroAlt: "CAPRA stainless steel vacuum jugs on a dark background",
    seo: {
      title: "Vacuum Jugs & Thermos Flasks – Price in Pakistan",
      description: "Buy CAPRA stainless steel vacuum jugs and thermos flasks for tea and water, 1 to 3 litres, from Rs 1,680. Cash on delivery across Pakistan.",
    },
  },
  "insulated-bottles": {
    name: "Insulated bottles",
    short: "Bottles",
    path: "/insulated-bottles",
    eyebrow: "600 ml to 1 litre",
    lede: "Double-wall stainless steel bottles for school, the gym, the office and the road: the MS sports bottle and the BM bullet flask.",
    hero: "/images/banners/bottles-wet.webp",
    heroAlt: "CAPRA bullet flasks in black, blue and silver",
    seo: {
      title: "Insulated Water Bottles & Bullet Flasks – Pakistan",
      description: "CAPRA insulated stainless steel water bottles and bullet flasks, 600 ml to 1 litre, from Rs 885. Hot and cold, cash on delivery across Pakistan.",
    },
  },
};

/** The fewest pieces of one model a basket line can hold: a carton of jugs, or a single bottle. */
export const minQty = (s: Pick<Series, "family">) => (s.family === "vacuum-jugs" ? COMMERCIAL.jugCartonPieces : 1);
export const seriesHref =(s: Pick<Series, "family" | "slug">) => `${FAMILIES[s.family].path}/${s.slug}`;
export const fromPrice = (s: Series) => Math.min(...s.sizes.map((z) => z.price));
export const toPrice = (s: Series) => Math.max(...s.sizes.map((z) => z.price)) + Math.max(...s.colours.map((c) => c.add));
