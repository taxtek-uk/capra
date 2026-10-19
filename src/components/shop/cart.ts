"use client";
import { useSyncExternalStore } from "react";
import type { CartItem } from "@/lib/shop";

/**
 * The basket lives in localStorage and holds ids and quantities only — never a price.
 * Every screen that shows money asks `/api/cart`, which re-prices against the engines,
 * so a tampered basket buys nothing it should not.
 *
 * A plain store with `useSyncExternalStore` rather than a context provider: the badge in
 * the header, the basket page and an "Add to basket" button on a product page are three
 * unrelated places in the tree, and none of them needs the root layout to know about carts.
 */

const KEY = "capra:cart";
const MAX_LINES = 20;
const MAX_QTY = 50;

const listeners = new Set<() => void>();
const EMPTY: CartItem[] = [];
let snapshot: CartItem[] | null = null;

function parse(raw: string | null): CartItem[] {
  try {
    const v = JSON.parse(raw ?? "[]");
    if (!Array.isArray(v)) return EMPTY;
    return v
      .filter((l): l is CartItem => !!l && typeof l.id === "string" && Number.isFinite(l.qty))
      .map((l) => ({ id: l.id.slice(0, 120), qty: Math.min(MAX_QTY, Math.max(1, Math.round(l.qty))), variant: typeof l.variant === "string" ? l.variant.slice(0, 120) : undefined }))
      .slice(0, MAX_LINES);
  } catch {
    return EMPTY;
  }
}

function read(): CartItem[] {
  try {
    return parse(localStorage.getItem(KEY));
  } catch {
    return EMPTY; // private mode: the basket just does not persist
  }
}

function write(lines: CartItem[]) {
  snapshot = lines;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* ignore — the in-memory snapshot still drives this tab */
  }
  for (const l of listeners) l();
}

const getSnapshot = () => (snapshot ??= read());
const getServerSnapshot = () => EMPTY;

function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) {
      snapshot = read();
      for (const l of listeners) l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

/** The basket as stored. Empty during SSR and the first paint, then hydrated. */
export const useCart = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
export const useCartCount = () => useCart().reduce((a, l) => a + l.qty, 0);

const same = (a: CartItem, id: string, variant?: string) => a.id === id && (a.variant ?? "") === (variant ?? "");

export function addToCart(id: string, qty = 1, variant?: string) {
  const lines = [...getSnapshot()];
  const at = lines.findIndex((l) => same(l, id, variant));
  if (at >= 0) lines[at] = { ...lines[at], qty: Math.min(MAX_QTY, lines[at].qty + qty) };
  else if (lines.length < MAX_LINES) lines.push({ id, qty: Math.min(MAX_QTY, Math.max(1, qty)), variant });
  write(lines);
  // Every route into the basket comes through here, so the "what next" guide listens once.
  window.dispatchEvent(new CustomEvent("capra:added", { detail: { id, variant } }));
}

export function setQty(id: string, qty: number, variant?: string) {
  const next = getSnapshot()
    .map((l) => (same(l, id, variant) ? { ...l, qty: Math.min(MAX_QTY, Math.round(qty)) } : l))
    .filter((l) => l.qty > 0);
  write(next);
}

export const removeLine = (id: string, variant?: string) => write(getSnapshot().filter((l) => !same(l, id, variant)));
export const clearCart = () => write([]);

/** Replaces the basket wholesale: a saved basket reopened from its emailed link. */
export const replaceCart = (lines: CartItem[]) => write(parse(JSON.stringify(lines)));
