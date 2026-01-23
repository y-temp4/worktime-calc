import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import tailwindcss from "@tailwindcss/vite";
import { translations } from "./src/i18n/translations";

const siteBaseUrl = "https://y-temp4.github.io/worktime-calc";

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const buildMetaHead = (lang: "ja" | "en", headContent: string) => {
  const metaCharset =
    headContent.match(/<meta\s+charset=["'][^"']*["']\s*\/?>/i)?.[0] ??
    '<meta charset="UTF-8" />';
  const metaViewport =
    headContent.match(/<meta\s+name=["']viewport["'][^>]*>/i)?.[0] ??
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />';
  const passthroughMetaTags = (
    headContent.match(/<meta\b[^>]*>/gi) || []
  ).filter(
    (tag) =>
      !/charset=/i.test(tag) &&
      !/name=["']viewport["']/i.test(tag) &&
      !/name=["']description["']/i.test(tag) &&
      !/name=["']keywords["']/i.test(tag) &&
      !/name=["']author["']/i.test(tag) &&
      !/name=["']twitter:/i.test(tag) &&
      !/property=["']og:/i.test(tag),
  );
  const linkTags = (headContent.match(/<link\b[^>]*>/gi) || []).filter(
    (tag) => !/rel=["']canonical["']/i.test(tag),
  );
  const scriptTags = (
    headContent.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || []
  ).filter((tag) => !/application\/ld\+json/i.test(tag));

  const t = translations[lang];
  const pageUrl = lang === "ja" ? `${siteBaseUrl}/` : `${siteBaseUrl}/en`;
  const ogImage = `${siteBaseUrl}/${lang === "ja" ? "ogp_ja.png" : "ogp_en.png"}`;
  const siteName = lang === "ja" ? "作業時間計算機" : "Work Time Calculator";
  const locale = lang === "ja" ? "ja_JP" : "en_US";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: t.meta.ogTitle,
    description: t.meta.description,
    url: pageUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    inLanguage: lang,
    author: {
      "@type": "Person",
      name: "y-temp4",
    },
    keywords: t.meta.keywords,
  };

  const lines = [
    metaCharset,
    metaViewport,
    ...passthroughMetaTags,
    ...linkTags,
    `<title>${escapeHtml(t.title)}</title>`,
    "",
    "<!-- OGP Meta Tags -->",
    `<meta name="description" content="${escapeHtml(t.meta.description)}" />`,
    "",
    "<!-- Open Graph -->",
    '<meta property="og:type" content="website" />',
    `<meta property="og:title" content="${escapeHtml(t.meta.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(t.meta.ogDescription)}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:url" content="${pageUrl}" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteName)}" />`,
    `<meta property="og:locale" content="${locale}" />`,
    "",
    "<!-- Twitter Card -->",
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(t.meta.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(t.meta.ogDescription)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    "",
    "<!-- Additional Meta -->",
    `<meta name="keywords" content="${escapeHtml(t.meta.keywords)}" />`,
    '<meta name="author" content="y-temp4" />',
    `<link rel="canonical" href="${pageUrl}" />`,
    ...scriptTags,
    "",
    "<!-- JSON-LD Structured Data -->",
    '<script type="application/ld+json">',
    JSON.stringify(jsonLd),
    "</script>",
  ];

  return lines.map((line) => (line.length ? `    ${line}` : "")).join("\n");
};

const generateSsg = () => {
  let resolvedRoot = "";
  let resolvedOutDir = "dist";

  return {
    name: "worktime-ssg",
    apply: "build" as const,
    configResolved(config: { root: string; build: { outDir: string } }) {
      resolvedRoot = config.root;
      resolvedOutDir = config.build.outDir;
    },
    closeBundle() {
      const distDir = path.resolve(resolvedRoot, resolvedOutDir);
      const indexPath = path.join(distDir, "index.html");
      const html = fs.readFileSync(indexPath, "utf8");
      const headMatch = html.match(/<head>([\s\S]*?)<\/head>/i);
      if (!headMatch) {
        throw new Error("Failed to locate <head> in built HTML.");
      }
      const headContent = headMatch[1];

      const buildHtml = (lang: "ja" | "en") => {
        const head = buildMetaHead(lang, headContent);
        return html
          .replace(/<html\b[^>]*>/i, (match) => {
            if (/lang=/i.test(match)) {
              return match.replace(/lang=["'][^"']*["']/i, `lang="${lang}"`);
            }
            return match.replace(/>$/, ` lang="${lang}">`);
          })
          .replace(/<head>[\s\S]*?<\/head>/i, `<head>\n${head}\n  </head>`);
      };

      fs.writeFileSync(indexPath, buildHtml("ja"));

      const enDir = path.join(distDir, "en");
      fs.mkdirSync(enDir, { recursive: true });
      fs.writeFileSync(path.join(enDir, "index.html"), buildHtml("en"));
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), tailwindcss(), generateSsg()],
  base: "/worktime-calc/",
});
