/**
 * Dev-only API: write exported motion assets into ericpowell.design
 * and keep matching work frontmatter in sync.
 *
 *   POST /api/portfolio-motion/file   raw body + x-filename
 *   POST /api/portfolio-motion/link   JSON { slug, devices, kinds }
 */
import type { Plugin } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { IncomingMessage, ServerResponse } from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORTFOLIO_ROOT = path.resolve(__dirname, '../ericpowell.design');
const MOTION_DIR = path.join(PORTFOLIO_ROOT, 'public/motion');
const WORK_DIR = path.join(PORTFOLIO_ROOT, 'src/content/work');

const SAFE_NAME = /^[a-z0-9]+(?:-[a-z0-9]+)*-(?:hero|card)\.(?:png|webm|mp4)$/;

function readBody(req: IncomingMessage): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function formatDevicesYaml(devices: string | string[]): string {
  if (typeof devices === 'string') return `motionDevices: ${devices}`;
  if (devices.length === 1) return `motionDevices: ${devices[0]}`;
  return ['motionDevices:', ...devices.map((d) => `  - ${d}`)].join('\n');
}

function upsertMotionFrontmatter(
  source: string,
  opts: { slug: string; devices: string[]; kinds: Array<'hero' | 'card'> },
): string {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) throw new Error('Work file has no frontmatter');

  let fm = match[1];
  const rest = source.slice(match[0].length);

  // Drop existing motion keys (scalar or list-form motionDevices)
  fm = fm
    .replace(/^motionHero:.*$/m, '')
    .replace(/^motionCard:.*$/m, '')
    .replace(/^motionDevices:.*(?:\n(?:[ \t]+-.*))*$/m, '')
    .replace(/\n{3,}/g, '\n\n')
    .trimEnd();

  const motionLines: string[] = [];
  if (opts.kinds.includes('hero')) motionLines.push(`motionHero: /motion/${opts.slug}-hero`);
  if (opts.kinds.includes('card')) motionLines.push(`motionCard: /motion/${opts.slug}-card`);
  // Preserve the other motion path if this export only did one kind
  if (!opts.kinds.includes('hero') && /^motionHero:/m.test(match[1])) {
    const prev = match[1].match(/^motionHero:.*$/m)?.[0];
    if (prev) motionLines.unshift(prev);
  }
  if (!opts.kinds.includes('card') && /^motionCard:/m.test(match[1])) {
    const prev = match[1].match(/^motionCard:.*$/m)?.[0];
    if (prev) motionLines.push(prev);
  }
  motionLines.push(
    formatDevicesYaml(opts.devices.length === 1 ? opts.devices[0]! : opts.devices),
  );

  // Insert after stack: (or at end of frontmatter)
  if (/^stack:/m.test(fm)) {
    fm = fm.replace(/^(stack:.*)$/m, `$1\n${motionLines.join('\n')}`);
  } else {
    fm = `${fm}\n${motionLines.join('\n')}`;
  }

  return `---\n${fm.trim()}\n---\n${rest.startsWith('\n') ? rest : `\n${rest}`}`;
}

async function handleFile(req: IncomingMessage, res: ServerResponse) {
  const filename = String(req.headers['x-filename'] || '');
  if (!SAFE_NAME.test(filename)) {
    return sendJson(res, 400, { ok: false, error: `Invalid filename: ${filename}` });
  }
  await mkdir(MOTION_DIR, { recursive: true });
  const dest = path.join(MOTION_DIR, filename);
  const body = await readBody(req);
  if (!body.length) return sendJson(res, 400, { ok: false, error: 'Empty body' });
  await writeFile(dest, body);
  return sendJson(res, 200, { ok: true, path: dest });
}

async function handleLink(req: IncomingMessage, res: ServerResponse) {
  const raw = (await readBody(req)).toString('utf8');
  let payload: { slug?: string; devices?: string[]; kinds?: Array<'hero' | 'card'> };
  try {
    payload = JSON.parse(raw);
  } catch {
    return sendJson(res, 400, { ok: false, error: 'Invalid JSON' });
  }

  const slug = payload.slug?.trim();
  const devices = payload.devices?.filter(Boolean) ?? [];
  const kinds = payload.kinds ?? [];
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return sendJson(res, 400, { ok: false, error: 'Invalid slug' });
  }
  if (!devices.length || !kinds.length) {
    return sendJson(res, 400, { ok: false, error: 'devices and kinds required' });
  }

  const workPath = path.join(WORK_DIR, `${slug}.mdx`);
  try {
    const source = await readFile(workPath, 'utf8');
    const next = upsertMotionFrontmatter(source, { slug, devices, kinds });
    await writeFile(workPath, next, 'utf8');
    return sendJson(res, 200, { ok: true, workPath, updated: true });
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === 'ENOENT') {
      return sendJson(res, 200, {
        ok: true,
        updated: false,
        message: `No work file at ${workPath}. Files were saved; add motionHero/motionCard manually.`,
      });
    }
    throw err;
  }
}

export function portfolioExportPlugin(): Plugin {
  return {
    name: 'portfolio-export-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (req.method !== 'POST') return next();

        try {
          if (url === '/api/portfolio-motion/file') {
            await handleFile(req, res);
            return;
          }
          if (url === '/api/portfolio-motion/link') {
            await handleLink(req, res);
            return;
          }
        } catch (err) {
          sendJson(res, 500, {
            ok: false,
            error: err instanceof Error ? err.message : 'Portfolio export failed',
          });
          return;
        }

        next();
      });
    },
  };
}
