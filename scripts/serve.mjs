import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root = path.resolve('dist');
const config = JSON.parse(await readFile('vercel.json', 'utf8'));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, 'http://localhost');
    const redirect = config.redirects?.find(rule => rule.source === url.pathname);
    if (redirect) { response.writeHead(301, { Location: redirect.destination + url.search }); response.end(); return; }
    let filename = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (filename !== root && !filename.startsWith(root + path.sep)) throw new Error('Invalid path');
    try { if ((await stat(filename)).isDirectory()) filename = path.join(filename, 'index.html'); }
    catch { filename = path.join(root, '404.html'); response.statusCode = 404; }
    if (path.basename(filename) === '404.html') response.statusCode = 404;
    const content = await readFile(filename);
    response.setHeader('Content-Type', types[path.extname(filename)] ?? 'application/octet-stream');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Cache-Control', filename.includes(path.sep + 'assets' + path.sep) ? 'public, max-age=31536000, immutable' : 'no-cache');
    const compress = /\bgzip\b/.test(request.headers['accept-encoding'] ?? '') && /\.(html|js|css|json|xml|txt)$/.test(filename);
    response.setHeader('Vary', 'Accept-Encoding');
    if (compress) response.setHeader('Content-Encoding', 'gzip');
    response.end(request.method === 'HEAD' ? undefined : compress ? gzipSync(content) : content);
  } catch { response.writeHead(404); response.end('Not found'); }
}).listen(Number(process.env.PORT ?? 4173), '127.0.0.1', () => console.log('Preview ready: http://127.0.0.1:' + (process.env.PORT ?? 4173)));
