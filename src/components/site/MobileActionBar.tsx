import Link from "next/link";
import { Phone } from "lucide-react";
import { CONTACT } from "@/lib/brand";

/**
 * Phone product pages: Call, WhatsApp and the page's main action, always in reach at the bottom of the screen.
 * The floating WhatsApp bubble steps aside while this is on the page (globals.css, `.wa-float`). From lg up
 * the page's own buttons are in view, so it is not shown.
 */
export function MobileActionBar({ primary }: { primary: { label: string; href: string } }) {
  const cell = "flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full text-sm font-medium";
  return (
    <>
      <div className="h-20 lg:hidden print:hidden" aria-hidden />
      <nav aria-label="Quick actions" className="mobile-action-bar fixed inset-x-0 bottom-0 z-40 border-t border-ink-950/10 bg-bone-50/95 px-3 pt-2 backdrop-blur safe-bottom lg:hidden print:hidden">
        <div className="mx-auto flex max-w-xl gap-2">
          <a href={CONTACT.phoneTel} aria-label={`Call ${CONTACT.phone}`} className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-ink-950/15 text-ink-950"><Phone className="h-4 w-4" aria-hidden /></a>
          <a href={CONTACT.whatsappLink} target="_blank" rel="noopener" aria-label={`WhatsApp us on ${CONTACT.whatsapp}`} className={`${cell} max-w-32 bg-whatsapp text-ink-950`}>WhatsApp</a>
          <Link href={primary.href} className={`${cell} whitespace-nowrap bg-ink-950 px-3 text-bone-50`}>{primary.label}</Link>
        </div>
      </nav>
    </>
  );
}
