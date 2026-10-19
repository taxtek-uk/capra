import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/primitives";
import { stockStatus, type ShopItem } from "@/lib/shop";
import { pkr } from "@/lib/utils";
import { QuickAdd } from "./ProductBuy";

/** One series on a listing: photo, sizes, from-price and a quick add. `eager` for the first row (LCP). */
export function ProductCard({ item, eager, headingLevel = "h3" }: { item: ShopItem; eager?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  const s = item.series;
  const status = stockStatus(item);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-ink-950/10 bg-bone-50">
      <Link href={item.href} tabIndex={-1} aria-hidden className="relative block aspect-square overflow-hidden bg-white">
        <Image src={item.image} alt={s.images[0].alt} fill sizes="(min-width:1440px) 320px, (min-width:1024px) calc(25vw - 28px), (min-width:640px) calc(50vw - 36px), calc(100vw - 42px)" {...(eager ? { loading: "eager" as const } : {})} className="object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-[1.04]" />
        <span className="absolute left-3 top-3 flex gap-1.5">{s.colours.map((c) => <span key={c.value} title={c.label} className="h-4 w-4 rounded-full ring-2 ring-bone-50" style={{ background: c.hex }} />)}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone={status.tone}>{status.label}</Badge>
          <span className="text-xs uppercase tracking-[0.18em] text-stone-600">{s.sizes.map((z) => z.label.replace(" litres", "L").replace(" litre", "L")).join(" · ")}</span>
        </div>
        <H className="mt-3 text-lg font-medium"><Link href={item.href} className="hover:underline">{item.name}</Link></H>
        <p className="mt-1 flex-1 text-sm text-stone-600">{item.summary}</p>
        <p className="mt-4 font-display text-2xl tnum"><span className="text-sm text-stone-600">from </span>{pkr(item.fromPrice)}</p>
        <div className="mt-4"><QuickAdd id={item.id} name={item.name} sizes={s.sizes} colour={s.colours[0]} soldOut={item.stock === 0} /></div>
      </div>
    </article>
  );
}
