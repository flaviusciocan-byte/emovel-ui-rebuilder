import { chromium } from "playwright";
import fs from "node:fs/promises";

const url = process.argv[2] || "https://example.com";

await fs.mkdir("public/captures", { recursive: true });
await fs.mkdir("research/html", { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
});

await page.goto(url, { waitUntil: "networkidle" });

const timestamp = Date.now();
const screenshotPath = `public/captures/capture-${timestamp}.png`;
const htmlPath = `research/html/page-${timestamp}.html`;

await page.screenshot({ path: screenshotPath, fullPage: true });

const html = await page.content();
await fs.writeFile(htmlPath, html, "utf8");

console.log({
  url,
  title: await page.title(),
  screenshotPath,
  htmlPath,
  capturedAt: new Date().toISOString(),
});

await browser.close();