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
    caches: { open: async () => ({ match: async () => undefined, put: async (request: Request) => puts.push(request.url) }) }
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

test('cache open, read and write failures never discard downloaded JavaScript', async () => {
  for (const failure of ['open', 'match', 'put']) {
    const handlers: Record<string, Function> = {};
    runInNewContext(readFileSync('public/sw.js', 'utf8'), {
      self: { location: { origin: 'https://test.local' }, addEventListener: (name: string, fn: Function) => handlers[name] = fn },
      URL, Response,
      fetch: async () => new Response('export const loaded = true;', { headers: { 'Content-Type': 'text/javascript' } }),
      caches: { open: async () => {
        if (failure === 'open') throw new Error('Storage denied');
        return {
          match: async () => { if (failure === 'match') throw new Error('Cache read failed'); },
          put: async () => { if (failure === 'put') throw new Error('Quota exceeded'); }
        };
      } }
    });
    let response: Promise<Response>;
    handlers.fetch({ request: new Request('https://test.local/assets/index.js'), respondWith: (value: Promise<Response>) => response = value });
    assert.equal((await response!).status, 200, failure);
    assert.equal(await (await response!).text(), 'export const loaded = true;', failure);
  }
});

test('offline requests use only the active build cache and retain navigation fallback', async () => {
  const handlers: Record<string, Function> = {};
  const requestedCaches: string[] = [];
  runInNewContext(readFileSync('public/sw.js', 'utf8'), {
    self: { location: { origin: 'https://test.local' }, addEventListener: (name: string, fn: Function) => handlers[name] = fn },
    URL, Response,
    fetch: async () => { throw new Error('Offline'); },
    caches: { open: async (name: string) => {
      requestedCaches.push(name);
      return { match: async (request: Request | string) => request === '/' ? new Response('Current build page') : undefined };
    }, match: () => { throw new Error('Cross-version cache lookup'); } }
  });
  let response: Promise<Response>;
  handlers.fetch({ request: { method: 'GET', url: 'https://test.local/?campaign=1', mode: 'navigate' }, respondWith: (value: Promise<Response>) => response = value });
  assert.equal(await (await response!).text(), 'Current build page');
  assert.deepEqual(requestedCaches, ['horas-clt-dev']);
});
