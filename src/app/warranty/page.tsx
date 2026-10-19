import { pageMeta } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";
import { BRAND, COMMERCIAL, CONTACT } from "@/lib/brand";

export const metadata = pageMeta({
  title: "2-Year Warranty on CAPRA Flasks & Bottles",
  description: "Every CAPRA vacuum jug, flask and bottle has a 24-month warranty against manufacturing faults, including loss of vacuum. What it covers and how to claim.",
  path: "/warranty",
});

export default function Page() {
  return (
    <InfoPage crumb="Warranty" path="/warranty" eyebrow="Warranty" title={`${COMMERCIAL.warrantyMonths} months, on everything we make.`} lede={`If a ${BRAND.name} product fails because of how it was made, we repair or replace it.`}
      aside={<><p className="font-medium">Make a claim</p><p className="mt-2 text-stone-600">WhatsApp a photo or short video and your order number to <a href={CONTACT.whatsappLink} className="text-clay-700 underline underline-offset-4">{CONTACT.whatsapp}</a>.</p></>}>
      <h2>What is covered</h2>
      <ul><li>Faults in materials or workmanship under normal household use.</li><li>Loss of vacuum, where the outside of the flask gets hot or cold, unless it follows a fall or a dent.</li><li>Lids, seals and push buttons that fail in normal use.</li></ul>
      <h2>What is not covered</h2>
      <ul><li>Dents, drops, accidents and wear and tear.</li><li>Damage from a dishwasher, microwave, freezer, bleach or abrasive cleaners.</li><li>Products that have been modified or repaired by someone else.</li></ul>
      <h2>How to claim</h2>
      <p>Send us your order number (or proof of purchase from a shop), a photo or video of the problem and a line on when it started. If it is a manufacturing fault we send a replacement part or product; we may ask you to return the faulty one first.</p>
      <p>The warranty runs for {COMMERCIAL.warrantyMonths} months from the date you received your order, and it is in addition to your rights under Pakistani consumer law.</p>
    </InfoPage>
  );
}
