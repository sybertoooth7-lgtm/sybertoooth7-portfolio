import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';

const root = resolve(new URL('web', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

function send(res, status, text) {
  res.writeHead(status, { 'Content-Type': 'text/plain' }).end(text);
}

createServer(async (req, res) => {
  try {
    let rel;
    try {
      rel = normalize(decodeURIComponent(req.url.split('?')[0]));
    } catch {
      send(res, 400, 'bad request');
      return;
    }
    const target = join(root, rel === '/' || rel === '\\' ? 'index.html' : rel.slice(1));
    if (target !== root && !target.startsWith(root + sep)) { send(res, 403, 'forbidden'); return; }
    const file = (await stat(target).catch(() => null))?.isDirectory()
      ? join(target, 'index.html') : target;
    const body = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    if (!res.headersSent) send(res, 404, 'not found');
    else res.end();
  }
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} at http://127.0.0.1:${port}/`));
