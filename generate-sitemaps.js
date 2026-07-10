const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// 1. Read environment variables (from process.env or .env.local fallback)
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  const envPath = path.join(__dirname, '.env.local');
  try {
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
      const keyMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
      if (urlMatch) supabaseUrl = urlMatch[1].trim();
      if (keyMatch) supabaseAnonKey = keyMatch[1].trim();
    }
  } catch (err) {
    console.error("Error reading .env.local:", err);
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase configuration. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BASE_URL = 'https://ezmart.in';

async function generate() {
  try {
    console.log("Fetching categories and products from database...");
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('products').select('*')
    ]);

    if (catRes.error) throw catRes.error;
    if (prodRes.error) throw prodRes.error;

    const categories = catRes.data || [];
    const products = prodRes.data || [];

    const publicDir = path.join(__dirname, 'public');

    // Make sure directories exist
    const productsDir = path.join(publicDir, 'products');
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }

    // 1. Generate main sitemap.xml
    const mainUrls = [
      '/',
      '/about',
      '/cart',
      '/login',
      '/sign-up',
      '/wishlist',
      '/myorders',
      '/profile',
      '/settings',
      '/products'
    ];

    let mainXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    mainXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    mainUrls.forEach(url => {
      mainXml += `  <url>\n    <loc>${BASE_URL}${url}</loc>\n  </url>\n`;
    });
    mainXml += `  <url>\n    <loc>${BASE_URL}/products/sitemap.xml</loc>\n  </url>\n`;
    mainXml += `</urlset>`;

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainXml);
    console.log("Generated public/sitemap.xml");

    // 2. Generate products/sitemap.xml (Categories list)
    let categoriesXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    categoriesXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    categories.forEach(cat => {
      categoriesXml += `  <url>\n    <loc>${BASE_URL}/products/${cat.slug}</loc>\n  </url>\n`;
      categoriesXml += `  <url>\n    <loc>${BASE_URL}/products/${cat.slug}/sitemap.xml</loc>\n  </url>\n`;
    });
    categoriesXml += `</urlset>`;

    fs.writeFileSync(path.join(productsDir, 'sitemap.xml'), categoriesXml);
    console.log("Generated public/products/sitemap.xml");

    // 3. Generate products/[category]/sitemap.xml (Products list per category)
    for (const cat of categories) {
      const catProducts = products.filter(p => p.category === cat.slug);
      const catDir = path.join(productsDir, cat.slug);
      if (!fs.existsSync(catDir)) {
        fs.mkdirSync(catDir, { recursive: true });
      }

      let catXml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      catXml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
      catProducts.forEach(prod => {
        catXml += `  <url>\n    <loc>${BASE_URL}/products/${cat.slug}/${prod.slug}</loc>\n  </url>\n`;
      });
      catXml += `</urlset>`;

      fs.writeFileSync(path.join(catDir, 'sitemap.xml'), catXml);
      console.log(`Generated public/products/${cat.slug}/sitemap.xml`);
    }

    console.log("All sitemaps successfully generated!");
  } catch (err) {
    console.error("Failed to generate sitemaps:", err);
    process.exit(1);
  }
}

generate();
