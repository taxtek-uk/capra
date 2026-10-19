"use client";
import { useRouter } from "next/navigation";
import { Button, Arrow } from "@/components/ui/primitives";
import { track } from "@/components/site/Tracker";
import { addToCart } from "./cart";

/**
 * Puts a past order's items back in the basket: ids, variants and quantities only. The basket
 * re-prices them at today's list prices and drops anything no longer sold, so no money from
 * the old order is reused.
 */
export function BuyAgain({ orderRef, lines }: { orderRef: string; lines: { id: string; qty: number; variant: string }[] }) {
  const router = useRouter();
  function buy() {
    for (const l of lines) addToCart(l.id, l.qty, l.variant);
    track("buy_again", orderRef, { lines: lines.length });
    router.push("/cart");
  }
  return <Button type="button" onClick={buy} className="w-full">Buy these again <Arrow /></Button>;
}

/** Opens the print dialogue. The order page swaps itself for a receipt when printed. */
export function PrintReceipt() {
  return <Button type="button" variant="ghost" onClick={() => window.print()} className="w-full">Print receipt</Button>;
}
