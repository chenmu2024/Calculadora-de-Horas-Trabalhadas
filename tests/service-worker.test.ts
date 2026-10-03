import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
test('successful uncached assets are cached, failed assets are not', async () => {
  const handlers: Record<string, Function> = {};
  const puts: string[] = [];
  let ok = true;
  runInNewContext(readFileSync('public/sw.js', 'utf8'), {
    self: { location: { origin: 'https://test.local' }, addEventListener: (name: string, fn: Function) => handlers[name] = fn },
    URL, Response,
    fetch: async () => new Response('asset', { status: ok ? 200 : 404 }),
    caches: { match: async () => undefined, open: async () => ({ put: async (request: Request) => puts.push(request.url) }) }
  });
  let response: Promise<Response>;
  handlers.fetch({ request: new Request('https://test.local/assets/new.js'), respondWith: (value: Promise<Response>) => response = value });
  assert.equal((await response!).status, 200);
  assert.equal(puts.length, 1);
  ok = false;
  handlers.fetch({ request: new Request('https://test.local/assets/missing.js'), respondWith: (value: Promise<Response>) => response = value });
  assert.equal((await response!).status, 404);
  assert.equal(puts.length, 1);
});
