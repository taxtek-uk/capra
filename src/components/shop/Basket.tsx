"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { Minus, Plus } from "lucide-react";
import { Button, ButtonLink, Arrow } from "@/components/ui/primitives";
import { fieldClass } from "@/components/ui/fields";
import { pkr } from "@/lib/utils";
import { COMMERCIAL } from "@/lib/brand";
import { useSearchString } from "@/lib/use-search-string";
import type { CartItem, PricedCart } from "@/lib/shop";
import { useCart, setQty, removeLine, replaceCart } from "./cart";

/** Re-prices the stored basket on the server whenever it changes. Never prices anything itself. */
export function usePricedCart(lines: CartItem[]) {
  const [cart, setCart] = useState<PricedCart | null>(null);
  const [failed, setFailed] = useState(false);
  const key = JSON.stringify(lines);

  useEffect(() => {
    if (key === "[]") return;
    let live = true;
    (async () => {
      const res = await fetch("/api/cart", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ items: JSON.parse(key) }) }).catch(() => null);
      const json = await res?.json().catch(() => null);
      if (!live) return;
      if (json?.ok) { setCart(json.cart as PricedCart); setFailed(false); } else setFailed(true);
    })();
    return () => { live = false; };
  }, [key]);

  return lines.length ? { cart, failed } : { cart: null, failed: false };
}

export function Totals({ cart }: { cart: PricedCart }) {
  const row = (label: string, value: string, strong?: boolean) => (
    <div className={`flex justify-between gap-4 py-2 ${strong ? "border-t border-ink-950/10 pt-3 text-base font-medium" : "text-sm"}`}>
      <span className={strong ? "" : "text-stone-600"}>{label}</span><span className="tnum">{value}</span>
    </div>
  );
  return (
    <div>
      {row(`Subtotal (${cart.count} item${cart.count === 1 ? "" : "s"})`, pkr(cart.subtotal))}
      {row("Delivery", COMMERCIAL.deliveryShort)}
      {row("Total", pkr(cart.total), true)}
      {cart.note && <p className="mt-3 text-xs text-stone-600">{cart.note}</p>}
    </div>
  );
}

/** A basket reopened from its emailed link (?saved=id.token) replaces what is on this device. */
function useRestoreSaved() {
  const saved = new URLSearchParams(useSearchString()).get("saved");
  const [state, setState] = useState<"idle" | "done" | "missing">("idle");
  useEffect(() => {
    if (!saved || !/^[\w-]{8,40}\.[\w-]{16,64}$/.test(saved)) return;
    fetch(`/api/saved-basket?s=${encodeURIComponent(saved)}`).then((r) => r.json()).then((j) => {
      if (j?.ok) { replaceCart(j.items as CartItem[]); setState("done"); } else setState("missing");
      history.replaceState(history.state, "", location.pathname);
    }, () => setState("missing"));
  }, [saved]);
  return state;
}

function SaveBasket({ lines }: { lines: CartItem[] }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");
  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    const res = await fetch("/api/saved-basket", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: fd.get("email"), remind: fd.get("remind") === "on", items: lines, page: location.pathname }) }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (json?.ok) setState("done");
    else { setState("error"); setError(json?.error ?? "We could not send that just now."); }
  }
  if (state === "done") return <p className="mt-6 text-sm text-success" role="status">Sent. Check your inbox for a link back to this basket.</p>;
  return (
    <details className="mt-6 border-t border-ink-950/10 pt-5">
      <summary className="text-sm font-medium text-clay-700">Not ready? Email me this basket</summary>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <label className="sr-only" htmlFor="sb-email">Email address</label>
        <input id="sb-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={fieldClass} />
        <label className="flex cursor-pointer gap-2 text-xs text-stone-600"><input type="checkbox" name="remind" className="mt-0.5" />Email me one reminder tomorrow if I have not ordered yet.</label>
        <Button type="submit" variant="ghost" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Email my basket"}</Button>
        {error && <p className="text-xs text-danger" role="alert">{error}</p>}
      </form>
    </details>
  );
}

