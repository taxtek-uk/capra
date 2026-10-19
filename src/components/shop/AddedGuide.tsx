"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { ButtonLink, Arrow } from "@/components/ui/primitives";
import { pkr } from "@/lib/utils";
import { useCart } from "./cart";
import { usePricedCart, Totals } from "./Basket";

/**
 * "What now?" after an item goes in the basket. It hangs off the store's `capra:added` event
 * rather than the buttons, so every way into the basket — a product page, a shop card, a
 * repeat order — lands on the same guidance without each caller knowing about it.
 *
 * A native <dialog> with showModal(): focus trap, Escape, the page behind made inert and the
 * top layer all come free, so there is no bespoke modal to keep accessible.
 */
export function AddedGuide() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [last, setLast] = useState<{ id: string; variant?: string } | null>(null);
  const lines = useCart();
  const { cart, failed } = usePricedCart(lines);
  const pathname = usePathname();

  // The basket and checkout pages are the guidance, so it would only talk over itself there.
  const off = pathname === "/cart" || pathname.startsWith("/checkout");

  useEffect(() => {
    if (off) return;
    const onAdded = (e: Event) => {
      setLast((e as CustomEvent<{ id: string; variant?: string }>).detail);
      if (!dialog.current?.open) dialog.current?.showModal();
    };
    window.addEventListener("capra:added", onAdded);
    return () => window.removeEventListener("capra:added", onAdded);
  }, [off]);

  // Following a link out of the panel should leave it behind.
  useEffect(() => {
    dialog.current?.close();
  }, [pathname]);

  const added = cart?.lines.find((l) => l.id === last?.id && (l.variant ?? "") === (last?.variant ?? ""));

  return (
    <dialog
      ref={dialog}
      aria-labelledby="added-guide-title"
      onClick={(e) => e.target === dialog.current && dialog.current.close()}
      className="panel-enter m-0 ml-auto h-full max-h-full w-full max-w-md bg-bone-50 text-ink-950 shadow-lift backdrop:bg-ink-950/50 backdrop:backdrop-blur-sm sm:rounded-l-3xl"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-ink-950/10 px-6 py-5">
          <p id="added-guide-title" className="flex items-center gap-2 font-display text-xl">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brass-500 text-ink-950"><Check className="h-3.5 w-3.5" /></span>
            Added to your basket
          </p>
          <button type="button" onClick={() => dialog.current?.close()} aria-label="Close and keep shopping" className="-m-2 grid h-9 w-9 place-items-center rounded-full text-stone-600 hover:bg-ink-950/5 hover:text-ink-950">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {added && (
            <div className="flex gap-4">
              <Image src={added.image} alt="" width={80} height={80} className="h-20 w-20 shrink-0 rounded-xl bg-bone-100 object-cover" />
              <div className="min-w-0">
                <p className="text-sm font-medium">{added.name}</p>
                {added.variantLabel && <p className="mt-0.5 text-xs text-stone-600">{added.variantLabel}</p>}
                <p className="mt-1 text-sm text-stone-600 tnum">{added.qty} × {pkr(added.unit)}</p>
              </div>
            </div>
          )}

          <div className="mt-6 rounded-2xl border border-ink-950/10 bg-bone-100 p-5">
            <h2 className="font-display text-lg">Your basket so far</h2>
            <div className="mt-3">
              {failed
                ? <p className="text-sm text-danger" role="alert">We could not price your basket just now. Open the basket to try again.</p>
                : cart
                  ? <Totals cart={cart} />
                  : <p className="text-sm text-stone-600" role="status">Pricing your basket…</p>}
            </div>
          </div>

          <h2 className="mt-6 font-display text-lg">What happens next</h2>
          <ol className="mt-3 grid gap-3 text-sm text-stone-600">
            {[
              "Check the basket: change sizes or quantities any time before you order.",
              "Give us your address and phone. Pay cash on delivery, or by JazzCash, Easypaisa or bank.",
              "We call or WhatsApp to confirm, then dispatch from Gujranwala with tracking.",
            ].map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-950 text-xs font-medium text-bone-50 tnum">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>


        </div>

        <div className="safe-bottom border-t border-ink-950/10 bg-bone-50 px-6 pt-5">
          <ButtonLink href="/checkout" className="w-full">Checkout{cart ? ` · ${pkr(cart.total)}` : ""} <Arrow /></ButtonLink>
          <div className="mt-3 flex items-center justify-between gap-4 text-sm">
            <Link href="/cart" className="text-clay-700 underline underline-offset-4">View basket</Link>
            <button type="button" onClick={() => dialog.current?.close()} className="text-stone-600 underline underline-offset-4 hover:text-ink-950">Keep shopping</button>
          </div>
          <p className="mt-3 text-center text-xs text-stone-600">Your basket is saved on this device, so there is no rush.</p>
        </div>
      </div>
    </dialog>
  );
}
