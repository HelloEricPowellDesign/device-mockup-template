/**
 * Generate sharp static placeholder posters (device-only, rest pose, no loop).
 *
 *   node scripts/generate-placeholder-motion.mjs
 *
 * Writes PNG to ../ericpowell.design/public/motion/
 */
import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.resolve(root, '../ericpowell.design/public/motion');

const JOBS = [
  { name: 'nsrl-form-hero', size: 'hero', spec: 'ipad', theme: 'nike', w: 2880, h: 1152 },
  { name: 'nsrl-form-card', size: 'card', spec: 'ipad', theme: 'nike', w: 1280, h: 800 },
  { name: 'ebay-motors-hero', size: 'hero', spec: 'macbook', theme: 'ebay', w: 2880, h: 1152 },
  { name: 'ebay-motors-card', size: 'card', spec: 'macbook', theme: 'ebay', w: 1280, h: 800 },
  { name: 'walmart-fitment-hero', size: 'hero', spec: 'desktop+iphone', theme: 'walmart', w: 2880, h: 1152 },
  { name: 'walmart-fitment-card', size: 'card', spec: 'desktop+iphone', theme: 'walmart', w: 1280, h: 800 },
  { name: 'walmart-plus-hero', size: 'hero', spec: 'macbook+iphone', theme: 'walmart', w: 2880, h: 1152 },
  { name: 'walmart-plus-card', size: 'card', spec: 'macbook+iphone', theme: 'walmart', w: 1280, h: 800 },
];

async function main() {
  await mkdir(outDir, { recursive: true });

  const filter = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const jobs = filter.length
    ? JOBS.filter((j) => filter.some((f) => j.name.includes(f)))
    : JOBS;
  if (!jobs.length) {
    console.error('No jobs matched:', filter.join(', '));
    process.exit(1);
  }

  const server = await createServer({
    root,
    configFile: path.join(root, 'vite.config.ts'),
    server: { port: 5199, strictPort: true },
  });
  await server.listen();
  const base = 'http://127.0.0.1:5199';
  console.log('Vite', base);

  const browser = await chromium.launch({ headless: true });

  try {
    for (const job of jobs) {
      console.log(`Capturing ${job.name} (${job.w}×${job.h})…`);
      const page = await browser.newPage({
        viewport: { width: job.w, height: job.h },
        deviceScaleFactor: 1,
      });
      const qs = new URLSearchParams({
        capture: '',
        size: job.size,
        spec: job.spec,
        theme: job.theme || 'nike',
        w: String(job.w),
        h: String(job.h),
      });
      await page.goto(`${base}/?${qs.toString()}`, { waitUntil: 'networkidle' });
      await page.waitForSelector('[data-capture-root]');
      await page.waitForTimeout(200);
      await page.locator('[data-capture-root]').screenshot({
        path: path.join(outDir, `${job.name}.png`),
        type: 'png',
      });
      await page.close();
      console.log(`Wrote ${job.name}.png`);
    }
  } finally {
    await browser.close();
    await server.close();
  }

  // Remove stale looping videos from earlier pipeline
  for (const job of jobs) {
    for (const ext of ['webm', 'mp4']) {
      try {
        await rm(path.join(outDir, `${job.name}.${ext}`), { force: true });
      } catch {
        /* ignore */
      }
    }
  }

  console.log('\nDone →', outDir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
