import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/primitives";
import { stockStatus, type ShopItem } from "@/lib/shop";
import { pkr } from "@/lib/utils";
import { DISCOUNT_PCT, minQty } from "@/content/products";
import { QuickAdd } from "./ProductBuy";

/** One series on a listing: photo, discount bubble, sizes, sale and list price, and a quick add. `eager` for the first row (LCP). */
export function ProductCard({ item, eager, headingLevel = "h3" }: { item: ShopItem; eager?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const s = item.series;
  const status = stockStatus(item);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-ink-950/10 bg-bone-50 transition-shadow duration-300 hover:shadow-lift">
      <Link href={item.href} tabIndex={-1} aria-hidden className="relative block aspect-square overflow-hidden bg-white">
        <Image src={item.image} alt={s.images[0].alt} fill sizes="(min-width:1440px) 320px, (min-width:1024px) calc(25vw - 28px), (min-width:640px) calc(50vw - 36px), calc(100vw - 42px)" {...(eager ? { loading: "eager" as const } : {})} className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]" />
        <span className="absolute left-3 top-3 flex gap-1.5">{s.colours.map((c) => <span key={c.value} title={c.label} className="h-4 w-4 rounded-full ring-2 ring-bone-50" style={{ background: c.hex }} />)}</span>
        <span className="absolute right-3 top-3 grid h-12 w-12 place-items-center rounded-full bg-clay-700 font-display text-lg font-bold text-white shadow-lift tnum">-{DISCOUNT_PCT}%</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <H className="text-xl font-bold normal-case leading-tight text-ink-700"><Link href={item.href} className="hover:underline">{item.name}</Link></H>
        <p className="mt-1 font-display text-sm font-semibold uppercase tracking-wide text-stone-600">{s.sizes.map((z) => z.label.replace(" litres", "L").replace(" litre", "L")).join(" · ")}</p>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-stone-600">{item.summary}</p>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-2 font-display tnum">
          <span className="text-sm font-medium text-stone-600">from</span>
          <span className="text-2xl font-bold text-clay-700">{pkr(item.fromPrice)}</span>
          <s className="text-base font-medium text-ink-950/70"><span className="sr-only">List price </span>{pkr(item.fromWas)}</s>
          <Badge tone={status.tone} className="ml-auto font-sans">{status.label}</Badge>
        </p>
        <div className="mt-4"><QuickAdd id={item.id} name={item.name} sizes={s.sizes} colour={s.colours[0]} soldOut={status.schema === "OutOfStock"} min={minQty(s)} /></div>
      </div>
    </article>
  );
}
