import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";
import { BRAND, COMMERCIAL } from "@/lib/brand";

export const metadata = pageMeta({
  title: "Terms of Sale",
  description: "The terms that apply when you buy CAPRA vacuum flasks and bottles online: prices, confirmation, cash on delivery, delivery, returns and warranty.",
  path: "/terms-of-service",
});

export default function Page() {
  return (
    <InfoPage crumb="Terms" path="/terms-of-service" eyebrow="Legal" title="Terms of sale." lede={`The terms between you and ${BRAND.name} when you order online.`}>
      <h2>Prices</h2>
      <p>Prices are in Pakistani rupees and are the price you pay for the goods. Delivery is added at checkout as shown in your basket. If we make a pricing mistake we will tell you before dispatch and you may cancel.</p>
      <h2>Your order</h2>
      <p>Placing an order is an offer to buy. We accept it when we confirm it with you by phone, WhatsApp or email. We may decline an order we cannot confirm or deliver.</p>
      <h2>Payment</h2>
      <p>Pay cash on delivery, or in advance by bank transfer, JazzCash or Easypaisa. Advance-paid orders are dispatched once payment arrives. Please do not refuse a cash-on-delivery parcel you have confirmed; repeated refusals may mean we ask for advance payment next time.</p>
      <h2>Colours</h2>
      <p>Bottle colours are a preference packed from mixed cartons. If your colour is not available we will call before sending another.</p>
      <h2>Delivery, returns and warranty</h2>
      <p>See <Link href="/delivery">delivery and returns</Link> ({COMMERCIAL.returnDays}-day returns) and the <Link href="/warranty">{COMMERCIAL.warrantyMonths}-month warranty</Link>.</p>
      <h2>Law</h2>
      <p>These terms are governed by the laws of Pakistan, and the courts of {BRAND.address.city} have jurisdiction.</p>
    </InfoPage>
  );
}
