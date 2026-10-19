import Link from "next/link";
import { pageMeta, JsonLd, faqLd } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";
import { ORDER_FAQ } from "@/content/faqs";
import { COMMERCIAL, CONTACT, SERVICE_AREAS } from "@/lib/brand";
import { REGIONS, regionPath } from "@/content/markets";

export const metadata = pageMeta({
  title: "Delivery & Returns – Cash on Delivery Pakistan",
  description: "CAPRA delivers to every city in Pakistan: Rs 250 delivery, free over Rs 5,000, cash on delivery, dispatch in 1–2 working days and 7-day returns.",
  path: "/delivery",
});

export default function Page() {
  return (
    <>
      <JsonLd data={faqLd([...ORDER_FAQ])} />
      <InfoPage crumb="Delivery & returns" path="/delivery" eyebrow="Delivery" title="Delivery to every city in Pakistan." lede={`Rs ${COMMERCIAL.deliveryFee} delivery, free on orders of Rs ${COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")} or more, and cash on delivery wherever you are.`}
        aside={<><p className="font-medium">Need it by a date?</p><p className="mt-2 text-stone-600">WhatsApp <a href={CONTACT.whatsappLink} className="text-clay-700 underline underline-offset-4">{CONTACT.whatsapp}</a> before you order and we will tell you honestly whether we can make it.</p></>}>
        <h2>Charges</h2>
        <p>Delivery is a flat Rs {COMMERCIAL.deliveryFee} per order to any address in Pakistan, whatever its size. Orders of Rs {COMMERCIAL.freeDeliveryFrom.toLocaleString("en-PK")} or more are delivered free. The charge is shown in your basket before you order.</p>
        <h2>Timing</h2>
        <p>We call or WhatsApp to confirm each order, then pack and dispatch it from our Gujranwala factory within {COMMERCIAL.dispatch}. Parcels usually arrive {COMMERCIAL.deliveryTime}. Large cities are normally quickest; remote areas can take a little longer.</p>
        <p>Once your order is dispatched we send the courier&rsquo;s tracking number by WhatsApp and email, and show it on your order page.</p>
        <h2>Where we deliver</h2>
        <p>Everywhere our couriers reach, including {SERVICE_AREAS.slice(0, -1).join(", ")} and {SERVICE_AREAS.at(-1)}, and every town in between.</p>
        <h2>Find your city or town</h2>
        <p>Browse urban localities by region, with address guidance for homes, shops and trade orders. Delivery depends on courier access to your complete address. For an unlisted village or remote route, contact us before placing a time-sensitive order.</p>
        <ul>{REGIONS.map((r) => <li key={r.slug}><Link href={regionPath(r.slug)}>{r.name}: cities, towns and delivery guidance</Link></li>)}</ul>
        <h2>Paying</h2>
        <p>Pay cash to the courier when your parcel arrives, or pay in advance by bank transfer, JazzCash or Easypaisa. For advance payments we dispatch as soon as the transfer arrives.</p>
        <h2>Returns</h2>
        <p>Please open your parcel when it arrives. If anything is damaged, faulty or not what you ordered, WhatsApp us a photo within {COMMERCIAL.returnDays} days and we will replace it at our cost.</p>
        <p>Changed your mind? Unused items in their original box can be returned within {COMMERCIAL.returnDays} days of delivery: message us first, send it back and we refund the item price once it reaches us. Manufacturing faults after that are covered by the <Link href="/warranty">{COMMERCIAL.warrantyMonths}-month warranty</Link>.</p>
      </InfoPage>
    </>
  );
}
