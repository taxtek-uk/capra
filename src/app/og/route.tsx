import { ImageResponse } from "next/og";
import { BRAND } from "@/lib/brand";

/**
 * A share card for any page: the page's own title beside a room photograph. It takes a site path, never
 * free text, and reads the title from that page, so nobody can make a branded image saying something we
 * did not publish. Social scrapers do not render AVIF, hence the JPEG photo and PNG wordmark.
 * Cached at the edge for a year; a deploy clears it.
 */
const PATH = /^\/[a-z0-9\-/]{0,200}$/;
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function titleOf(origin: string, path: string) {
  const res = await fetch(new URL(path, origin), { headers: { "user-agent": "capra-og" }, redirect: "manual" }).catch(() => null);
  if (!res?.ok) return BRAND.name;
  const t = /<title[^>]*>([^<]*)<\/title>/i.exec(await res.text())?.[1];
  return t ? decode(t).replace(/\s*\|\s*CAPRA$/, "").trim() || BRAND.name : BRAND.name;
}

const dataUrl = async (origin: string, path: string, type: string) => {
  const buf = await fetch(new URL(path, origin)).then((r) => r.arrayBuffer());
  return `data:${type};base64,${Buffer.from(buf).toString("base64")}`;
};

export async function GET(req: Request) {
  const { origin, searchParams } = new URL(req.url);
  const raw = searchParams.get("path") ?? "/";
  const path = PATH.test(raw) ? raw : "/";
  const [title, photo, logo] = await Promise.all([
    titleOf(origin, path),
    dataUrl(origin, "/images/brand/og-photo.jpg", "image/jpeg"),
    dataUrl(origin, "/images/brand/capra-mark.png", "image/png"),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0b0a09" }}>
        <div style={{ width: 600, height: 630, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 56 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}><img src={logo} width={45} height={80} alt="" /><span style={{ fontSize: 34, letterSpacing: 12, color: "#e3cc9c" }}>CAPRA</span></div>
          <div style={{ display: "flex", fontSize: title.length > 48 ? 46 : 56, lineHeight: 1.1, color: "#faf8f4", letterSpacing: -1 }}>{title}</div>
          <div style={{ display: "flex", fontSize: 22, color: "#d6b982" }}>{BRAND.domain.replace("https://www.", "")}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={photo} width={600} height={630} alt="" style={{ objectFit: "cover" }} />
      </div>
    ),
    { width: 1200, height: 630, headers: { "cache-control": "public, max-age=86400, s-maxage=31536000" } },
  );
}
