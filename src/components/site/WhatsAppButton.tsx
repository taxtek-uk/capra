"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CONTACT } from "@/lib/brand";
import { cn } from "@/lib/utils";

/** The outlined bubble with the handset, for the floating button. */
const BUBBLE =
  "M12.7272 24.3561C10.5753 24.3561 8.55361 23.8061 6.79472 22.8408L0 25L2.215 18.4661C1.09778 16.6308 0.454167 14.4786 0.454167 12.1781C0.454167 5.45222 5.94889 0 12.7275 0C19.5053 0 25 5.45222 25 12.1781C25 18.9039 19.5056 24.3561 12.7272 24.3561ZM12.7272 1.93944C7.03722 1.93944 2.40889 6.5325 2.40889 12.1781C2.40889 14.4183 3.13917 16.4931 4.37417 18.1811L3.08528 21.9833L7.05028 20.7231C8.67972 21.7928 10.6314 22.4167 12.7272 22.4167C18.4164 22.4167 23.0456 17.8239 23.0456 12.1783C23.0456 6.53278 18.4164 1.93944 12.7272 1.93944ZM18.9244 14.9828C18.8489 14.8586 18.6483 14.7836 18.3481 14.6344C18.0469 14.4853 16.5675 13.7628 16.2922 13.6636C16.0161 13.5642 15.8153 13.5139 15.615 13.8128C15.4147 14.1117 14.8381 14.7836 14.6622 14.9828C14.4867 15.1822 14.3114 15.2072 14.0106 15.0578C13.71 14.9086 12.7406 14.5933 11.5911 13.5764C10.6969 12.7853 10.0931 11.8086 9.91778 11.5094C9.74222 11.2108 9.89917 11.0494 10.0497 10.9008C10.185 10.7669 10.3506 10.5522 10.5011 10.3781C10.6517 10.2036 10.7017 10.0794 10.8017 9.88C10.9022 9.68083 10.8519 9.50667 10.7767 9.35694C10.7014 9.20778 10.0994 7.73889 9.84889 7.14111C9.59833 6.54389 9.34806 6.64333 9.17222 6.64333C8.99667 6.64333 8.79611 6.61833 8.59556 6.61833C8.395 6.61833 8.06889 6.69306 7.79306 6.99167C7.5175 7.29056 6.74056 8.01278 6.74056 9.48139C6.74056 10.9503 7.81806 12.3694 7.96889 12.5683C8.11917 12.7672 10.0494 15.8794 13.1075 17.0747C16.1667 18.2697 16.1667 17.8711 16.7183 17.8214C17.2692 17.7717 18.4975 17.0994 18.7489 16.4025C18.9992 15.705 18.9992 15.1072 18.9244 14.9828Z";

/**
 * The business WhatsApp line, pinned to the bottom corner of every public page .
 * Hidden on checkout, where the order button owns the bottom of the screen.
 * Clicks are counted by the Tracker as an `outbound_click` to wa.me.
 * Once the page scrolls it shrinks to the round icon, so the label never sits over a card's own link.
 */
export function WhatsAppButton() {
  const quote = usePathname().startsWith("/checkout");
  const [scrolled, setScrolled] = useState(false);
  const ping = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 120);
    on(); window.addEventListener("scroll", on, { passive: true });
    // The attention pulse plays on a first visit only. Storage can throw (private mode); then it simply stays still.
    try { if (!localStorage.getItem("wa-seen") && ping.current) { ping.current.hidden = false; localStorage.setItem("wa-seen", "1"); } } catch {}
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <aside aria-label="Message us on WhatsApp" className="wa-float">
    <a
      href={CONTACT.whatsappLink}
      target="_blank"
      rel="noopener"
      aria-label={`WhatsApp us on ${CONTACT.whatsapp}`}
      className={cn("group fixed bottom-5 right-5 z-40 items-center gap-3 print:hidden sm:bottom-6 sm:right-6", quote ? "hidden lg:flex" : "flex")}
    >
      {/* The label with its tip pointing at the button; from sm up, where there is room beside it. */}
      <span aria-hidden className={cn("relative hidden rounded-full bg-bone-50 px-4 py-2 text-sm font-medium text-ink-950 shadow-lift transition group-hover:bg-ink-950 group-hover:text-bone-50", !scrolled && "sm:block")}>
        WhatsApp
        <span className="absolute -right-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rotate-45 rounded-[2px] bg-bone-50 transition group-hover:bg-ink-950" />
      </span>
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-white shadow-lift transition group-hover:scale-105">
        <span ref={ping} hidden aria-hidden className="absolute inset-0 rounded-full bg-whatsapp opacity-40 motion-safe:animate-ping [animation-iteration-count:3]" />
        <svg className="relative h-8 w-8" viewBox="0 0 25 25" fill="currentColor" aria-hidden>
          <path fillRule="evenodd" clipRule="evenodd" d={BUBBLE} />
        </svg>
      </span>
    </a>
    </aside>
  );
}
