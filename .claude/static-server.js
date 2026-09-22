const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const port = 4173;

const types = { '.html': 'text/html', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.md': 'text/plain' };

http.createServer((req, res) => {
    const filePath = path.join(root, decodeURIComponent(req.url.split('?')[0]) === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]));
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('Not found'); return; }
        res.writeHead(200, { 'Content-Type': types[path.extname(filePath)] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(port, () => console.log(`Serving ${root} on http://localhost:${port}`));
