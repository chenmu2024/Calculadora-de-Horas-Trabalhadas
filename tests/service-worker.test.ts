import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

const source = readFileSync('public/sw.js', 'utf8');

function setup(cacheFailure: 'none' | 'open' | 'match' | 'put', fetchStatus = 200, offline = false) {
  const handlers: Record<string, Function> = {};
  const puts: string[] = [];
  const names: string[] = [];
  runInNewContext(source, {
    self: { location: { origin: 'https://test.local' }, addEventListener: (name: string, handler: Function) => { handlers[name] = handler; } },
    URL, Response, Promise,
    fetch: async () => {
      if (offline) throw new Error('Offline');
      return new Response('export const loaded = true;', { status: fetchStatus });
    },
    caches: { open: async (name: string) => {
      names.push(name);
      if (cacheFailure === 'open') throw new Error('Storage denied');
      return {
        match: async (request: Request | string) => {
          if (cacheFailure === 'match') throw new Error('Cache read failed');
          if (offline && request === '/') return new Response('Cached homepage');
          return undefined;
        },
        put: async (request: Request) => {
          if (cacheFailure === 'put') throw new Error('Quota exceeded');
          puts.push(request.url);
        }
      };
    } }
  });
  return { handlers, puts, names };
}

async function request(handlers: Record<string, Function>, url: string, mode: string = 'same-origin') {
  let response: Promise<Response> | undefined;
  handlers.fetch({ request: { method: 'GET', url, mode }, respondWith: (value: Promise<Response>) => { response = value; } });
  assert.ok(response);
  return response!;
}

test('successful resources are cached and HTTP failures are never cached', async () => {
  const good = setup('none');
  assert.equal((await request(good.handlers, 'https://test.local/assets/app.js')).status, 200);
  assert.equal(good.puts.length, 1);
  const missing = setup('none', 404);
  assert.equal((await request(missing.handlers, 'https://test.local/assets/missing.js')).status, 404);
  assert.equal(missing.puts.length, 0);
});

test('cache open, read and write failures do not discard network modules', async () => {
  for (const failure of ['open', 'match', 'put'] as const) {
    const worker = setup(failure);
    assert.equal((await request(worker.handlers, 'https://test.local/assets/app.js')).status, 200, failure);
  }
});

test('offline navigation reads only the active build cache and matches the URL without query parameters', async () => {
  const worker = setup('none', 200, true);
  const result = await request(worker.handlers, 'https://test.local/?utm_source=example', 'navigate');
  assert.equal(await result.text(), 'Cached homepage');
  assert.deepEqual(worker.names, ['horas-clt-dev']);
});

test('uncached offline modules produce a predictable 503 response', async () => {
  const worker = setup('none', 200, true);
  assert.equal((await request(worker.handlers, 'https://test.local/assets/missing.js')).status, 503);
});
