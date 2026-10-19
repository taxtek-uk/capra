"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Info } from "lucide-react";
import { Button, ButtonLink, Arrow } from "@/components/ui/primitives";
import { fieldClass as field, labelClass as label } from "@/components/ui/fields";
import { track } from "@/components/site/Tracker";
import { CodeSignIn } from "@/components/account/CodeSignIn";
import { signOutHere } from "@/app/account/actions";
import { sourceMeta } from "@/lib/source";
import { cn, isPkPhone, pkr } from "@/lib/utils";
import { CONTACT, PROVINCES, SERVICE_AREAS } from "@/lib/brand";
import { MARKETING_CONSENT_TEXT } from "@/content/marketing";
import type { SavedDetails } from "@/lib/customer";
import { useCart, clearCart } from "./cart";
import { usePricedCart, Totals } from "./Basket";

const METHODS = [
  { value: "cod", label: "Cash on delivery", body: "Pay the courier in cash when your parcel arrives." },
  { value: "jazzcash", label: "JazzCash", body: "We WhatsApp you the account; dispatch once the transfer lands." },
  { value: "easypaisa", label: "Easypaisa", body: "We WhatsApp you the account; dispatch once the transfer lands." },
  { value: "bank", label: "Bank transfer", body: "IBAN details on your order page and by WhatsApp." },
] as const;
type Method = (typeof METHODS)[number]["value"];

/**
 * Checkout. The form collects who and where; the basket travels as ids and quantities and is re-priced
 * by /api/order, so the figure here is confirmation, never the amount charged. Phone is required and
 * email optional: most of our customers confirm by WhatsApp. Guests are never asked to sign in.
 */
