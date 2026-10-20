import Image from "next/image";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The gold markhor beside the letter-spaced wordmark and tagline, set in the display face so it stays crisp at any size. */
export function Logo({ className, light, plain }: { className?: string; light?: boolean; plain?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span className={cn("grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center", !plain && "rounded-full bg-white shadow-sm ring-1 ring-ink-950/10")}>
        <Image src={BRAND.mark} alt="" width={144} height={256} sizes="24px" className="h-10 w-auto" loading="eager" fetchPriority="low" />
      </span>
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[1.7rem] font-semibold tracking-[0.28em]", light ? "text-brass-300" : "text-ink-950")}>CAPRA</span>
        <span className={cn("mt-1 text-[0.65rem] font-medium uppercase tracking-[0.3em]", light ? "text-bone-100/80" : "text-clay-700")}>{BRAND.tagline.replace(/\.$/, "")}</span>
      </span>
    </span>
  );
}
