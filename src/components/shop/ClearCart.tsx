"use client";
import { useEffect } from "react";
import { clearCart } from "./cart";

/** Empties the basket once the order exists — including after a return trip through Stripe. */
export function ClearCart() {
  useEffect(() => clearCart(), []);
  return null;
}
