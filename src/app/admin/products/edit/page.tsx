import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { overrides } from "@/lib/catalogue";
import { FAMILIES, SERIES, seriesHref } from "@/content/products";
import { pkr } from "@/lib/utils";
import { Btn, BtnLink, Card, Field, Input, PageHead, Pill, Textarea } from "@/components/admin/ui";
import { Counted } from "@/components/admin/Counted";
import { resetProduct, saveProduct } from "../actions";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ slug?: string; e?: string }> }) {
  await requireAdmin();
  const { slug = "", e } = await searchParams;
  const s = SERIES.find((x) => x.slug === slug);
  if (!s) notFound();
  const ov = (await overrides()).get(slug);
  const href = seriesHref(s);

  return (
    <form action={saveProduct}>
      <input type="hidden" name="slug" value={slug} />
      <PageHead title={ov?.name || `CAPRA ${s.name}`} sub={`${FAMILIES[s.family].name} · ${href}`}>
        <BtnLink href={href} target="_blank">View page <ExternalLink className="h-3.5 w-3.5" /></BtnLink>
        <BtnLink href="/admin/products">Back</BtnLink>
        <Btn type="submit" variant="primary">Save changes</Btn>
      </PageHead>
      {e === "saved" && <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">Saved. The pages showing this product have been refreshed.</div>}

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <div className="space-y-4">
          <Card className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-zinc-900">Copy</h2>
            <Field label="Product name" hint={`Shipped: CAPRA ${s.name}`}><Input name="name" defaultValue={ov?.name ?? ""} placeholder={`CAPRA ${s.name}`} /></Field>
            <Field label="Short summary" hint="On product cards and under the heading."><Input name="summary" defaultValue={ov?.summary ?? ""} placeholder={s.summary} /></Field>
            <Field label="Lede under the heading" hint="Blank uses the summary."><Textarea name="blurb" rows={3} defaultValue={ov?.blurb ?? ""} /></Field>
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">Prices (read only)</h2>
            <p className="mt-1 text-xs text-zinc-500">From the factory price list in src/content/products.ts. Change them there so the shop, emails, structured data and llms.txt stay in step.</p>
            <ul className="mt-3 grid gap-1 text-sm">{s.sizes.map((z) => <li key={z.model} className="flex justify-between"><span>{z.model} · {z.label}</span><span className="tnum">{pkr(z.price)}{s.colours.some((c) => c.add) ? ` · colour ${pkr(z.price + 100)}` : ""}</span></li>)}</ul>
          </Card>
        </div>
        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">Shop</h2>
            <div className="mt-3 space-y-3">
              <label className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3 text-sm"><input type="checkbox" name="sellable" defaultChecked={ov?.sellable ?? true} className="h-4 w-4 rounded border-zinc-300" /><span>Sell online</span></label>
              <label className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3 text-sm"><input type="checkbox" name="hidden" defaultChecked={ov?.hidden} className="h-4 w-4 rounded border-zinc-300" /><span>Hide from listings (page stays reachable)</span></label>
              <Field label="Stock" hint="Blank means no cap. 0 shows it as out of stock. Counted across all sizes and colours."><Input name="stock" type="number" min={0} defaultValue={ov?.stock ?? ""} placeholder="No cap" /></Field>
            </div>
            <p className="mt-3">{ov ? <Pill tone="blue">Edited here</Pill> : <Pill>As shipped</Pill>}</p>
          </Card>
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Card image</h2>
            <Field label="Image path" hint="A path under /images/. Blank uses the first photo."><Input name="image" defaultValue={ov?.image ?? ""} placeholder={s.images[0].src} /></Field>
          </Card>
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">SEO</h2>
            <div className="mt-3 space-y-3">
              <Counted label="SEO title" name="seoTitle" defaultValue={ov?.seoTitle ?? ""} max={60} hint={`Shipped: ${s.seo.title}`} />
              <Counted label="Meta description" name="seoDescription" rows={3} defaultValue={ov?.seoDescription ?? ""} min={70} max={160} hint={`Shipped: ${s.seo.description}`} />
              <Field label="Keywords, comma separated"><Input name="keywords" defaultValue={ov?.keywords.join(", ") ?? ""} placeholder={s.seo.keywords.join(", ")} /></Field>
            </div>
          </Card>
          {ov && (
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Revert</h2>
              <p className="mt-1 text-xs text-zinc-500">Deletes this override; the product goes back to the shipped copy.</p>
              <button formAction={resetProduct} className="mt-3 rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50">Revert to shipped version</button>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
