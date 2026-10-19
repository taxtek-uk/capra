import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { overrides } from "@/lib/catalogue";
import { FAMILIES, SERIES, fromPrice, seriesHref, toPrice } from "@/content/products";
import { pkr } from "@/lib/utils";
import { Card, CardHead, PageHead, Pill, Table, Td, Tr } from "@/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const ov = await overrides();
  return (
    <>
      <PageHead title="Products" sub={`${SERIES.length} designs · ${SERIES.reduce((a, s) => a + s.sizes.length, 0)} models · ${ov.size} edited here`} />
      <Card>
        <CardHead title="Catalogue" sub="Prices come from the price list in the code (src/content/products.ts). Here you control listing, stock, copy, image and SEO." />
        <Table head={["Design", "Range", "Models", "Price", "Shop", "State", ""]}>
          {SERIES.map((s) => {
            const o = ov.get(s.slug);
            return (
              <Tr key={s.slug}>
                <Td><Link href={`/admin/products/edit?slug=${s.slug}`} className="font-medium text-zinc-900 hover:underline">{o?.name || `CAPRA ${s.name}`}</Link><span className="block text-xs text-zinc-400">{seriesHref(s)}</span></Td>
                <Td className="whitespace-nowrap text-zinc-500">{FAMILIES[s.family].name}</Td>
                <Td className="text-xs text-zinc-500">{s.sizes.map((z) => z.model).join(", ")}</Td>
                <Td className="whitespace-nowrap tnum">{pkr(fromPrice(s))} – {pkr(toPrice(s))}</Td>
                <Td className="text-xs">{o?.sellable === false ? <Pill tone="red">Not sold</Pill> : o?.stock === 0 ? <Pill tone="amber">Out of stock</Pill> : <Pill tone="green">{o?.stock == null ? "On sale" : `${o.stock} in stock`}</Pill>}</Td>
                <Td>{o?.hidden ? <Pill tone="red">Hidden</Pill> : o ? <Pill tone="blue">Edited</Pill> : <Pill>As shipped</Pill>}</Td>
                <Td><a href={seriesHref(s)} target="_blank" className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900">View <ExternalLink className="h-3 w-3" /></a></Td>
              </Tr>
            );
          })}
        </Table>
      </Card>
    </>
  );
}
