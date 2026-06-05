import { chromium } from "playwright";
import fs from "node:fs/promises";

const url = process.argv[2];

if (!url) {
  console.error("Usage: node scripts/rebuild-url.mjs https://example.com");
  process.exit(1);
}

const timestamp = Date.now();

await fs.mkdir("public/captures", { recursive: true });
await fs.mkdir("research/html", { recursive: true });
await fs.mkdir("research/metadata", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
});

await page.goto(url, { waitUntil: "networkidle" });

const screenshotPath = `public/captures/capture-${timestamp}.png`;
const htmlPath = `research/html/page-${timestamp}.html`;
const metadataPath = `research/metadata/metadata-${timestamp}.json`;

await page.screenshot({ path: screenshotPath, fullPage: true });

const html = await page.content();
await fs.writeFile(htmlPath, html, "utf8");

const metadata = await page.evaluate(() => {
  const getMeta = (name) =>
    document.querySelector(`meta[name="${name}"]`)?.getAttribute("content") ||
    document.querySelector(`meta[property="${name}"]`)?.getAttribute("content") ||
    "";

  return {
    title: document.title,
    description: getMeta("description") || getMeta("og:description"),
    headings: Array.from(document.querySelectorAll("h1,h2,h3")).map((el) => ({
      tag: el.tagName.toLowerCase(),
      text: el.textContent?.trim() || "",
    })),
    links: Array.from(document.querySelectorAll("a")).slice(0, 50).map((el) => ({
      text: el.textContent?.trim() || "",
      href: el.href,
    })),
    images: Array.from(document.querySelectorAll("img")).slice(0, 50).map((el) => ({
      alt: el.alt || "",
      src: el.src,
    })),
  };
});

await fs.writeFile(
  metadataPath,
  JSON.stringify({ url, ...metadata, capturedAt: new Date().toISOString() }, null, 2),
  "utf8"
);

console.log({
  status: "ok",
  url,
  title: metadata.title,
  screenshotPath,
  htmlPath,
  metadataPath,
});

await browser.close();