import { chromium } from "playwright";
import fs from "node:fs/promises";

const url = process.argv[2] || "https://example.com";

await fs.mkdir("research/metadata", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
});

await page.goto(url, { waitUntil: "networkidle" });

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

const path = `research/metadata/metadata-${Date.now()}.json`;

await fs.writeFile(path, JSON.stringify({ url, ...metadata }, null, 2), "utf8");

console.log({
  url,
  title: metadata.title,
  headings: metadata.headings.length,
  links: metadata.links.length,
  images: metadata.images.length,
  path,
});

await browser.close();