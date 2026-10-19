import Image from "next/image";
import Link from "next/link";
import { pageMeta, JsonLd, faqLd } from "@/lib/seo";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { CtaBand } from "@/components/site/CtaBand";
import { Container, Section, Eyebrow } from "@/components/ui/primitives";
import { FAMILIES, SERIES, seriesHref } from "@/content/products";
import { COMMERCIAL } from "@/lib/brand";
import { pkr } from "@/lib/utils";

export const metadata = pageMeta({
  title: "Thermos & Vacuum Flask Price List 2026 – CAPRA",
  description: "Every CAPRA vacuum jug, thermos flask and insulated bottle with model number, size and price in PKR. Compare SLD, RIT, CPR, SKM, YKC, MS and BM side by side.",
  path: "/prices",
});

const FAQ = [
  { q: "What does the C in CSLD or CRIT mean?", a: "C is the colour finish. CSLD-1 is the SLD-1 jug in copper, CRIT-010 the RIT-010 in blue, and so on. Each colour model is Rs 100 more than the steel one." },
  { q: "Are these the final prices?", a: `Yes. You pay the price shown plus Rs ${COMMERCIAL.deliveryFee} delivery, and delivery is free on orders of Rs ${COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")} or more.` },
  { q: "Do you give a discount for bulk orders?", a: "Shops, offices and event planners can order by the carton. Send us your quantity on the wholesale page and we will reply with a quote." },
];

/** A model's photo beside its price, as on the factory price list. */
function PriceCell({ image, price }: { image: { src: string; alt: string }; price: number }) {
  return (
    <span className="flex items-center gap-3">
      <Image src={image.src} alt={image.alt} width={56} height={56} sizes="56px" className="h-14 w-14 shrink-0 rounded-lg bg-bone-100 object-cover" />
      <span className="font-medium tnum">{pkr(price)}</span>
    </span>
  );
}

/** The price list as plain tables: the page answer engines and shoppers comparing models both want. */
export default function Page() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <Section className="pt-32 sm:pt-40">
        <Container>
          <Breadcrumbs items={[{ name: "Price list", path: "/prices" }]} />
          <div className="mt-6 max-w-3xl">
            <Eyebrow>Price list · updated {new Date().toLocaleDateString("en-PK", { month: "long", year: "numeric" })}</Eyebrow>
            <h1 className="rise font-display text-4xl leading-[1.05] sm:text-5xl">CAPRA price list: every flask, jug and bottle compared.</h1>
            <p className="lede mt-5 text-base leading-relaxed sm:text-lg">Prices in Pakistani rupees, straight from our factory list. Steel is the base price; a colour finish adds Rs 100. Delivery Rs {COMMERCIAL.deliveryFee}, free over Rs {COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")}.</p>
          </div>

          {(["vacuum-jugs", "insulated-bottles"] as const).map((f) => (
            <div key={f} className="mt-14 overflow-x-auto rounded-2xl border border-ink-950/10">
              <table className="w-full min-w-[46rem] text-sm">
                <caption className="bg-bone-100 px-5 py-4 text-left font-display text-2xl">{FAMILIES[f].name}</caption>
                <thead><tr className="border-b border-ink-950/10 text-left text-xs uppercase tracking-[0.14em] text-stone-600">
                  <th className="px-5 py-3 font-medium">Design</th><th className="px-5 py-3 font-medium">Model</th><th className="px-5 py-3 font-medium">Size</th><th className="px-5 py-3 font-medium">Lid / feature</th>
                  <th className="px-5 py-3 font-medium">{f === "vacuum-jugs" ? "Steel" : "Price"}</th><th className="px-5 py-3 font-medium">{f === "vacuum-jugs" ? "Colour" : "Colours"}</th>
                </tr></thead>
                <tbody className="divide-y divide-ink-950/10">
                  {SERIES.filter((s) => s.family === f).flatMap((s) => s.sizes.map((z, i) => {
                    const colour = s.colours.find((c) => c.add > 0);
                    return (
                      <tr key={z.model} className={i === 0 ? "border-t-2 border-ink-950/10" : undefined}>
                        <td className="px-5 py-3">{i === 0 && <Link href={seriesHref(s)} className="font-medium hover:underline">{s.name}</Link>}</td>
                        <td className="px-5 py-3 tnum">{z.model}{colour && <span className="block text-xs text-stone-600">{colour.prefix}{z.model} in {colour.label.toLowerCase()}</span>}</td>
                        <td className="px-5 py-3">{z.label}</td>
                        <td className="px-5 py-3 text-stone-600">{i === 0 ? s.specs.find(([k]) => k === "Lid" || k === "Cap")?.[1] ?? s.bestFor : ""}</td>
                        <td className="px-5 py-3"><PriceCell image={s.images[0]} price={z.price} /></td>
                        <td className="px-5 py-3">
                          {colour
                            ? <PriceCell image={s.images[colour.image]} price={z.price + colour.add} />
                            : <span className="flex flex-wrap items-center gap-1.5 text-stone-600">{s.colours.map((c) => <span key={c.value} title={c.label} className="h-4 w-4 rounded-full ring-1 ring-ink-950/15" style={{ background: c.hex }} />)}<span className="ml-1 text-xs">same price</span></span>}
                        </td>
                      </tr>
                    );
                  }))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {FAQ.map((f) => <div key={f.q}><h2 className="font-medium">{f.q}</h2><p className="mt-2 text-sm leading-relaxed text-stone-600">{f.a}</p></div>)}
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
