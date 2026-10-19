import { SERIES, FAMILIES, fromPrice, seriesHref } from "./products";

/** `image`, `price` and `sizes` are set on product items, for the shop menus. */
export type NavItem = { label: string; href: string; blurb?: string; image?: string; price?: number; sizes?: string };

/** Navigation model: two shop groups with one-line descriptions, then flat links. */
export const NAV = {
  groups: (["vacuum-jugs", "insulated-bottles"] as const).map((f) => ({
    label: FAMILIES[f].short,
    eyebrow: FAMILIES[f].name,
    href: FAMILIES[f].path,
    items: SERIES.filter((s) => s.family === f).map((s): NavItem => ({ label: s.name, href: seriesHref(s), blurb: s.bestFor, image: s.images[0].src, price: fromPrice(s), sizes: s.sizes.map((z) => z.label.replace(/ litres?/, "L")).join(" · ") })),
  })),
  links: [
    { label: "Shop all", href: "/shop" },
    { label: "Price list", href: "/prices" },
    { label: "Wholesale", href: "/wholesale" },
    { label: "Journal", href: "/blog" },
  ] satisfies NavItem[],
  help: [
    { label: "Choose a thermos", href: "/thermos-flasks" },
    { label: "Dealer catalogue", href: "/dealers" },
    { label: "Help & FAQs", href: "/help" },
    { label: "Delivery & returns", href: "/delivery" },
    { label: "Warranty", href: "/warranty" },
    { label: "Care guide", href: "/care-guide" },
    { label: "About CAPRA", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],
  legal: [{ label: "Privacy", href: "/privacy-policy" }, { label: "Terms", href: "/terms-of-service" }] satisfies NavItem[],
  announcement: { badge: "COD", text: "Cash on delivery all over Pakistan · free delivery on orders over Rs 5,000", short: "Cash on delivery · free over Rs 5,000", href: "/delivery" },
};
