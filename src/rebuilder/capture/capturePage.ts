import { chromium } from "playwright";

export async function capturePage(url: string) {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1200 },
  });

  await page.goto(url, { waitUntil: "networkidle" });

  const screenshotPath = `public/captures/capture-${Date.now()}.png`;

  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });

  const title = await page.title();

  await browser.close();

  return {
    url,
    title,
    screenshotPath,
    capturedAt: new Date().toISOString(),
  };
}