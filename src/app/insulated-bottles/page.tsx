import Link from "next/link";
import { FamilyPage, familyMeta } from "@/components/shop/FamilyPage";

export const revalidate = 3600;
export const metadata = familyMeta("insulated-bottles");

export default function Page() {
  return (
    <FamilyPage family="insulated-bottles" intro={<>
      <h2 className="font-display text-3xl text-ink-950">A bottle for school, gym or the road</h2>
      <p>Both bottles are double-wall insulated stainless steel: cold water stays cold in a hot car or a school bag, and tea stays hot on a winter commute. Steel does not crack when it is dropped, and it does not hold on to smells the way plastic does.</p>
      <p>The <strong>MS sports bottle</strong> has a strap and grip sleeve and comes in 600 or 750 ml. The <strong>BM bullet flask</strong> is slimmer, with a cup cap, in 600 ml or 1 litre.</p>
      <p>Buying for a school, team or shop? Bottles are packed 36 to a carton; see <Link href="/wholesale" className="text-clay-700 underline underline-offset-4">wholesale orders</Link>.</p>
    </>} />
  );
}
