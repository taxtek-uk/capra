import Link from "next/link";
import { JsonLd, breadcrumbLd } from "@/lib/seo";
import { cn } from "@/lib/utils";

export function Breadcrumbs({ items, light }: { items: { name: string; path: string }[]; light?: boolean }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs", light ? "text-bone-100/75" : "text-stone-600")}>
      <JsonLd data={breadcrumbLd(items)} />
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link href="/" className="inline-flex min-h-6 items-center hover:underline">Home</Link></li>
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            <span aria-hidden>/</span>
            {i === items.length - 1 ? <span aria-current="page">{it.name}</span> : <Link href={it.path} className="inline-flex min-h-6 items-center hover:underline">{it.name}</Link>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
