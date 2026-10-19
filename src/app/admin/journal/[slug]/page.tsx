import { notFound } from "next/navigation";
import { Check, ExternalLink, X } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { CATEGORIES, getJournal, seoChecks, type Journal } from "@/lib/posts";
import { SERVICE_AREAS } from "@/lib/brand";
import { Btn, BtnLink, Card, Field, Input, PageHead, Pill, Select, Textarea } from "@/components/admin/ui";
import { Counted } from "@/components/admin/Counted";
import { deletePost, savePost } from "../actions";

export const dynamic = "force-dynamic";

const BLANK: Journal = {
  slug: "", title: "", seoTitle: null, excerpt: "", category: "Guides", date: new Date().toISOString().slice(0, 10), updated: new Date().toISOString().slice(0, 10),
  image: "", imageAlt: "", body: "", sections: [], keywords: [], areas: [], faqs: [], author: null, published: false, builtIn: false,
};

const NOTICE: Record<string, { tone: "green" | "amber" | "red"; text: string }> = {
  saved: { tone: "green", text: "Saved. The live pages have been refreshed." },
  seo: { tone: "amber", text: "Not published: the SEO title must be 60 characters or fewer and the description 70–160, or the site build will fail." },
  invalid: { tone: "red", text: "Some fields were missing or too long. Nothing was saved." },
};

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ e?: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const { e } = await searchParams;
  const isNew = slug === "new";
  const post = isNew ? BLANK : await getJournal(slug);
  if (!post) notFound();
  const checks = seoChecks(post);
  const note = e ? NOTICE[e] : undefined;

  return (
    <form action={savePost}>
      <input type="hidden" name="original" value={isNew ? "" : post.slug} />
      <PageHead title={isNew ? "New post" : post.title} sub={isNew ? "Write it, check the SEO panel, then publish." : `/blog/${post.slug}${post.builtIn ? " · built-in post, editing saves your own copy" : ""}`}>
        {!isNew && <BtnLink href={`/blog/${post.slug}`} target="_blank">Preview <ExternalLink className="h-3.5 w-3.5" /></BtnLink>}
        <BtnLink href="/admin/journal">Back</BtnLink>
        <Btn type="submit" variant="primary">Save post</Btn>
      </PageHead>

      {note && (
        <div className={`mb-4 rounded-lg border px-4 py-2.5 text-sm ${note.tone === "green" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : note.tone === "amber" ? "border-amber-200 bg-amber-50 text-amber-800" : "border-rose-200 bg-rose-50 text-rose-800"}`}>
          {note.text}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr] lg:items-start">
        <div className="space-y-4">
          <Card className="space-y-4 p-5">
            <Counted label="Headline (the H1 on the page)" name="title" defaultValue={post.title} max={140} min={10} required />
            <Counted label="SEO title — leave blank to use the headline" name="seoTitle" defaultValue={post.seoTitle ?? ""} max={60} hint="Shown in Google. Over 60 characters fails the SEO gate." />
            <Counted label="Description / card excerpt" name="description" rows={3} defaultValue={post.excerpt} min={70} max={160} hint="Doubles as the meta description, so it must land between 70 and 160 characters." />
            <Field label="URL slug" hint="Leave blank on a new post to derive it from the headline. Changing it on an existing post moves the URL.">
              <Input name="slug" defaultValue={post.slug} placeholder="thermos-price-in-pakistan" />
            </Field>
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">Article</h2>
            <p className="mt-0.5 mb-3 text-xs text-zinc-500">Blank line between paragraphs. A line starting <code className="rounded bg-zinc-100 px-1">## </code> becomes a subheading.</p>
            <Textarea name="body" rows={26} defaultValue={post.body} className="font-mono text-[13px]" />
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">FAQ block</h2>
            <p className="mt-0.5 mb-3 text-xs text-zinc-500">Rendered as FAQPage structured data — the format Google and AI assistants quote from. One <code className="rounded bg-zinc-100 px-1">Q:</code> line followed by an <code className="rounded bg-zinc-100 px-1">A:</code> line, per question.</p>
            <Textarea name="faqs" rows={8} defaultValue={post.faqs.map((f) => `Q: ${f.q}\nA: ${f.a}`).join("\n\n")} placeholder={"Q: How much is a 2 litre thermos?\nA: The CAPRA SLD 2 litre jug is Rs 1,585."} className="font-mono text-[13px]" />
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Publishing</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-2 rounded-lg border border-zinc-200 p-3 text-sm">
                <input type="checkbox" name="publish" defaultChecked={post.published} className="h-4 w-4 rounded border-zinc-300" />
                <span>Live on the site</span>
              </label>
              <Field label="Publication date"><Input type="date" name="date" defaultValue={post.date} /></Field>
              <Field label="Category">
                <Select name="category" defaultValue={post.category}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</Select>
              </Field>
              <Field label="Author" hint="Optional byline."><Input name="author" defaultValue={post.author ?? ""} placeholder="CAPRA" /></Field>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Cover image</h2>
            <Field label="Image path" hint="A path under /images/, or a Vercel Blob URL. Anything else is discarded.">
              <Input name="image" defaultValue={post.image} placeholder="/images/blog/…" />
            </Field>
            <Field label="Alt text" className="mt-3" hint="Describes the picture. An image with no alt fails the SEO gate.">
              <Input name="imageAlt" defaultValue={post.imageAlt} />
            </Field>
            {/* eslint-disable-next-line @next/next/no-img-element -- admin preview of an arbitrary path; not a page image */}
            {post.image && <img src={post.image} alt="" className="mt-3 aspect-[16/10] w-full rounded-lg object-cover" />}
          </Card>

          <Card className="p-5">
            <h2 className="text-sm font-semibold text-zinc-900">SEO &amp; GEO</h2>
            <p className="mt-0.5 mb-3 text-xs text-zinc-500">Keywords feed the meta tag; areas add local relevance to the page&rsquo;s structured data.</p>
            <Field label="Keywords, comma separated">
              <Input name="keywords" defaultValue={post.keywords.join(", ")} placeholder="thermos price in pakistan, vacuum jug" />
            </Field>
            <Field label="Local areas, comma separated" className="mt-3" hint={`From the service list: ${SERVICE_AREAS.slice(0, 6).join(", ")}…`}>
              <Input name="areas" defaultValue={post.areas.join(", ")} placeholder="Lahore, Karachi, Islamabad" />
            </Field>
          </Card>

          <Card className="p-5">
            <h2 className="mb-3 text-sm font-semibold text-zinc-900">Pre-flight</h2>
            <ul className="space-y-2 text-sm">
              {checks.map((c) => (
                <li key={c.label} className="flex items-start gap-2">
                  {c.ok ? <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <X className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />}
                  <span className="flex-1 text-zinc-700">{c.label}</span>
                  <span className="shrink-0 text-xs text-zinc-400 tnum">{c.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-zinc-500">Checked against the saved version. Save to refresh.</p>
          </Card>

          {!isNew && !post.builtIn && (
            <Card className="p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Danger zone</h2>
              <p className="mt-1 text-xs text-zinc-500">Deletes the database row. A built-in post of the same slug would come back.</p>
              <Pill tone="neutral" className="mt-3">{post.slug}</Pill>
            </Card>
          )}
        </div>
      </div>

      {!isNew && !post.builtIn && (
        <div className="mt-4 flex justify-end">
          <button formAction={deletePost} name="slug" value={post.slug} className="rounded-lg border border-rose-200 bg-white px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50">
            Delete this post
          </button>
        </div>
      )}
    </form>
  );
}