export function Basket() {
  const restored = useRestoreSaved();
  const lines = useCart();
  const { cart, failed } = usePricedCart(lines);

  if (!lines.length) {
    return (
      <div className="rounded-2xl border border-ink-950/10 p-10 text-center">
        <p className="font-display text-2xl">{restored === "missing" ? "That saved basket has expired." : "Your basket is empty."}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-stone-600">Vacuum jugs from 1 to 3 litres and insulated bottles for school, work and travel, with cash on delivery.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/vacuum-jugs">Vacuum jugs <Arrow /></ButtonLink>
          <ButtonLink href="/insulated-bottles" variant="ghost">Insulated bottles</ButtonLink>
        </div>
      </div>
    );
  }
  if (failed) return <p className="rounded-2xl border border-ink-950/10 p-8 text-sm text-danger" role="alert">We could not price your basket just now. Please refresh, or WhatsApp us to order.</p>;
  if (!cart) return <p className="rounded-2xl border border-ink-950/10 p-8 text-sm text-stone-600" role="status">Pricing your basket…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      {restored === "done" && <p role="status" className="rounded-2xl border border-brass-500/40 bg-brass-500/5 p-4 text-sm text-stone-600 lg:col-span-2">Your saved basket is back, priced at today&rsquo;s list prices.</p>}
      <ul className="divide-y divide-ink-950/10 border-y border-ink-950/10">
        {cart.lines.map((l) => (
          <li key={`${l.id}:${l.variant}`} className="flex gap-4 py-5">
            <Image src={l.image} alt="" width={96} height={96} className="h-24 w-24 shrink-0 rounded-xl bg-bone-100 object-cover" />
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-medium"><Link href={l.href} className="hover:underline">{l.name}</Link></h2>
              <p className="mt-0.5 text-xs text-stone-600">{l.variantLabel} · {l.sku}</p>
              <p className="mt-2 text-sm text-stone-600 tnum">{pkr(l.unit)} each</p>
              {l.min > 1 && <p className="mt-1 text-xs text-stone-600">Sold by the carton: {l.min} pieces minimum.</p>}
              {l.clamped && <p className="mt-1 text-xs text-clay-700">We only have {l.qty} of these, so the quantity has been reduced.</p>}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex items-center rounded-full border border-ink-950/15">
                  <button type="button" aria-label={`One fewer ${l.name}`} disabled={l.qty <= l.min} onClick={() => setQty(l.id, l.qty - 1, l.variant)} className="grid h-10 w-10 place-items-center disabled:opacity-30"><Minus className="h-3.5 w-3.5" /></button>
                  <span className="w-8 text-center text-sm tnum" aria-label="Quantity">{l.qty}</span>
                  <button type="button" aria-label={`One more ${l.name}`} onClick={() => setQty(l.id, l.qty + 1, l.variant)} className="grid h-10 w-10 place-items-center"><Plus className="h-3.5 w-3.5" /></button>
                </div>
                <button type="button" onClick={() => removeLine(l.id, l.variant)} className="text-xs text-stone-600 underline underline-offset-4 hover:text-danger">Remove</button>
              </div>
            </div>
            <p className="shrink-0 font-display text-lg tnum">{pkr(l.amount)}</p>
          </li>
        ))}
      </ul>

      <aside className="rounded-2xl border border-ink-950/10 bg-bone-100 p-6">
        <h2 className="font-display text-xl">Order summary</h2>
        <div className="mt-4"><Totals cart={cart} /></div>
        <ButtonLink href="/checkout" className="mt-6 w-full">Checkout <Arrow /></ButtonLink>
        <p className="mt-3 text-center text-xs text-stone-600">Cash on delivery, bank transfer, JazzCash or Easypaisa.</p>
        {cart.rejected.length > 0 && <p className="mt-4 text-xs text-clay-700">{cart.rejected.length} item{cart.rejected.length === 1 ? " is" : "s are"} no longer available and {cart.rejected.length === 1 ? "has" : "have"} been removed.</p>}
        <SaveBasket lines={lines} />
      </aside>
    </div>
  );
}
