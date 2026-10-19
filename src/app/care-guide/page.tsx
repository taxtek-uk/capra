import Link from "next/link";
import { pageMeta, JsonLd, faqLd } from "@/lib/seo";
import { InfoPage } from "@/components/site/InfoPage";

export const metadata = pageMeta({
  title: "Vacuum Flask Care Guide: Use, Clean & Store",
  description: "How to use, clean and store a stainless steel vacuum flask: pre-heating for hotter tea, removing tea stains with baking soda, and what never to use.",
  path: "/care-guide",
});

const FAQ = [
  { q: "How do I keep tea hotter for longer?", a: "Pre-heat the flask with boiling water for five minutes, fill it close to the top with tea straight off the boil, and close the lid fully after every pour." },
  { q: "How do I remove tea stains?", a: "Fill the flask with hot water and two tablespoons of baking soda, close it and leave it for 20 minutes or overnight, then brush and rinse." },
];

export default function Page() {
  return (
    <>
      <JsonLd data={faqLd(FAQ)} />
      <InfoPage crumb="Care guide" path="/care-guide" eyebrow="Care guide" title="Look after it, and it lasts for years." lede="Five minutes a week keeps a stainless steel flask clean, fresh and keeping heat like the day it arrived.">
        <h2>Before first use</h2>
        <p>Wash the flask, lid and seal in warm soapy water and rinse well. Fill it with boiling water, close it for ten minutes, then empty it. This clears any smell of the factory and warms the steel for its first tea.</p>
        <h2>Every day</h2>
        <ul><li>Pre-heat with boiling water (or pre-chill with iced water) for five minutes before filling.</li><li>Fill close to the top: less air means less heat lost.</li><li>Close the lid fully after each pour.</li><li>Rinse it as soon as it is empty, before tea dries on.</li></ul>
        <h2>Every week</h2>
        <p>Add two tablespoons of baking soda, fill with hot water, close and leave for 20 minutes to an hour, then brush and rinse. Take the lid apart and wash the seal. Let every part dry before reassembling. Our <Link href="/blog/how-to-clean-a-thermos-flask">cleaning guide</Link> covers stains and smells in detail.</p>
        <h2>Never</h2>
        <ul><li>Use bleach, chlorine or steel wool.</li><li>Put the flask in a dishwasher, microwave or freezer.</li><li>Store it sealed while damp.</li><li>Carry hot drinks in it with the lid half closed.</li></ul>
      </InfoPage>
    </>
  );
}
