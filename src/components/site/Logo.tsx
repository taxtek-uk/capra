import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The gold markhor beside the letter-spaced wordmark, set in the display face so it stays crisp at any size. */
export function Logo({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <Image src={BRAND.mark} alt="" width={144} height={256} sizes="28px" className="h-9 w-auto" loading="eager" fetchPriority="low" />
      <span className={cn("font-display text-xl tracking-[0.32em]", light ? "text-brass-300" : "text-ink-950")}>CAPRA</span>
    </span>
  );
}
