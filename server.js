const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 8081;

function normalizeBaseUrl(value) {
  if (!value) return '';
  let baseUrl = String(value).trim();
  if (!baseUrl) return '';
  if (!baseUrl.startsWith('/')) baseUrl = `/${baseUrl}`;
  baseUrl = baseUrl.replace(/\/+$/, '');
  return baseUrl;
}

function readBaseUrlFromAppJson() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, 'app.json'), 'utf8');
    const parsed = JSON.parse(raw);
    return normalizeBaseUrl(parsed?.expo?.experiments?.baseUrl);
  } catch {
    return '';
  }
}

const BASE_URL = normalizeBaseUrl(process.env.BASE_URL) || readBaseUrlFromAppJson();
const DIST_DIR = path.join(__dirname, 'dist');
const STATIC_MOUNT = BASE_URL || '/';

app.use(STATIC_MOUNT, express.static(DIST_DIR));

app.get(BASE_URL ? `${BASE_URL}/*splat` : '/*splat', (req, res) => {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT, () => {
  const url = `http://localhost:${PORT}${BASE_URL || ''}/`;
  console.log(`Server running on ${url}`);
});
