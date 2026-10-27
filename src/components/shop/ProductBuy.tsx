"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/primitives";
import { track } from "@/components/site/Tracker";
import { cn, pkr } from "@/lib/utils";
import type { Colour, Size } from "@/content/products";
import { addToCart } from "./cart";

/** The subset of a series the buying panel needs; prices here are display only — /api/cart re-prices. */
export interface Buyable {
  id: string;
  name: string;
  sizes: Size[];
  colours: Colour[];
  images: { src: string; alt: string }[];
  stock: number | null;
  colourByRequest?: boolean;
  /** Fewest pieces per order (`minQty`). */
  min: number;
}

/** Gallery + size + colour + quantity. Picking a colour shows its photo. */
export function ProductBuy({ item }: { item: Buyable }) {
  const [size, setSize] = useState(item.sizes[0]);
  const [colour, setColour] = useState(item.colours[0]);
  const [shown, setShown] = useState(0);
  const [qty, setQty] = useState(item.min);
  const [added, setAdded] = useState(false);
  const cap = Math.min(50, item.stock ?? 50);
  const soldOut = cap < item.min;
  const unit = size.price + colour.add;
  const label = "mb-2 block text-xs font-medium uppercase tracking-[0.18em] text-stone-600";

  function pickColour(c: Colour) {
    setColour(c);
    setShown(c.image);
    setAdded(false);
  }
  function onAdd() {
    addToCart(item.id, qty, `${size.value}/${colour.value}`);
    track("add_to_cart", item.name, { qty, price: unit, sku: `${colour.prefix}${size.model}` });
    setAdded(true);
  }

  return (
    // min-w-0 on both columns: without it the thumbnail strip widens the grid track past a phone screen.
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 [&>*]:min-w-0">
      <div>
        {/* Contain, not cover: shop photos come in every shape, and a product must never be cropped. */}
        <div className="group relative aspect-square overflow-hidden rounded-3xl bg-white ring-1 ring-ink-950/5">
          <Image key={item.images[shown].src} src={item.images[shown].src} alt={item.images[shown].alt} fill priority sizes="(min-width:1024px) 50vw, 100vw" className="object-contain" />
          {item.images.length > 1 && (
            <>
              <button type="button" onClick={() => setShown((shown - 1 + item.images.length) % item.images.length)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-bone-50/90 text-ink-950 shadow-lift transition hover:bg-bone-50"><ChevronLeft className="h-5 w-5" aria-hidden /></button>
              <button type="button" onClick={() => setShown((shown + 1) % item.images.length)} aria-label="Next photo" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-bone-50/90 text-ink-950 shadow-lift transition hover:bg-bone-50"><ChevronRight className="h-5 w-5" aria-hidden /></button>
              <span className="absolute bottom-3 right-3 rounded-full bg-ink-950/70 px-2.5 py-1 text-xs text-bone-50 tnum" aria-live="polite">{shown + 1} / {item.images.length}</span>
            </>
          )}
        </div>
        {item.images.length > 1 && (
          <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1" aria-label="More photos">
            {item.images.map((im, i) => (
              <li key={im.src} className="shrink-0">
                <button type="button" onClick={() => setShown(i)} aria-label={`Show photo ${i + 1}: ${im.alt}`} aria-pressed={shown === i} className={cn("relative block h-20 w-20 overflow-hidden rounded-xl ring-2 transition", shown === i ? "ring-ink-950" : "ring-transparent hover:ring-ink-950/30")}>
                  <Image src={im.src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="grid content-start gap-7">
        <div>
          <p className="font-display text-4xl tnum">{pkr(unit)}</p>
          <p className="mt-1 text-sm text-stone-600">Model <span className="font-medium text-ink-950">{colour.prefix}{size.model}</span> · {size.label} · {colour.label}</p>
        </div>

        <fieldset>
          <legend className={label}>Size</legend>
          <div className="flex flex-wrap gap-2">
            {item.sizes.map((z) => (
              <label key={z.value} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-ink-950/15 px-4 py-2 text-sm text-stone-700 transition hover:border-ink-950/35 has-[:checked]:border-ink-950 has-[:checked]:bg-ink-950/5 has-[:checked]:text-ink-950 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-focus">
                <input type="radio" name={`size-${item.id}`} value={z.value} checked={size.value === z.value} onChange={() => { setSize(z); setAdded(false); }} className="sr-only" />
                {z.label}<span className="tnum text-xs text-clay-700">{pkr(z.price + colour.add)}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className={label}>{item.colourByRequest ? "Colour preference" : "Finish"}: <span className="normal-case tracking-normal text-ink-950">{colour.label}</span></legend>
          <div className="flex flex-wrap gap-3">
            {item.colours.map((c) => (
              <label key={c.value} title={c.label} className="relative cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-focus rounded-full">
                <input type="radio" name={`colour-${item.id}`} value={c.value} checked={colour.value === c.value} onChange={() => pickColour(c)} className="sr-only" aria-label={`${c.label}${c.add ? `, plus ${pkr(c.add)}` : ""}`} />
                <span className={cn("grid h-11 w-11 place-items-center rounded-full ring-2 ring-offset-2 ring-offset-bone-50 transition", colour.value === c.value ? "ring-ink-950" : "ring-ink-950/10 hover:ring-ink-950/30")} style={{ background: c.hex }}>
                  {colour.value === c.value && <Check className="h-4 w-4 text-white mix-blend-difference" aria-hidden />}
                </span>
                {c.add > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-brass-400 px-1.5 text-[11px] font-semibold text-ink-950 tnum">+{c.add}</span>}
              </label>
            ))}
          </div>
          {item.colourByRequest && <p className="mt-3 text-xs text-stone-600">Packed four colours to a carton. If yours is short we call before sending another.</p>}
        </fieldset>

        {soldOut ? (
          <div className="rounded-2xl border border-warning/25 bg-warning/10 p-4 text-sm text-warning">Out of stock just now. <Link href="/contact" className="underline underline-offset-4">Ask us when it is back</Link>.</div>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-ink-950/15">
              <button type="button" aria-label="One fewer" disabled={qty <= item.min} onClick={() => setQty(qty - 1)} className="grid h-12 w-11 place-items-center disabled:opacity-30"><Minus className="h-4 w-4" /></button>
              <input aria-label="Quantity" type="number" inputMode="numeric" min={item.min} max={cap} value={qty} onChange={(e) => setQty(Math.min(cap, Math.max(item.min, Math.round(Number(e.target.value) || item.min))))} className="w-10 bg-transparent text-center text-sm tnum [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none" />
              <button type="button" aria-label="One more" disabled={qty >= cap} onClick={() => setQty(qty + 1)} className="grid h-12 w-11 place-items-center disabled:opacity-30"><Plus className="h-4 w-4" /></button>
            </div>
            <Button type="button" onClick={onAdd} className="min-h-12 flex-1">{added ? "Added — add another" : `Add to basket · ${pkr(unit * qty)}`}</Button>
          </div>
        )}
        {added && <Link href="/checkout" className="text-sm font-medium text-clay-700 underline underline-offset-4">Go to checkout →</Link>}
        <ul className="grid gap-2 border-t border-ink-950/10 pt-6 text-sm text-stone-600">
          {item.min > 1 && <li>✓ Sold by the carton: {item.min} pieces minimum</li>}
          <li>✓ Cash on delivery anywhere in Pakistan</li>
          <li>✓ Delivery (courier or builty) at actual cost</li>
          <li>✓ 2-year warranty · 7-day returns</li>
        </ul>
      </div>
    </div>
  );
}

/** Shop cards: pick a size, add the default finish. The full picker is on the product page. */
export function QuickAdd({ id, name, sizes, colour, soldOut, min }: { id: string; name: string; sizes: Size[]; colour: Colour; soldOut: boolean; min: number }) {
  const [size, setSize] = useState(sizes[0]);
  const [added, setAdded] = useState(false);
  if (soldOut) return <p className="text-sm text-warning">Out of stock</p>;
  return (
    <div className="flex items-center gap-2">
      <label className="sr-only" htmlFor={`qa-${id}`}>Size of {name}</label>
      <select id={`qa-${id}`} value={size.value} onChange={(e) => { setSize(sizes.find((z) => z.value === e.target.value)!); setAdded(false); }} className="min-h-11 min-w-0 flex-1 rounded-full border border-ink-950/30 bg-bone-50 px-4 text-sm">
        {sizes.map((z) => <option key={z.value} value={z.value}>{z.label} · {pkr(z.price)}</option>)}
      </select>
      <Button type="button" className="min-h-11 shrink-0 px-5" onClick={() => { addToCart(id, min, `${size.value}/${colour.value}`); track("add_to_cart", name, { qty: min, price: size.price }); setAdded(true); }}>{added ? "Added ✓" : min > 1 ? `Add ${min}` : "Add"}</Button>
    </div>
  );
}
