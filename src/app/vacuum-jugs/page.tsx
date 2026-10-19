import Link from "next/link";
import { FamilyPage, familyMeta } from "@/components/shop/FamilyPage";

export const revalidate = 3600;
export const metadata = familyMeta("vacuum-jugs");

export default function Page() {
  return (
    <FamilyPage family="vacuum-jugs" intro={<>
      <h2 className="font-display text-3xl text-ink-950">Which vacuum jug is right for you?</h2>
      <p>Every CAPRA jug is double-wall stainless steel inside and out, with no glass to break, so it keeps chai hot through breakfast and water cold through a summer afternoon. They differ in shape and lid.</p>
      <p>The <strong>SLD</strong> is the classic rounded tea jug. The <strong>RIT</strong> pours with one hand from a push button. The <strong>CPR</strong> is an upright, boxed vacuum pot that makes a good gift. The <strong>SKM</strong> is a slim coffee-pot flask, and the <strong>YKC</strong> a tall jug with a flip-top lid.</p>
      <p>A 1 litre jug pours about four cups, a 2 litre about eight and a 3 litre about twelve. Not sure? Read <Link href="/blog/how-to-choose-a-vacuum-flask" className="text-clay-700 underline underline-offset-4">how to choose a vacuum flask</Link>.</p>
    </>} />
  );
}
