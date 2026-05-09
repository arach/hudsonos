import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const nextAppDir = join(root, '.next', 'server', 'app');
const hudsonDocsDir = join(root, 'hudson-docs', 'dist');
const outDir = join(root, 'site', 'out');

// Routes that exist in the hudsonos Next.js app
const staticRoutes = [
  'index',
  '_not-found',
  'demo',
  'embed/workspace',
  'releases',
];

async function copyIfExists(from, to) {
  if (!existsSync(from)) return false;
  await mkdir(dirname(to), { recursive: true });
  await cp(from, to, {
    recursive: true,
    filter: (source) => !source.split('/').some((part) => part === '.DS_Store'),
  });
  return true;
}

async function copyRoute(route) {
  // Handle nested routes like embed/workspace
  const source = join(nextAppDir, `${route}.html`);
  if (!existsSync(source)) {
    console.warn(`  [skip] ${route}.html not found in .next/server/app/`);
    return;
  }

  const isIndex = route === 'index';
  const target = isIndex
    ? join(outDir, 'index.html')
    : join(outDir, route, 'index.html');

  await copyIfExists(source, target);
  console.log(`  [copy] ${route} → ${target.replace(root + '/', '')}`);
}

async function mergeDocs() {
  if (!existsSync(hudsonDocsDir)) {
    console.warn(`  [skip] hudson-docs/dist not found — skipping docs merge`);
    return;
  }

  const docsOut = join(outDir, 'docs');
  await mkdir(docsOut, { recursive: true });
  await cp(hudsonDocsDir, docsOut, {
    recursive: true,
    filter: (source) => !source.split('/').some((part) => part === '.DS_Store'),
  });
  console.log(`  [merge] hudson-docs/dist → site/out/docs/`);
}

async function run() {
  console.log('Cleaning site/out/ ...');
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  console.log('Copying static routes ...');
  for (const route of staticRoutes) {
    await copyRoute(route);
  }

  console.log('Copying _next/static ...');
  await copyIfExists(join(root, '.next', 'static'), join(outDir, '_next', 'static'));

  console.log('Copying public/ ...');
  await copyIfExists(join(root, 'public'), outDir);

  console.log('Merging hudson-docs ...');
  await mergeDocs();

  console.log(`\nDone. Static export at: site/out/`);
}

await run();
