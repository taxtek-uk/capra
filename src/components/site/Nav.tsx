"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ChevronDown, Phone, User, X } from "lucide-react";
import { NAV } from "@/content/nav";
import { CONTACT } from "@/lib/brand";
import Image from "next/image";
import { cn, pkr } from "@/lib/utils";
import { CartLink } from "@/components/shop/CartLink";
import { SiteSearch } from "@/components/site/SiteSearch";
import { Logo } from "@/components/site/Logo";

/** Pages that open on a dark hero, where the header starts transparent with light text. */
const DARK_ROUTES = ["/", "/vacuum-jugs", "/insulated-bottles", "/about", "/wholesale"];

function Chevron({ open }: { open?: boolean }) {
  return <ChevronDown className={cn("h-3.5 w-3.5 opacity-70 transition-transform", open && "rotate-180")} strokeWidth={1.8} aria-hidden />;
}

/** Floating translucent pill header, white dropdown cards (the reference store's pattern). */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<string | null>(null);
  const path = usePathname();
  const burger = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const [prevPath, setPrevPath] = useState(path);
  if (path !== prevPath) { setPrevPath(path); setOpen(false); setMenu(null); }

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    if (!open && wasOpen.current) burger.current?.focus();
    wasOpen.current = open;
    return () => { document.documentElement.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [open]);

  /** Keeps Tab inside the open menu sheet, as a modal dialog should. */
  const trap = (e: ReactKeyboardEvent) => {
    if (e.key !== "Tab" || !sheet.current) return;
    const f = sheet.current.querySelectorAll<HTMLElement>("a[href], button, summary");
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const onDark = DARK_ROUTES.includes(path) && !scrolled && !open;
  /** The section the visitor is in: that page or anything under it. */
  const here = (href: string) => path === href || path.startsWith(href + "/");

  return (
    <header className="fixed inset-x-0 top-0 z-50 print:hidden" onMouseLeave={() => setMenu(null)}>
      <div className="relative z-50 mx-auto max-w-[96rem] px-3 pt-3 sm:px-6">
        <div className={cn("relative flex h-16 items-center justify-between rounded-full px-4 pr-3 transition-all duration-500 sm:px-6", onDark ? "bg-ink-950/35 text-bone-50 ring-1 ring-bone-50/10 backdrop-blur-xl" : "glass text-ink-950 shadow-lift")}>
          <Link href="/" className="flex shrink-0 items-center" aria-label="CAPRA home"><Logo light={onDark} /></Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 lg:flex" aria-label="Primary">
            {NAV.groups.map((g, gi) => (
              <div
                key={g.label}
                className="relative"
                onMouseEnter={() => setMenu(g.label)}
                onKeyDown={(e) => { if (e.key === "Escape" && menu === g.label) { setMenu(null); e.currentTarget.querySelector("button")?.focus(); } }}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setMenu((m) => (m === g.label ? null : m)); }}
              >
                <button type="button" className={cn("relative flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-2 text-ui transition hover:bg-current/10", (menu === g.label || here(g.href)) && "bg-current/10")} aria-expanded={menu === g.label} aria-controls={`nav-menu-${gi}`} onClick={() => setMenu(menu === g.label ? null : g.label)} onFocus={() => setMenu(g.label)}>
                  {g.label}<Chevron open={menu === g.label} />
                </button>
                {menu === g.label && (
                  <div id={`nav-menu-${gi}`} className="menu-enter absolute left-0 top-full pt-3">
                    <div className={cn("rounded-3xl bg-white p-4 text-ink-950 shadow-deep ring-1 ring-ink-950/5", g.items.length > 2 ? "w-[40rem]" : "w-[30rem]")}>
                      <div className="mb-3 flex items-baseline justify-between gap-4 px-1">
                        <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-600">{g.eyebrow}</p>
                        <Link href="/prices" className="text-xs text-clay-700 underline-offset-4 hover:underline">Compare all prices</Link>
                      </div>
                      <ul className="grid grid-cols-2 gap-2">
                        {g.items.map((it) => (
                          <li key={it.href}>
                            <Link href={it.href} aria-current={path === it.href ? "page" : undefined} className={cn("group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-bone-100", path === it.href && "bg-bone-100")}>
                              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-bone-100 ring-1 ring-ink-950/5">
                                <Image src={it.image!} alt="" fill sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                              </span>
                              <span className="min-w-0">
                                <span className="block text-sm font-medium leading-snug">{it.label}</span>
                                <span className="mt-0.5 block text-xs text-stone-600">{it.sizes}</span>
                                <span className="mt-0.5 block text-xs text-clay-700 tnum">from {pkr(it.price!)}</span>
                              </span>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <Link href={g.href} className="flex h-full min-h-20 items-center justify-between gap-3 rounded-2xl bg-ink-950 px-4 text-sm font-medium text-bone-50 transition hover:bg-ink-800">
                            <span>All {g.eyebrow.toLowerCase()}</span><span aria-hidden className="text-brass-300">→</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {NAV.links.map((l) => <Link key={l.href} href={l.href} aria-current={path === l.href ? "page" : undefined} className={cn("whitespace-nowrap rounded-full px-3.5 py-2 text-ui transition hover:bg-current/10", here(l.href) && "bg-current/10")} onMouseEnter={() => setMenu(null)}>{l.label}</Link>)}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <SiteSearch className="grid" />
            <a href={CONTACT.phoneTel} aria-label={`Call ${CONTACT.phone}`} title={CONTACT.phone} className="hidden h-10 w-10 place-items-center rounded-full ring-1 ring-current/20 transition hover:bg-current/10 xl:grid"><Phone className="h-4 w-4" strokeWidth={1.6} aria-hidden /></a>
            <Link href="/account" aria-label="Your account" title="Your account" className="hidden h-10 w-10 place-items-center rounded-full ring-1 ring-current/20 transition hover:bg-current/10 lg:grid"><User className="h-4 w-4" strokeWidth={1.6} aria-hidden /></Link>
            <CartLink />
            <Link href="/shop" className={cn("hidden whitespace-nowrap rounded-full px-5 py-2.5 text-ui font-medium transition xl:inline-flex", onDark ? "bg-brass-500 text-ink-950 hover:bg-brass-400" : "bg-ink-950 text-bone-50 hover:bg-ink-800")}>Shop now</Link>
            <button ref={burger} type="button" className="relative grid h-11 w-11 place-items-center rounded-full lg:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="nav-sheet" onClick={() => setOpen((v) => !v)}>
              <span className={cn("absolute h-px w-5 bg-current transition-all duration-300", open ? "rotate-45" : "-translate-y-1.5")} /><span className={cn("absolute h-px w-5 bg-current transition-all duration-300", open && "opacity-0")} /><span className={cn("absolute h-px w-5 bg-current transition-all duration-300", open ? "-rotate-45" : "translate-y-1.5")} />
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div ref={sheet} id="nav-sheet" role="dialog" aria-modal="true" aria-label="Menu" onKeyDown={trap} className="menu-enter fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bone-50 text-ink-950 lg:hidden">
          <div className="sticky top-0 z-10 bg-bone-50 px-3 pb-2 pt-3">
            <div className="flex h-16 items-center justify-between rounded-full bg-white px-4 pr-3 shadow-lift ring-1 ring-ink-950/5">
              <Link href="/" onClick={() => setOpen(false)} aria-label="CAPRA home"><Logo /></Link>
              <button type="button" autoFocus onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-ink-950/10 transition hover:bg-ink-950/5"><X className="h-5 w-5" strokeWidth={1.6} aria-hidden /></button>
            </div>
          </div>
          <div className="flex-1 px-5 pt-3">
            {NAV.groups.map((g) => (
              <details key={g.label} className="group border-t border-ink-950/10" open>
                <summary className="flex items-center justify-between py-4 text-lg">{g.eyebrow}<span className="text-clay-700 transition-transform group-open:rotate-180"><Chevron /></span></summary>
                <ul className="grid gap-1 pb-4">
                  {g.items.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} aria-current={path === l.href ? "page" : undefined} className={cn("flex items-center gap-3 rounded-xl p-1.5", path === l.href && "bg-bone-100")}>
                        <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-bone-100"><Image src={l.image!} alt="" fill sizes="56px" className="object-cover" /></span>
                        <span className="min-w-0 flex-1"><span className="block text-base">{l.label}</span><span className="block text-xs text-stone-600">{l.sizes} · from {pkr(l.price!)}</span></span>
                      </Link>
                    </li>
                  ))}
                  <li><Link href={g.href} className="block py-2 text-sm font-medium text-clay-700">See all {g.eyebrow.toLowerCase()} →</Link></li>
                </ul>
              </details>
            ))}
            <div className="border-t border-ink-950/10 py-3"><ul className="grid gap-1">{[...NAV.links, ...NAV.help].map((l) => <li key={l.href}><Link href={l.href} className="block rounded-lg py-2 text-lg">{l.label}</Link></li>)}</ul></div>
            <div className="mt-2 grid gap-3 pb-6">
              <CartLink className="justify-center border border-ink-950/15 px-6 py-3.5 text-sm ring-0" showLabel />
              <Link href="/account" className="flex items-center justify-center gap-2 rounded-full border border-ink-950/15 px-6 py-3.5 text-sm"><User className="h-4 w-4" strokeWidth={1.6} aria-hidden />Your account</Link>
              <a href={CONTACT.whatsappLink} target="_blank" rel="noopener" className="flex items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-medium text-white">WhatsApp {CONTACT.whatsapp}</a>
              <a href={CONTACT.phoneTel} className="flex items-center justify-center gap-2 rounded-full border border-ink-950/15 px-6 py-3.5 text-sm"><Phone className="h-4 w-4" strokeWidth={1.6} aria-hidden />Call {CONTACT.phone}</a>
            </div>
          </div>
          <div className="sticky bottom-0 border-t border-ink-950/10 bg-bone-50 px-5 py-3 safe-bottom">
            <Link href="/shop" className="block rounded-full bg-ink-950 px-6 py-3.5 text-center text-sm font-medium text-bone-50">Shop the range</Link>
          </div>
        </div>
      )}
    </header>
  );
}
