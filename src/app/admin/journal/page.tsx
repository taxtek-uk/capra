import Link from "next/link";
import { ExternalLink, Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { allJournal, readingMins, seoChecks, wordCount } from "@/lib/posts";
import { Btn, BtnLink, Card, CardHead, PageHead, Pill, StatusPill, Table, Td, Tr } from "@/components/admin/ui";
import { togglePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireAdmin();
  const posts = await allJournal();
  const live = posts.filter((p) => p.published).length;

  return (
    <>
      <PageHead title="Journal" sub={`${posts.length} posts · ${live} live on the site`}>
        <BtnLink href="/blog" target="_blank">Open journal <ExternalLink className="h-3.5 w-3.5" /></BtnLink>
        <BtnLink href="/admin/journal/new" variant="primary"><Plus className="h-4 w-4" /> New post</BtnLink>
      </PageHead>

      <Card>
        <CardHead title="All posts" sub="Built-in posts ship with the site; editing one saves it to the database and takes over from then on." />
        <div className="mt-4">
          <Table head={["Title", "Category", "Date", "Length", "SEO", "Status", ""]} empty="No posts yet.">
            {posts.map((p) => {
              const checks = seoChecks(p);
              const passed = checks.filter((c) => c.ok).length;
              return (
                <Tr key={p.slug}>
                  <Td>
                    <Link href={`/admin/journal/${p.slug}`} className="font-medium text-zinc-900 hover:underline">{p.title}</Link>
                    <span className="block text-xs text-zinc-400">/blog/{p.slug}{p.builtIn && " · built-in"}</span>
                  </Td>
                  <Td className="text-zinc-500">{p.category}</Td>
                  <Td className="whitespace-nowrap tnum">{p.date}</Td>
                  <Td className="whitespace-nowrap text-zinc-500 tnum">{wordCount(p)} words · {readingMins(p)} min</Td>
                  <Td><Pill tone={passed === checks.length ? "green" : passed >= 6 ? "amber" : "red"}>{passed}/{checks.length}</Pill></Td>
                  <Td><StatusPill value={p.published ? "published" : "draft"} /></Td>
                  <Td>
                    <form action={togglePost}>
                      <input type="hidden" name="slug" value={p.slug} />
                      <Btn variant="ghost" className="px-2.5 py-1 text-xs">{p.published ? "Unpublish" : "Publish"}</Btn>
                    </form>
                  </Td>
                </Tr>
              );
            })}
          </Table>
        </div>
      </Card>
    </>
  );
}
