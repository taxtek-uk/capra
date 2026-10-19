import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1080, 1440, 1920],
    imageSizes: [32, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  // /vacuum-jugs.md, /index.md for the homepage: each page as Markdown for answer engines (src/app/md).
  async rewrites() {
    return [{ source: "/:path(.+)\\.md", destination: "/md/:path" }];
  },
  async redirects() {
    // The previous capra.pk (React SPA) URL map → this site. 308 keeps link equity.
    return [
      { source: "/products", destination: "/shop", permanent: true },
      { source: "/products/vacuum-thermos", destination: "/vacuum-jugs", permanent: true },
      { source: "/products/tumbler-thermos", destination: "/vacuum-jugs", permanent: true },
      { source: "/products/vacuum-bottle", destination: "/insulated-bottles", permanent: true },
      { source: "/products/:path*", destination: "/shop", permanent: true },
      { source: "/shipping", destination: "/delivery", permanent: true },
      { source: "/returns", destination: "/delivery", permanent: true },
      { source: "/care", destination: "/care-guide", permanent: true },
      { source: "/quality", destination: "/about", permanent: true },
      { source: "/size-guide", destination: "/prices", permanent: true },
      { source: "/career", destination: "/contact", permanent: true },
      { source: "/coming-soon", destination: "/shop", permanent: true },
      { source: "/index", destination: "/", permanent: true },
      { source: "/price-list", destination: "/prices", permanent: true },
      { source: "/distributors", destination: "/wholesale", permanent: true },
    ];
  },
  async headers() {
    const isDev = process.env.NODE_ENV === "development";
    const csp = [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
      "script-src-attr 'none'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      `connect-src 'self'${isDev ? " ws: wss:" : ""}`,
      "object-src 'none'", "base-uri 'self'", "form-action 'self'", "frame-ancestors 'none'",
      ...(!isDev ? ["upgrade-insecure-requests"] : []),
    ].join("; ");
    const immutable = [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }];
    return [
      { source: "/(.*)", headers: [
        { key: "Content-Security-Policy", value: csp },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      ] },
      { source: "/images/:path*", headers: immutable },
    ];
  },
};
export default nextConfig;
