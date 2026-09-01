const http = require('http');
const fs = require('fs');
const path = require('path');

http.createServer((request, response) => {
  const relative = request.url === '/' ? 'index.html' : request.url.split('?')[0].slice(1);
  const suppliedIcons = {
    'icon-calendar.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-ba5a8007-bc08-4771-8c9f-11f37aa33693.png',
    'icon-target.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-d0e8e600-67bd-4937-804c-70e7d2830c59.png',
    'icon-orb.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-6bc0e268-2f0c-476e-932e-10bfdeaaad8f.png',
    'icon-level.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-1ace015c-2d5d-4742-a122-b5f64810f902.png',
    'icon-fire.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-c66dbc3e-58a4-4820-a8f6-93d4f8e356ff.png',
    'icon-task.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-375ea991-b7d2-44a5-8d2f-27453a148bf2.png',
    'icon-clock.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-cb811fa1-ee42-4c14-8e5a-716495140160.png',
    'icon-book.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-bd5caf9a-0b26-43f3-b638-f19042bc1d89.png',
    'icon-progress.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-d9c08567-5dda-4ad8-b3d0-a2257f9ff1ed.png',
    'icon-book-ring.png': 'C:\\Users\\MINHHU~1\\AppData\\Local\\Temp\\codex-clipboard-b598154e-f9f4-4e5a-857f-ee59d06fb058.png'
  };
  if (suppliedIcons[relative]) {
    fs.readFile(suppliedIcons[relative], (error, data) => {
      if (error) { response.writeHead(404); response.end('Not found'); return; }
      response.writeHead(200, { 'Content-Type': 'image/png' });
      response.end(data);
    });
    return;
  }
  if (relative === 'reference-icons.png') {
    fs.readFile('C:\\Users\\Minh Huy\\Downloads\\ChatGPT Image 10_40_26 30 thg 8, 2026.png', (error, data) => {
      if (error) { response.writeHead(404); response.end('Not found'); return; }
      response.writeHead(200, { 'Content-Type': 'image/png' });
      response.end(data);
    });
    return;
  }
  const file = path.join(process.cwd(), relative);
  fs.readFile(file, (error, data) => {
    if (error) {
      response.writeHead(404);
      response.end('Not found');
      return;
    }
    const type = relative.endsWith('.css') ? 'text/css' : relative.endsWith('.js') ? 'application/javascript' : relative.endsWith('.png') ? 'image/png' : 'text/html';
    response.writeHead(200, { 'Content-Type': type });
    response.end(data);
  });
}).listen(4173, '127.0.0.1');
