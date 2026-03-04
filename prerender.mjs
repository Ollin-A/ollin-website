import puppeteer from 'puppeteer';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 54321;
const DIST_DIR = path.resolve(__dirname, 'dist');
const ROUTES = ['/', '/services', '/packages', '/blog', '/contact'];

async function serveDist() {
  const app = express();
  app.use(express.static(DIST_DIR));
  app.use((req, res) => {
    res.sendFile(path.resolve(DIST_DIR, 'index.html'));
  });

  return new Promise((resolve) => {
    const server = app.listen(PORT, () => {
      console.log(`[Prerender] Server running on http://localhost:${PORT}`);
      resolve(server);
    });
  });
}

async function prerender() {
  console.log('[Prerender] Starting prerendering process...');
  const server = await serveDist();
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const route of ROUTES) {
    console.log(`[Prerender] Processing ${route}...`);
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (['image', 'media', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    const url = `http://localhost:${PORT}${route}`;
    await page.goto(url, { waitUntil: 'networkidle0' });

    const html = await page.content();
    
    const filePath = route === '/' 
      ? path.resolve(DIST_DIR, 'index.html') 
      : path.resolve(DIST_DIR, route.substring(1), 'index.html');
      
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, html);
    console.log(`[Prerender] Saved ${route} to ${filePath}`);
    
    await page.close();
  }

  await browser.close();
  server.close();
  console.log('[Prerender] Prerendering complete!');
}

prerender().catch(console.error);