export function Checkout({ accounts = false, saved = null }: { accounts?: boolean; saved?: SavedDetails | null }) {
  const router = useRouter();
  const lines = useCart();
  const { cart, failed } = usePricedCart(lines);
  const [state, setState] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");
  const [bad, setBad] = useState<Record<string, string>>({});
  const [method, setMethod] = useState<Method>("cod");
  const a = saved?.address;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    if (fd.get("website")) return; // honeypot
    const problems: Record<string, string> = {};
    for (const el of form.querySelectorAll<HTMLInputElement>("input[required], select[required]")) if (!el.checkValidity()) problems[el.id] = el.validity.typeMismatch ? "Please enter a valid email address." : "Please fill in this field.";
    if (!problems["co-phone"] && !isPkPhone(String(fd.get("phone")))) problems["co-phone"] = "Please enter a Pakistani number, e.g. 0300 1234567.";
    const email = String(fd.get("email") ?? "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) problems["co-email"] = "Please enter a valid email address, or leave it blank.";
    setBad(problems);
    const first = Object.keys(problems)[0];
    if (first) { document.getElementById(first)?.focus(); return; }

    setState("sending");
    setError("");
    const f = Object.fromEntries(fd.entries()) as Record<string, string>;
    const res = await fetch("/api/order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        items: lines,
        paymentMethod: method,
        contact: { name: f.name, phone: f.phone, email: f.email, notes: f.notes },
        address: { line1: f.line1, line2: f.line2, city: f.city, province: f.province, postcode: f.postcode },
        saveDetails: f.saveDetails === "on",
        marketing: f.marketing === "on",
        page: location.pathname,
        meta: sourceMeta(),
      }),
    }).catch(() => null);
    const json = await res?.json().catch(() => null);
    if (!res?.ok || !json?.ok) {
      setState("error");
      setError(json?.error ?? `We could not place that order. Please try again, or WhatsApp ${CONTACT.whatsapp}.`);
      return;
    }
    track("order_placed", json.ref, { method, total: json.total ?? 0 });
    clearCart();
    router.push(json.path as string);
  }

  if (!lines.length) {
    return (
      <div className="rounded-2xl border border-ink-950/10 p-10 text-center">
        <p className="font-display text-2xl">Nothing to check out.</p>
        <p className="mt-2 text-sm text-stone-600">Your basket is empty.</p>
        <ButtonLink href="/shop" className="mt-6">Browse the shop <Arrow /></ButtonLink>
      </div>
    );
  }

  const err = (id: string) => (bad[id] ? <p id={`${id}-error`} className="mt-1.5 text-xs text-danger">{bad[id]}</p> : null);
  const aria = (id: string) => ({ "aria-invalid": !!bad[id], "aria-describedby": bad[id] ? `${id}-error` : undefined });

  return (
    <form key={saved?.email ?? "guest"} onSubmit={onSubmit} className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start" noValidate data-form="checkout">
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />

      <div className="grid gap-8">
        {accounts && !saved && (
          <details className="rounded-2xl border border-ink-950/10 bg-bone-100 p-6">
            <summary className="cursor-pointer text-sm text-stone-600"><span className="font-medium text-ink-950">Ordered with us before?</span> Sign in with an emailed code and we will fill in your details.</summary>
            <div className="mt-4"><CodeSignIn /></div>
          </details>
        )}

        <fieldset className="rounded-2xl border border-ink-950/10 p-6">
          <legend className="px-2 font-display text-xl">Your details</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className={label} htmlFor="co-name">Full name</label><input id="co-name" name="name" required minLength={2} autoComplete="name" defaultValue={saved?.name} className={field} placeholder="Your name" {...aria("co-name")} />{err("co-name")}</div>
            <div><label className={label} htmlFor="co-phone">Mobile number</label><input id="co-phone" name="phone" type="tel" required inputMode="tel" autoComplete="tel" defaultValue={saved?.phone} className={field} placeholder="0300 1234567" {...aria("co-phone")} />{err("co-phone")}</div>
            <div className="sm:col-span-2"><label className={label} htmlFor="co-email">Email <span className="text-stone-600">(optional, for your receipt)</span></label><input id="co-email" name="email" type="email" autoComplete="email" defaultValue={saved?.email} readOnly={Boolean(saved)} className={cn(field, saved && "text-stone-600")} placeholder="you@example.com" {...aria("co-email")} />{err("co-email")}</div>
          </div>
          {saved && <p className="mt-3 text-xs text-stone-600">Signed in as {saved.email}. <button type="button" onClick={async () => { await signOutHere(); router.refresh(); }} className="underline underline-offset-4">Not you?</button></p>}
          {!saved?.subscribed && (
            <label className="mt-4 flex cursor-pointer gap-3 text-sm text-stone-600"><input type="checkbox" name="marketing" className="mt-1" /><span>{MARKETING_CONSENT_TEXT}</span></label>
          )}
        </fieldset>

        <fieldset className="rounded-2xl border border-ink-950/10 p-6">
          <legend className="px-2 font-display text-xl">Delivery address</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className={label} htmlFor="co-line1">House and street</label><input id="co-line1" name="line1" required minLength={4} autoComplete="address-line1" defaultValue={a?.line1} className={field} placeholder="House 12, Street 4" {...aria("co-line1")} />{err("co-line1")}</div>
            <div className="sm:col-span-2"><label className={label} htmlFor="co-line2">Area, block or landmark <span className="text-stone-600">(optional)</span></label><input id="co-line2" name="line2" autoComplete="address-line2" defaultValue={a?.line2} className={field} placeholder="Block C, near the main market" /></div>
            <div>
              <label className={label} htmlFor="co-city">City</label>
              <input id="co-city" name="city" required minLength={2} list="pk-cities" autoComplete="address-level2" defaultValue={a?.city} className={field} placeholder="Lahore" {...aria("co-city")} />
              <datalist id="pk-cities">{SERVICE_AREAS.map((c) => <option key={c} value={c} />)}</datalist>
              {err("co-city")}
            </div>
            <div>
              <label className={label} htmlFor="co-province">Province</label>
              <select id="co-province" name="province" required defaultValue={a?.province ?? "Punjab"} className={field}>{PROVINCES.map((p) => <option key={p}>{p}</option>)}</select>
            </div>
            <div><label className={label} htmlFor="co-postcode">Postal code <span className="text-stone-600">(optional)</span></label><input id="co-postcode" name="postcode" inputMode="numeric" maxLength={6} autoComplete="postal-code" defaultValue={a?.postcode} className={field} placeholder="54000" /></div>
            <div className="sm:col-span-2"><label className={label} htmlFor="co-notes">Delivery notes <span className="text-stone-600">(optional)</span></label><textarea id="co-notes" name="notes" rows={3} className={field} placeholder="A good time to call, a nearby landmark, or a colour you would like us to confirm." /></div>
          </div>
          <p className="mt-3 flex gap-2 text-xs text-info"><Info className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden />We deliver to every city in Pakistan by tracked courier, and call to confirm before we send.</p>
          {saved && <label className="mt-4 flex cursor-pointer gap-3 text-sm text-stone-600"><input type="checkbox" name="saveDetails" defaultChecked className="mt-1" /><span>Save these details to my account for next time</span></label>}
        </fieldset>

        <fieldset className="rounded-2xl border border-ink-950/10 p-6">
          <legend className="px-2 font-display text-xl">Payment</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {METHODS.map((m) => (
              <label key={m.value} className={cn("flex cursor-pointer gap-3 rounded-xl border p-4", method === m.value ? "border-brass-500 bg-brass-500/5" : "border-ink-950/15")}>
                <input type="radio" name="method" checked={method === m.value} onChange={() => setMethod(m.value)} className="mt-1" />
                <span><span className="block text-sm font-medium">{m.label}</span><span className="block text-xs text-stone-600">{m.body}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <aside className="rounded-2xl border border-ink-950/10 bg-bone-100 p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-xl">Order summary</h2>
        {failed && <p className="mt-4 text-sm text-danger" role="alert">We could not price your basket. Please WhatsApp {CONTACT.whatsapp}.</p>}
        {!cart && !failed && <p className="mt-4 text-sm text-stone-600" role="status">Pricing…</p>}
        {cart && (
          <>
            <ul className="mt-4 divide-y divide-ink-950/10 border-y border-ink-950/10 text-sm">
              {cart.lines.map((l) => (
                <li key={`${l.id}:${l.variant}`} className="flex justify-between gap-3 py-3">
                  <span className="min-w-0"><span className="block truncate">{l.qty} × {l.name}</span><span className="block text-xs text-stone-600">{l.variantLabel}</span></span>
                  <span className="tnum">{pkr(l.amount)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4"><Totals cart={cart} /></div>
          </>
        )}
        {error && <p className="mt-4 text-sm text-danger" role="alert">{error}</p>}
        <Button type="submit" className="mt-6 min-h-12 w-full" disabled={state === "sending" || !cart}>
          {state === "sending" ? "Placing order…" : cart ? `Place order · ${pkr(cart.total)}` : "Place order"}
        </Button>
        <p className="mt-3 text-center text-xs text-stone-600">By ordering you accept our <Link href="/terms-of-service" className="underline underline-offset-4">terms</Link>. <Link href="/cart" className="underline underline-offset-4">Edit basket</Link></p>
      </aside>
    </form>
  );
}
