/**
 * Server-rendered page HTML → clean Markdown, for /<page>.md (answer engines and retrieval bots).
 * Reads only <main>, drops anything hidden from readers (aria-hidden, scripts, buttons, forms, media), and
 * keeps the content shapes that matter for citation: headings, paragraphs, lists, links and tables.
 * ponytail: a tag scanner, not a parser. It relies on React's regular, well-formed output; swap in a real
 * parser (parse5) if it ever has to read HTML written by hand.
 */
const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", mdash: "—", ndash: "–", hellip: "…", times: "×", pound: "£", middot: "·" };
const decode = (s: string) =>
  s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) =>
    e[0] === "#" ? String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : Number(e.slice(1))) : ENTITIES[e.toLowerCase()] ?? m);

/** Elements whose whole subtree is dropped. */
const DROP = new Set(["script", "style", "noscript", "svg", "button", "form", "dialog", "video", "iframe", "template", "select", "textarea", "nav"]);
const VOID = new Set(["img", "br", "hr", "input", "meta", "link", "source", "wbr"]);
const BLOCK = new Set(["p", "div", "section", "article", "header", "footer", "aside", "ul", "ol", "li", "dl", "dt", "dd", "table", "caption", "h1", "h2", "h3", "h4", "h5", "h6", "blockquote", "figure", "figcaption", "address", "details", "summary"]);

export function htmlToMarkdown(html: string, origin: string): string {
  const main = /<main\b[^>]*>([\s\S]*)<\/main>/i.exec(html)?.[1] ?? "";
  const tokens = main.match(/<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>|[^<]+/g) ?? [];
  let out = "";
  const stack: { tag: string; drop: boolean; href?: string; start?: number }[] = [];
  let dropping = 0;
  let row: string[] | null = null;
  let cell: string | null = null;
  let tableRows = 0;
  /** Set when a link closes: sibling links in a flex row have no space between them in the HTML. */
  let gap = false;
  const listDepth = () => stack.filter((s) => s.tag === "ul" || s.tag === "ol").length;
  const emit = (s: string) => {
    if (gap && /^[\p{L}\p{N}[]/u.test(s)) s = " " + s;
    gap = false;
    if (cell !== null) cell += s; else out += s;
  };
  const block = (prefix = "") => { if (cell === null) out = out.replace(/[ \t]+$/, "") + "\n\n" + prefix; };

  for (const t of tokens) {
    if (t.startsWith("<!--")) continue;
    if (t[0] !== "<") { if (!dropping) emit(decode(t).replace(/\s+/g, " ")); continue; }
    const close = t[1] === "/";
    const tag = /^<\/?([a-zA-Z0-9]+)/.exec(t)![1].toLowerCase();
    if (close) {
      // Pop back to the matching open tag.
      let i = stack.length - 1;
      while (i >= 0 && stack[i].tag !== tag) i--;
      if (i < 0) continue;
      while (stack.length > i) {
        const el = stack.pop()!;
        if (el.drop) { dropping--; continue; }
        if (dropping) continue;
        if (el.tag === "a" && el.href) {
          const text: string = (cell !== null ? cell : out).slice(el.start).trim();
          const linked: string = text ? `[${text}](${el.href})` : "";
          if (cell !== null) cell = cell.slice(0, el.start) + linked; else out = out.slice(0, el.start) + linked;
          gap = true;
        }
        if (el.tag === "strong" || el.tag === "b" || el.tag === "dt") {
          // A closing ** must touch its text, or Markdown will not read it as bold.
          if (cell !== null) cell = cell.trimEnd() + "**"; else out = out.trimEnd() + "**";
        }
        if (el.tag === "td" || el.tag === "th") { row?.push((cell ?? "").trim().replace(/\|/g, "\\|")); cell = null; }
        if (el.tag === "tr" && row) {
          out += `\n| ${row.join(" | ")} |`;
          if (++tableRows === 1) out += `\n| ${row.map(() => "---").join(" | ")} |`;
          row = null;
        }
        if (el.tag === "table") { out += "\n\n"; tableRows = 0; }
        if (BLOCK.has(el.tag)) block();
      }
      continue;
    }
    const selfClosing = VOID.has(tag) || t.endsWith("/>");
    const hidden = /\saria-hidden="true"/.test(t) || /\shidden(\s|>|=)/.test(t);
    const drop = DROP.has(tag) || hidden;
    if (!selfClosing) stack.push({ tag, drop });
    if (drop) { if (!selfClosing) dropping++; continue; }
    if (dropping) continue;
    if (tag === "br") { emit("\n"); continue; }
    if (/^h[1-6]$/.test(tag)) { block("#".repeat(Number(tag[1])) + " "); continue; }
    if (tag === "li") { block(); out = out.replace(/\n\n$/, "\n") + "  ".repeat(Math.max(0, listDepth() - 1)) + "- "; continue; }
    if (tag === "dt") { block("**"); continue; }
    if (tag === "table") { block(); tableRows = 0; continue; }
    if (tag === "tr") { row = []; continue; }
    if (tag === "td" || tag === "th") { cell = ""; continue; }
    if (tag === "strong" || tag === "b") { emit("**"); continue; }
    if (tag === "a") {
      if (gap && !/\s$/.test(cell ?? out)) emit(" ");
      gap = false;
      const href = /\shref="([^"]+)"/.exec(t)?.[1];
      const el = stack[stack.length - 1];
      if (href && !href.startsWith("#") && !href.startsWith("javascript:")) { el.href = decode(href).startsWith("/") ? origin + decode(href) : decode(href); el.start = (cell ?? out).length; }
      continue;
    }
    if (BLOCK.has(tag)) block();
  }
  return out
    .replace(/\*\*\s*\*\*/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim() + "\n";
}
