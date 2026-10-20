"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  Activity, ChevronRight, Contact, ExternalLink, LayoutDashboard, LogOut, MessageSquare,
  Newspaper, Package, PanelLeft, Plus, Search, Settings, ShoppingBag, Users, Mail } from "lucide-react";
import { BRAND } from "@/lib/brand";
import { cn } from "@/lib/utils";

const GROUPS: { label: string; items: { href: string; label: string; icon: typeof Users }[] }[] = [
  { label: "Dashboards", items: [
    { href: "/admin", label: "Overview", icon: LayoutDashboard },
    { href: "/admin/analytics", label: "Analytics", icon: Activity },
    { href: "/admin/visitors", label: "Visitors", icon: Users },
  ] },
  { label: "Shop", items: [
    { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
    { href: "/admin/saved-baskets", label: "Saved baskets", icon: Mail },
    { href: "/admin/enquiries", label: "Enquiries", icon: MessageSquare },
    { href: "/admin/customers", label: "Customers", icon: Contact },
  ] },
  { label: "Content", items: [
    { href: "/admin/products", label: "Products", icon: Package },
    { href: "/admin/journal", label: "Journal", icon: Newspaper },
  ] },
  { label: "System", items: [{ href: "/admin/settings", label: "Settings", icon: Settings }] },
];

/** Initials for the sidebar avatar: "Ali Khan" → "AK". */
const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]!.toUpperCase()).join("") || "?";

export function Shell({ children, signOut, user }: { children: ReactNode; signOut: () => Promise<void>; user: { name: string; role: string } | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The sign-in screen gets the shell's canvas but none of its furniture.
  if (pathname === "/admin/login") return <div className="dash grid min-h-screen place-items-center px-5">{children}</div>;

  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href));

  return (
    <div className="dash flex min-h-screen">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-zinc-200 bg-white transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-2 px-4 py-4">
          <Image src={BRAND.mark} alt="" width={24} height={24} className="h-6 w-6 rounded-md object-contain" />
          <span className="text-sm font-semibold text-zinc-900">{BRAND.name}</span>
        </div>

        <div className="flex gap-2 px-3">
          <Link href="/admin/journal/new" className="inline-flex flex-1 items-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800">
            <Plus className="h-4 w-4" /> New post
          </Link>
          <Link href="/admin/enquiries" aria-label="Enquiries" className="grid h-9 w-9 place-items-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50">
            <MessageSquare className="h-4 w-4" />
          </Link>
        </div>

        <nav className="mt-5 flex-1 overflow-y-auto px-3 pb-4" aria-label="Admin">
          {GROUPS.map((g) => (
            <div key={g.label} className="mb-5">
              <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">{g.label}</p>
              <ul className="space-y-0.5">
                {g.items.map((i) => (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      onClick={() => setOpen(false)}
                      aria-current={active(i.href) ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm",
                        active(i.href) ? "bg-zinc-100 font-medium text-zinc-900" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900",
                      )}
                    >
                      <i.icon className="h-4 w-4 shrink-0 text-zinc-500" />
                      {i.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-zinc-200 p-3">
          <Link href="/" target="_blank" className="mb-2 flex items-center justify-between rounded-lg px-2 py-1.5 text-xs text-zinc-500 hover:bg-zinc-50">
            View live site <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <div className="flex items-center gap-2 rounded-lg border border-zinc-200 p-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-zinc-900 text-xs font-medium text-white">{initials(user?.name ?? "")}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium text-zinc-900">{user?.name ?? "Signed in"}</span>
              <span className="block truncate text-[11px] capitalize text-zinc-500">{user?.role ?? ""}</span>
            </span>
            <form action={signOut}>
              <button aria-label="Sign out" className="grid h-7 w-7 place-items-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      </aside>

      {open && <button aria-label="Close menu" className="fixed inset-0 z-30 bg-zinc-900/20 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex min-w-0 flex-1 flex-col lg:pl-60">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-zinc-200 bg-white/85 px-4 py-2.5 backdrop-blur">
          <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 lg:hidden">
            <PanelLeft className="h-4 w-4" />
          </button>
          <form action="/admin/orders" className="relative max-w-xs flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
            <input name="q" placeholder="Search orders: name, phone, ref…" className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-1.5 pl-8 pr-3 text-sm outline-none placeholder:text-zinc-400 focus:border-zinc-300 focus:bg-white" />
          </form>
          <nav className="ml-auto hidden items-center gap-1 text-xs text-zinc-500 sm:flex" aria-label="Breadcrumb">
            <span>Admin</span>
            {pathname !== "/admin" && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="capitalize text-zinc-900">{pathname.split("/")[2]?.replace(/-/g, " ")}</span>
              </>
            )}
          </nav>
        </header>
        <main className="min-w-0 flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
