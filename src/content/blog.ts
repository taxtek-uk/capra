import { SERIES, fromPrice } from "./products";
import { COMMERCIAL } from "@/lib/brand";
import { pkr } from "@/lib/utils";

/**
 * Built-in journal posts. Add a new object to the top of POSTS and the journal, sitemap, search and
 * /llms-full.txt pick it up. A post edited in /admin is saved to the database and takes over.
 * Prices are read from src/content/products.ts, so a price change can never leave a post out of date.
 */
type Img = { src: string; alt: string; w: number; h: number };

export interface Post {
  slug: string;
  title: string;
  seoTitle?: string;
  excerpt: string;
  category: "Guides" | "Prices" | "Care" | "Buying advice";
  date: string;
  image: Img;
  sections: { heading?: string; paragraphs: string[]; image?: Img }[];
  keywords?: string[];
  areas?: string[];
  faqs?: { q: string; a: string }[];
}

const s = (slug: string) => SERIES.find((x) => x.slug === slug)!;
const price = (slug: string, model: string) => pkr(s(slug).sizes.find((z) => z.model === model)!.price);
const jugsFrom = pkr(Math.min(...SERIES.filter((x) => x.family === "vacuum-jugs").map(fromPrice)));
const bottlesFrom = pkr(Math.min(...SERIES.filter((x) => x.family === "insulated-bottles").map(fromPrice)));

