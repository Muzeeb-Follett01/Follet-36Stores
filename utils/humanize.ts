// utils/humanize.ts
import type { Page, Locator } from '@playwright/test';
 
export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));
 
/** Random integer in [min, max] */
export const rand = (min: number, max: number) =>
  Math.floor(min + Math.random() * (max - min + 1));
 
/** Base ± spread (never below 0) */
export const jitter = (baseMs: number, spreadMs: number) =>
  Math.max(0, baseMs + rand(-spreadMs, spreadMs));
 
/** Type with per‑char variability + occasional micro‑pauses */
export async function humanType(
  locator: Locator,
  text: string,
  opts?: {
    basePerCharMs?: number;   // default 100
    spreadPerCharMs?: number; // default 130
    pauseEvery?: number;      // default 4 chars
    pauseBaseMs?: number;     // default 190
    pauseSpreadMs?: number;   // default 150
  }
) {
  const {
    basePerCharMs = 100,
    spreadPerCharMs = 130,
    pauseEvery = 4,
    pauseBaseMs = 190,
    pauseSpreadMs = 150,
  } = opts || {};
 
  let bucket = 0;
  for (const ch of text) {
    console.log(`⌨️ Typing char: '${ch}' (next delay ~${basePerCharMs}ms ±${spreadPerCharMs}ms)`);
    await locator.type(ch, { delay: jitter(basePerCharMs, spreadPerCharMs) });
    // await locator.pressSequentially(ch, { delay: jitter(basePerCharMs, spreadPerCharMs) });
    bucket++;
    if (bucket >= pauseEvery && Math.random() < 0.35) {
      await sleep(jitter(pauseBaseMs, pauseSpreadMs));
      bucket = 0;
    }
  }
}
 
/** Click with a small pre/post think time */
export async function humanClick(
  locator: Locator,
  opts?: {
    beforeBaseMs?: number; beforeSpreadMs?: number;
    afterBaseMs?: number;  afterSpreadMs?: number;
  }
) {
  const {
    beforeBaseMs = 220, beforeSpreadMs = 180,
    afterBaseMs  = 160, afterSpreadMs  = 120,
  } = opts || {};
 
  await sleep(jitter(beforeBaseMs, beforeSpreadMs));
  await locator.click();
  await sleep(jitter(afterBaseMs, afterSpreadMs));
}
 
/** Navigate and pause like a person scanning the page */
export async function humanGoto(
  page: Page,
  url: string,
  opts?: {
    waitFor?: 'domcontentloaded' | 'load' | 'networkidle';
    postBaseMs?: number; postSpreadMs?: number;
  }
) {
  const { waitFor = 'domcontentloaded', postBaseMs = 350, postSpreadMs = 250 } = opts || {};
  await page.goto(url);
  await page.waitForLoadState(waitFor);
  await sleep(jitter(postBaseMs, postSpreadMs));
}
 
/** Human-ish scroll: bursty, with pauses */
export async function humanScroll(
  page: Page,
  opts?: {
    totalPx?: number;            // overall distance
    stepMin?: number; stepMax?: number;
    pauseBaseMs?: number; pauseSpreadMs?: number;
  }
) {
  const {
    totalPx = 1200,
    stepMin = 120, stepMax = 380,
    pauseBaseMs = 180, pauseSpreadMs = 140,
  } = opts || {};
 
  let scrolled = 0;
  while (scrolled < totalPx) {
    const step = rand(stepMin, stepMax);
    await page.mouse.wheel(0, step);
    scrolled += step;
    await sleep(jitter(pauseBaseMs, pauseSpreadMs));
  }
}
 
/** Fill using humanType (clears first, then human typing) */
export async function humanFill(
  locator: Locator,
  text: string,
  opts?: Parameters<typeof humanType>[2]
) {
  await locator.click({ force: true });
  await locator.fill(''); // clear
  await humanType(locator, text, opts);
}
 
/** Key press with a small hesitation */
export async function humanPress(
  locator: Locator,
  key: string,
  opts?: { beforeBaseMs?: number; beforeSpreadMs?: number }
) {
  const { beforeBaseMs = 140, beforeSpreadMs = 110 } = opts || {};
  await sleep(jitter(beforeBaseMs, beforeSpreadMs));
  await locator.press(key);
}