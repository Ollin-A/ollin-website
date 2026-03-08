import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

const envLocalPath = path.resolve('.env.local');
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

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DOMAIN = 'https://ollin.agency';

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
  '/privacy'
];

async function generateSitemap() {
  try {
    console.log('🔄 Fetching published blog posts from Supabase...');
    const { data: posts, error } = await supabase
      .from('blog_posts')
      .select('slug')
      .eq('status', 'published');

    if (error) {
      throw error;
    }

    const dynamicRoutes = posts.map((post) => `/blog/${post.slug}`);
    
    const allRoutes = [...STATIC_ROUTES, ...dynamicRoutes];

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${DOMAIN}${route}</loc>
    <changefreq>${route === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

    const publicDir = path.resolve('public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
    
    console.log(`✅ Sitemap successfully generated at public/sitemap.xml with ${allRoutes.length} URLs.`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

generateSitemap();