export const POSTS: Post[] = [
  {
    slug: "thermos-price-in-pakistan",
    title: "Thermos price in Pakistan (2026): what a good vacuum flask costs",
    seoTitle: "Thermos Price in Pakistan 2026: Vacuum Flask Guide",
    excerpt: "What a stainless steel thermos, vacuum jug or insulated bottle costs in Pakistan in 2026, size by size, and what you get for the money at each price.",
    category: "Prices",
    date: "2026-10-19",
    image: { src: "/images/banners/range-light.webp", alt: "The CAPRA range of vacuum jugs in steel and colour finishes", w: 1920, h: 1080 },
    keywords: ["thermos price in pakistan", "vacuum flask price in pakistan", "1 litre thermos price", "2 litre thermos price", "thermos jug price"],
    areas: ["Lahore", "Karachi", "Islamabad", "Gujranwala"],
    sections: [
      {
        paragraphs: [
          "Search for a thermos in Pakistan and you will find prices that run from a few hundred rupees to well over Rs 10,000. The difference is not only the brand on the side. It is what the flask is made of, whether it has a real vacuum between two steel walls, how well the lid seals and how long it lasts. This guide sets out what a good flask costs in 2026 and what to look for, using our own CAPRA price list as the reference point because those are the numbers we can stand behind.",
        ],
      },
      {
        heading: "Vacuum jug prices by size",
        paragraphs: [
          `Table-top vacuum jugs are the thermos most Pakistani homes use for chai. A stainless steel CAPRA jug starts at ${jugsFrom} for 1 litre. Our classic SLD jug is ${price("sld-vacuum-jug", "SLD-1")} for 1 litre, ${price("sld-vacuum-jug", "SLD-2")} for 2 litres and ${price("sld-vacuum-jug", "SLD-3")} for 3 litres. The push-button RIT flask is ${price("rit-push-button-flask", "RIT-010")} for 1 litre and ${price("rit-push-button-flask", "RIT-020")} for 2.`,
          `The taller designs cost a little more because there is more steel in them and the lids are more involved: the SKM coffee pot runs from ${price("skm-vacuum-coffee-pot", "SKM-1")} to ${price("skm-vacuum-coffee-pot", "SKM-3")}, and the boxed CPR vacuum pot is ${price("cpr-vacuum-pot", "CPR-010")} or ${price("cpr-vacuum-pot", "CPR-020")}. Every jug also comes in a colour finish for Rs 100 more than the steel version.`,
        ],
      },
      {
        heading: "Insulated bottle and bullet flask prices",
        paragraphs: [
          `Personal bottles cost less because they hold less. Our MS sports bottle starts at ${bottlesFrom} for 600 ml and is ${price("ms-sports-bottle", "MS-750")} for 750 ml. The slim BM bullet flask is ${price("bm-bullet-flask", "BM600")} for 600 ml and ${price("bm-bullet-flask", "BM1000")} for 1 litre.`,
          "If you see a 1 litre steel bottle advertised for much less than this, check whether it is genuinely double-walled. A single-wall steel bottle is just a water bottle: it will not keep anything hot, and in summer it gets warm in your hand within minutes.",
        ],
      },
      {
        heading: "Why the cheapest thermos is rarely the cheapest",
        paragraphs: [
          "Low prices usually come from one of three shortcuts. The first is glass refills: older flasks have a mirrored glass inner bottle that breaks the first time the flask falls. The second is thin or low-grade steel, which dents and can rust at the welds. The third is a poor lid, which is where most heat escapes and most leaks start.",
          "A flask you replace every winter costs more than one that lasts for years. That is why we make every CAPRA jug from stainless steel inside and out, with no glass to break, and why every product carries a " + COMMERCIAL.warrantyMonths + "-month warranty against manufacturing faults.",
        ],
      },
      {
        heading: "Delivery and cash on delivery",
        paragraphs: [
          `Online prices only make sense once delivery is added. We deliver anywhere in Pakistan by courier or builty, and you pay the actual delivery charge on top of the price. Jugs and flasks are sold by the carton, ${COMMERCIAL.jugCartonPieces} pieces minimum, and you can pay in cash when the parcel arrives. Bank transfer, JazzCash and Easypaisa are accepted too.`,
          "Our prices are the factory price list, so there is no market markup between the factory and your door. If you are buying in bulk for a shop, an office or wedding gifts, the wholesale page explains carton packing and volume orders.",
        ],
      },
      {
        heading: "Which one should you buy?",
        paragraphs: [
          "For a family table, a 2 litre jug is the best value: it pours about eight cups and costs only a little more than the 1 litre. For guests, offices and long days at a shop, choose a 3 litre. For school, the gym or the car, a 600 or 750 ml bottle is the right size, and a 1 litre bullet flask suits anyone who wants to share their chai on the road.",
        ],
      },
    ],
    faqs: [
      { q: "How much is a 1 litre thermos in Pakistan?", a: `A stainless steel 1 litre CAPRA vacuum jug costs from ${jugsFrom}, and a 1 litre BM bullet flask is ${price("bm-bullet-flask", "BM1000")}.` },
      { q: "How much is a 3 litre thermos jug?", a: `The CAPRA SLD 3 litre jug is ${price("sld-vacuum-jug", "SLD-3")}, and the SKM 3 litre coffee pot flask is ${price("skm-vacuum-coffee-pot", "SKM-3")}.` },
      { q: "Is delivery included in the price?", a: `No. ${COMMERCIAL.deliveryTerms} You can pay cash on delivery.` },
    ],
  },
  {
    slug: "how-to-choose-a-vacuum-flask",
    title: "How to choose a vacuum flask: size, lid and steel explained",
    seoTitle: "How to Choose a Vacuum Flask: Size, Lid & Steel",
    excerpt: "A plain guide to choosing a thermos jug or insulated bottle: which size suits your family, which lid pours best, and how to tell good stainless steel from bad.",
    category: "Buying advice",
    date: "2026-10-12",
    image: { src: "/images/banners/jugs-colours.webp", alt: "CAPRA vacuum jugs in red, steel, blue and rose finishes", w: 1004, h: 579 },
    keywords: ["best thermos in pakistan", "vacuum flask for tea", "thermos jug for chai", "how to choose a thermos", "stainless steel vacuum flask"],
    sections: [
      {
        paragraphs: [
          "Every vacuum flask works the same way: two walls of steel with the air pumped out between them. Without air, heat has almost nothing to travel through, so hot drinks stay hot and cold drinks stay cold. What separates a flask you love from one you put away is everything around that vacuum: the size, the lid, the steel and how it feels to pour.",
        ],
      },
      {
        heading: "Start with the size",
        paragraphs: [
          "A vacuum flask keeps heat best when it is nearly full, so buy the size you will actually fill. A 1 litre jug pours about four cups of chai and suits a couple or a small household. A 2 litre jug pours about eight and is the usual choice for a family breakfast table. A 3 litre jug is for guests, offices, shops and long gatherings.",
          "For one person on the move, look at bottles instead: 600 ml covers a school day or a gym session, 750 ml a long day out, and a 1 litre bullet flask holds enough chai to share on a journey.",
        ],
      },
      {
        heading: "Choose the lid by how you pour",
        paragraphs: [
          "Screw-in pour lids, like the one on our SLD jug, are simple and seal firmly; you tip the jug to pour and twist to close. Push-button lids, like the RIT, let you pour with one hand: press the tab, pour, let go. Flip-top lids with a lever, like the SKM and YKC, pour cleanly into small cups and close themselves.",
          "If the flask will sit on a counter or office desk and be used all day, a push-button or lever lid saves a lot of twisting. If it will travel in a bag or a car, a screw lid or a bottle cap is the safer choice.",
        ],
      },
      {
        heading: "Check the steel and the build",
        paragraphs: [
          "Look for stainless steel on the inside as well as the outside. Steel inside means there is no glass refill to shatter if the flask falls, and no plastic touching hot tea. Food-grade 304 stainless steel resists rust and does not hold on to flavours, which is why we use it for every CAPRA jug.",
          "Pick the flask up. The base should sit flat, the handle should not flex, and the lid should thread on smoothly without forcing. A flask that rattles or wobbles in the shop will not improve at home.",
        ],
      },
      {
        heading: "Think about who will use it",
        paragraphs: [
          "A heavy 3 litre jug full of tea is a lot for a child or an elderly relative to lift with one hand; two smaller jugs can be easier. Bright colour finishes are easy to spot on a crowded table or in a school bag. Boxed designs such as our CPR vacuum pot make simple, useful gifts for weddings and Eid.",
        ],
      },
      {
        heading: "Our quick recommendations",
        paragraphs: [
          "Family chai: the SLD jug in 2 litres. Office or shop counter: the RIT push-button flask. Breakfast table or coffee: the SKM coffee pot. A gift: the boxed CPR vacuum pot. School and gym: the MS sports bottle. Commuting: the BM bullet flask. The comparison table on our price list page puts every model side by side.",
        ],
      },
    ],
    faqs: [
      { q: "What size thermos is best for a family?", a: "A 2 litre vacuum jug pours about eight cups and suits most family tables. Choose 3 litres for guests or a large household." },
      { q: "Are steel flasks better than glass flasks?", a: "For daily use, yes. A stainless steel inner wall cannot shatter when the flask is knocked over, and it is easier to clean." },
      { q: "Which lid is best for one-hand pouring?", a: "A push-button lid such as the CAPRA RIT: press the tab with your thumb, pour, and release to close." },
    ],
  },
  {
    slug: "how-long-does-a-vacuum-flask-keep-tea-hot",
    title: "How long does a vacuum flask keep tea hot? Seven ways to make it last",
    seoTitle: "How Long Does a Thermos Keep Tea Hot? 7 Tips",
    excerpt: "What decides how long a thermos keeps chai hot or water cold, and seven simple habits that make any vacuum flask hold its temperature for longer.",
    category: "Guides",
    date: "2026-10-05",
    image: { src: "/images/banners/jugs-tea.webp", alt: "CAPRA vacuum jugs beside a cup of tea", w: 1920, h: 668 },
    keywords: ["how long does a thermos keep tea hot", "keep tea hot for hours", "hot and cold flask", "thermos tips"],
    sections: [
      {
        paragraphs: [
          "There is no single number for how long a flask keeps tea hot, whatever the box says. The answer depends on the flask, how full it is, how hot the tea was, how often you open it and how cold the room is. What we can say is which of those you control, and how to get the most from any vacuum flask, including ours.",
        ],
      },
      {
        heading: "What decides how long it stays hot",
        paragraphs: [
          "The vacuum between the two walls stops almost all heat moving through the sides. That leaves two paths: the neck and lid, where steel meets plastic and air, and the inside air gap above the tea. A wide jug with a pour lid loses heat faster than a narrow bottle with a screw cap, simply because its opening is bigger and it is opened more often.",
          "Volume matters too. A full 3 litre jug holds far more heat than a half-full 1 litre one, so it stays hot for longer even though both have the same walls.",
        ],
      },
      {
        heading: "Seven habits that keep chai hotter",
        paragraphs: [
          "1. Warm the flask first. Pour in boiling water, close it for five minutes, then empty it. Cold steel takes heat out of the first tea you pour in.",
          "2. Fill it close to the top. Less air space means less heat lost every time you open it.",
          "3. Pour in tea straight off the boil. Every degree you start with is a degree you keep.",
          "4. Close the lid fully every time. A lid left half open is the biggest single loss.",
          "5. Open it less. Pour two cups at a time rather than one if you can.",
          "6. Keep it out of cold draughts and off cold floors in winter.",
          "7. Keep the seal clean. A gasket coated in old tea does not seal as tightly; wash it every few days.",
        ],
      },
      {
        heading: "Keeping water cold in summer",
        paragraphs: [
          "The same flask works the other way. Chill it first with iced water, fill it with cold water and ice, and keep it out of direct sun. A steel bottle in a hot car will still do far better than a plastic one, but shade helps any flask.",
          "Never put a sealed flask in the freezer. Water expands as it freezes and can damage the seal and the inner wall.",
        ],
      },
      {
        heading: "When a flask stops keeping heat",
        paragraphs: [
          "If a flask that used to keep tea hot now gets warm on the outside within minutes of filling, the vacuum has probably been lost, usually after a hard fall. That is a fault of the walls, not the lid, and it cannot be repaired at home. A CAPRA product that loses its vacuum through a manufacturing fault within the " + COMMERCIAL.warrantyMonths + "-month warranty is covered; send us a photo and your order number.",
        ],
      },
    ],
    faqs: [
      { q: "Why does my thermos not keep tea hot?", a: "Most often the flask was not pre-warmed, was only part full, or the lid was not closed fully. If the outside gets hot, the vacuum has been lost and the flask needs replacing." },
      { q: "Can I put ice in a vacuum flask?", a: "Yes. Ice and cold water stay cold for a long time in a vacuum flask. Do not freeze the flask itself." },
    ],
  },
  {
    slug: "how-to-clean-a-thermos-flask",
    title: "How to clean a thermos flask: tea stains, smells and the lid",
    seoTitle: "How to Clean a Thermos Flask: Tea Stains & Smell",
    excerpt: "How to clean a stainless steel thermos or vacuum jug at home: remove brown tea stains, get rid of smells, clean the lid and seal, and what never to use.",
    category: "Care",
    date: "2026-09-28",
    image: { src: "/images/banners/jugs-ice.webp", alt: "CAPRA stainless steel vacuum jugs with ice", w: 1004, h: 579 },
    keywords: ["how to clean thermos", "remove tea stains from flask", "thermos smell", "clean vacuum flask"],
    sections: [
      {
        paragraphs: [
          "Doodh patti leaves a brown film inside any flask, and a lid that is never taken apart starts to smell. The good news is that stainless steel cleans easily with things already in a Pakistani kitchen. Here is how we clean our own CAPRA jugs and bottles.",
        ],
      },
      {
        heading: "Everyday cleaning",
        paragraphs: [
          "Rinse the flask with warm water as soon as it is empty, before the tea dries on. Once a day, wash it with warm water and a drop of washing-up liquid, using a soft bottle brush for the inside and the neck. Rinse well and leave it upside down to dry with the lid off, so no moisture is trapped inside.",
        ],
      },
      {
        heading: "Removing brown tea stains",
        paragraphs: [
          "For stains, add two tablespoons of baking soda (meetha soda) to the flask, fill it with hot water, close it and leave it for 20 minutes to an hour. Pour it out, scrub gently with the brush and rinse. For heavy stains, leave it overnight.",
          "White vinegar works too: fill the flask a quarter full with vinegar, top up with hot water and leave it for an hour before washing. Lemon juice with a little salt does the same job if you have no vinegar.",
        ],
      },
      {
        heading: "Getting rid of smells",
        paragraphs: [
          "A smell almost always comes from the lid, not the steel. Unscrew the lid, take out any removable seal or gasket, and wash each part in warm soapy water. Soak the seal in baking soda water for half an hour if it smells, then let every part dry completely before you put it back together.",
          "Store the flask with the lid off, or loosely resting on top. A flask sealed while damp is the most common cause of a sour smell.",
        ],
      },
      {
        heading: "What never to use",
        paragraphs: [
          "Do not use bleach or chlorine cleaners, which can pit stainless steel and damage seals. Do not use steel wool or scouring powder, which scratches the inside and gives stains somewhere to cling. Do not put the flask in a dishwasher or microwave, and never freeze it full of liquid.",
        ],
      },
      {
        heading: "How often to deep clean",
        paragraphs: [
          "If you drink chai from the flask every day, a baking soda clean once a week keeps it bright. Take the lid apart and wash the seal at the same time. Looked after this way, a stainless steel flask stays clean and fresh for years.",
        ],
      },
    ],
    faqs: [
      { q: "How do I remove tea stains from a thermos?", a: "Fill it with hot water and two tablespoons of baking soda, close it and leave it for 20 minutes to overnight, then scrub with a soft bottle brush and rinse." },
      { q: "Can I wash a vacuum flask in a dishwasher?", a: "No. Hand wash it with warm soapy water. A dishwasher can damage the seal and the outer finish." },
      { q: "Why does my flask smell?", a: "Usually because the lid and its seal have not been taken apart and dried. Wash each part, soak the seal in baking soda water, and store the flask with the lid off." },
    ],
  },
];
