import puppeteer from 'puppeteer';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ── Load .env.local (same pattern as generate-sitemap.js) ── */
const envLocalPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, '');
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  });
}

const PORT = 54321;
const DIST_DIR = path.resolve(__dirname, 'dist');

const STATIC_ROUTES = [
  '/',
  '/services',
  '/services/foundation',
  '/services/demand',
  '/services/retention',
  '/services/audit',
  '/packages',
  '/packages/personalized',
  '/blog',
  '/contact',
  '/chat',
  '/privacy',
  '/terms',
  '/data-deletion',
];

async function fetchBlogSlugs() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.warn('[Prerender] Missing Supabase credentials — skipping blog post prerendering.');
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select('slug')
    .eq('status', 'published');

  if (error) {
    console.warn('[Prerender] Failed to fetch blog posts:', error.message);
    return [];
  }

  return posts.map((post) => `/blog/${post.slug}`);
}

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

  const blogRoutes = await fetchBlogSlugs();
  const allRoutes = [...STATIC_ROUTES, ...blogRoutes];

  console.log(`[Prerender] ${allRoutes.length} routes to prerender (${STATIC_ROUTES.length} static + ${blogRoutes.length} blog).`);

  const server = await serveDist();
  const browser = await puppeteer.launch({ headless: 'new' });

  for (const route of allRoutes) {
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
