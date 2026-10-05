import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { TAB_ROUTES, PATH_TO_TAB } from '../src/utils/routes';
import { ARTICLE_META } from '../src/utils/articles';

const port = 4178;
const server = spawn(process.execPath, ['scripts/serve.mjs'], { env: { ...process.env, PORT: String(port) }, stdio: ['ignore', 'pipe', 'pipe'] });
try {
  await new Promise<void>((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('Preview did not start')), 10000);
    server.once('error', error => { clearTimeout(timeout); reject(error); });
    server.stdout.on('data', chunk => { if (chunk.toString().includes('Preview ready')) { clearTimeout(timeout); resolve(); } });
    server.once('exit', code => { clearTimeout(timeout); reject(new Error(`Preview exited: ${code}`)); });
  });
  const paths = [...Object.values(TAB_ROUTES), ...ARTICLE_META.map(article => `/guia-clt/${article.slug}`)];
  for (const path of paths) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`);
    assert.equal(response.status, 200, path);
    const html = await response.text();
    assert.ok(!html.includes('<h1>Página Não Encontrada</h1>'), path);
    assert.equal((html.match(/<h1\b/g) ?? []).length, 1, path);
  }
  const aliases = Object.entries(PATH_TO_TAB).filter(([path, tab]) => path !== TAB_ROUTES[tab]);
  for (const [path, tab] of aliases) {
    const response = await fetch(`http://127.0.0.1:${port}${path}`, { redirect: 'manual' });
    assert.equal(response.status, 301, path);
    assert.equal(response.headers.get('location'), TAB_ROUTES[tab], path);
  }
  for (const path of ['/does-not-exist', '/calculadora-de-horas-trabalhadas', '/somar-horas', '/hora-extra']) {
    assert.equal((await fetch(`http://127.0.0.1:${port}${path}`)).status, 404, path);
  }
  const config = JSON.parse(await readFile('vercel.json', 'utf8'));
  assert.ok(!config.rewrites.some((rule: { source: string }) => rule.source === '/(.*)' || rule.source === '/*'), 'No soft-404 SPA fallback');
  console.log(`Verified HTTP 200 on ${paths.length} pages, ${aliases.length} preserved 301 aliases and 4 real 404 paths.`);
} finally {
  server.kill();
}
