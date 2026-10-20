import Link from "next/link";
import type { ReactNode } from "react";
import { BRAND, CONTACT, SOCIAL } from "@/lib/brand";
import { NAV } from "@/content/nav";
import { Container, ButtonLink, Arrow } from "@/components/ui/primitives";
import { LiquidShader } from "@/components/site/LiquidShader";
import { Logo } from "@/components/site/Logo";

const cols = [
  ...NAV.groups.map((g) => ({ title: g.eyebrow, links: [...g.items, { label: `All ${g.label.toLowerCase()}`, href: g.href }] })),
  { title: "Shop", links: [...NAV.links, { label: "Your basket", href: "/cart" }, { label: "Your account", href: "/account" }] },
  { title: "Help", links: [...NAV.help, ...NAV.legal] },
];

const WHATSAPP_GLYPH = "M2.004 22l1.352-4.968A9.954 9.954 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.954 9.954 0 0 1-5.03-1.355L2.004 22zM8.391 7.308a.961.961 0 0 0-.371.1 1.293 1.293 0 0 0-.294.228c-.12.113-.188.211-.261.306A2.729 2.729 0 0 0 6.9 9.62c.002.49.13.967.33 1.413.409.902 1.082 1.857 1.971 2.742.214.213.423.427.648.626a9.448 9.448 0 0 0 3.84 2.046l.569.087c.185.01.37-.004.556-.013a1.99 1.99 0 0 0 .833-.231c.166-.088.244-.132.383-.22 0 0 .043-.028.125-.09.135-.1.218-.171.33-.288.083-.086.155-.187.21-.302.078-.163.156-.474.188-.733.024-.198.017-.306.014-.373-.004-.107-.093-.218-.19-.265l-.582-.261s-.87-.379-1.401-.621a.498.498 0 0 0-.177-.041.482.482 0 0 0-.378.127v-.002c-.005 0-.072.057-.795.933a.35.35 0 0 1-.368.13 1.416 1.416 0 0 1-.191-.066c-.124-.052-.167-.072-.252-.109l-.005-.002a6.01 6.01 0 0 1-1.57-1c-.126-.11-.243-.23-.363-.346a6.296 6.296 0 0 1-1.02-1.268l-.059-.095a.923.923 0 0 1-.102-.205c-.038-.147.061-.265.061-.265s.243-.266.356-.41a4.38 4.38 0 0 0 .263-.373c.118-.19.155-.385.093-.536-.28-.684-.57-1.365-.868-2.041-.059-.134-.234-.23-.393-.249-.054-.006-.108-.012-.162-.016a3.385 3.385 0 0 0-.403.004z";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-bone-50 p-2 pb-20 sm:p-3 sm:pb-24 print:hidden">
      <div className="relative isolate overflow-hidden rounded-[1.75rem] text-ink-950 ring-1 ring-ink-950/[0.06] sm:rounded-[2.25rem]" style={{ background: "radial-gradient(80% 60% at 15% 0%, #eae2d8, transparent 70%), radial-gradient(70% 60% at 90% 100%, #ecdcc4, transparent 70%), #f4efe8" }}>
        <LiquidShader className="absolute inset-0 -z-10 h-full w-full" />
        <Container className="pb-8 pt-14 sm:pt-20">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
            <div>
              <Link href="/" aria-label="CAPRA home" className="inline-block"><Logo plain /></Link>
              <p className="mt-8 max-w-xl font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl">
                Hot chai, cold water, <em className="italic text-clay-700">all day long.</em>
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/shop">Shop the range <Arrow /></ButtonLink>
                <ButtonLink href="/wholesale" variant="ghost" className="bg-bone-50/50 backdrop-blur-sm">Wholesale & bulk orders</ButtonLink>
              </div>
            </div>
            <div className="glass grid gap-px overflow-hidden rounded-3xl bg-ink-950/[0.06] sm:grid-cols-2">
              <Detail label="Showroom"><address className="not-italic">{BRAND.showroom}</address></Detail>
              <Detail label="Factory"><address className="not-italic">{BRAND.address.full}</address></Detail>
              <Detail label="Opening hours">{BRAND.hours.display}</Detail>
              <Detail label="Call or WhatsApp">
                <a href={CONTACT.phoneTel} className="flex min-h-11 items-center py-2 transition hover:text-clay-700">{CONTACT.phone}</a>
                <a href={CONTACT.whatsappLink} target="_blank" rel="noopener" className="flex min-h-11 items-center py-2 transition hover:text-clay-700">WhatsApp {CONTACT.whatsapp}</a>
              </Detail>
              <Detail label="Email"><a href={`mailto:${CONTACT.email}`} className="break-all transition hover:text-clay-700">{CONTACT.email}</a></Detail>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-ink-950/10 pt-12 lg:grid-cols-4">
            {cols.map((c) => (
              <nav key={c.title} aria-label={c.title}>
                <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-clay-700">{c.title}</p>
                <ul className="space-y-2.5">
                  {c.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="group inline-flex min-h-6 items-center text-sm text-ink-950/75 transition hover:text-ink-950">
                        <span className="h-px w-0 bg-current transition-all duration-300 ease-out-expo group-hover:mr-1.5 group-hover:w-3" aria-hidden />{l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <p aria-hidden className="mt-16 select-none whitespace-nowrap font-display text-[clamp(3rem,20vw,16rem)] leading-[0.8] tracking-[0.2em] text-ink-950/[0.07]">CAPRA</p>

          <div className="mt-8 flex flex-col gap-6 border-t border-ink-950/10 pt-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-xs leading-relaxed text-ink-950/70">
              <p>{BRAND.name} is made in {BRAND.address.city}, Pakistan, since {BRAND.founded}. Prices in Pakistani rupees.</p>
              <p className="mt-1.5">© {year} {BRAND.name}. All rights reserved.</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener" aria-label={`WhatsApp ${CONTACT.whatsapp}`} className="grid h-10 w-10 place-items-center rounded-full border border-ink-950/15 bg-bone-50/40 text-ink-950 transition duration-300 hover:border-whatsapp hover:bg-whatsapp hover:text-white">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden><path d={WHATSAPP_GLYPH} fill="currentColor" /></svg>
              </a>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-ink-950/15 bg-bone-50/40 text-ink-950 transition duration-300 hover:border-ink-950 hover:bg-ink-950 hover:text-bone-50">
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 3.5h-2.2A3.3 3.3 0 0 0 9.5 6.8V10H7v3.4h2.5v7.1h3.4v-7.1h2.6l.5-3.4h-3.1V7.4c0-.6.4-1 1-1H15z" /></svg>
              </a>
              <a href="#main" className="ml-2 inline-flex h-10 items-center gap-2 rounded-full bg-ink-950 px-4 text-xs font-medium text-bone-50 transition hover:bg-ink-800">Back to top <Arrow className="-rotate-90" /></a>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="bg-bone-50/55 p-5 sm:p-6">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-clay-700">{label}</p>
      <div className="mt-2 text-sm leading-relaxed text-ink-950">{children}</div>
    </div>
  );
}
