/** Push exported motion blobs into ericpowell.design via the Vite dev API. */

export type PortfolioFile = { filename: string; blob: Blob };

export type PublishResult = {
  wrote: string[];
  workUpdated: boolean;
  message?: string;
};

async function postFile(file: PortfolioFile) {
  const res = await fetch('/api/portfolio-motion/file', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      'x-filename': file.filename,
    },
    body: file.blob,
  });
  const json = (await res.json()) as { ok: boolean; error?: string; path?: string };
  if (!res.ok || !json.ok) {
    throw new Error(json.error || `Failed to write ${file.filename}`);
  }
  return file.filename;
}

export async function publishToPortfolio(options: {
  slug: string;
  devices: string[];
  kinds: Array<'hero' | 'card'>;
  files: PortfolioFile[];
}): Promise<PublishResult> {
  const wrote: string[] = [];
  for (const file of options.files) {
    wrote.push(await postFile(file));
  }

  const res = await fetch('/api/portfolio-motion/link', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      slug: options.slug,
      devices: options.devices,
      kinds: options.kinds,
    }),
  });
  const json = (await res.json()) as {
    ok: boolean;
    updated?: boolean;
    message?: string;
    error?: string;
  };
  if (!res.ok || !json.ok) {
    throw new Error(json.error || 'Failed to update work frontmatter');
  }

  return {
    wrote,
    workUpdated: Boolean(json.updated),
    message: json.message,
  };
}
