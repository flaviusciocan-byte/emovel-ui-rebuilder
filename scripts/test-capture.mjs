import { chromium } from "playwright";

const url = process.argv[2] || "https://example.com";

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
});

await page.goto(url, { waitUntil: "networkidle" });

const path = `public/captures/capture-${Date.now()}.png`;

await page.screenshot({
  path,
  fullPage: true,
});

console.log({
  url,
  title: await page.title(),
  path,
  capturedAt: new Date().toISOString(),
});

await browser.close();