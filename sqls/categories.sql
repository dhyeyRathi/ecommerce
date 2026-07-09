-- Supabase SQL schema and values for Categories

-- 1. Create categories table
CREATE TABLE IF NOT EXISTS categories (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 3. Create Security Policies
DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
CREATE POLICY "Allow public read access to categories" ON categories
    FOR SELECT USING (true);

-- 4. Insert Categories data
INSERT INTO categories (slug, name, url) VALUES ('beauty', 'Beauty', 'https://dummyjson.com/products/category/beauty')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('fragrances', 'Fragrances', 'https://dummyjson.com/products/category/fragrances')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('furniture', 'Furniture', 'https://dummyjson.com/products/category/furniture')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('groceries', 'Groceries', 'https://dummyjson.com/products/category/groceries')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('home-decoration', 'Home Decoration', 'https://dummyjson.com/products/category/home-decoration')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('kitchen-accessories', 'Kitchen Accessories', 'https://dummyjson.com/products/category/kitchen-accessories')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('laptops', 'Laptops', 'https://dummyjson.com/products/category/laptops')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('mens-shirts', 'Mens Shirts', 'https://dummyjson.com/products/category/mens-shirts')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('mens-shoes', 'Mens Shoes', 'https://dummyjson.com/products/category/mens-shoes')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('mens-watches', 'Mens Watches', 'https://dummyjson.com/products/category/mens-watches')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('mobile-accessories', 'Mobile Accessories', 'https://dummyjson.com/products/category/mobile-accessories')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('motorcycle', 'Motorcycle', 'https://dummyjson.com/products/category/motorcycle')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('skin-care', 'Skin Care', 'https://dummyjson.com/products/category/skin-care')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('smartphones', 'Smartphones', 'https://dummyjson.com/products/category/smartphones')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('sports-accessories', 'Sports Accessories', 'https://dummyjson.com/products/category/sports-accessories')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('sunglasses', 'Sunglasses', 'https://dummyjson.com/products/category/sunglasses')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('tablets', 'Tablets', 'https://dummyjson.com/products/category/tablets')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('tops', 'Tops', 'https://dummyjson.com/products/category/tops')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('vehicle', 'Vehicle', 'https://dummyjson.com/products/category/vehicle')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('womens-bags', 'Womens Bags', 'https://dummyjson.com/products/category/womens-bags')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('womens-dresses', 'Womens Dresses', 'https://dummyjson.com/products/category/womens-dresses')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('womens-jewellery', 'Womens Jewellery', 'https://dummyjson.com/products/category/womens-jewellery')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('womens-shoes', 'Womens Shoes', 'https://dummyjson.com/products/category/womens-shoes')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

INSERT INTO categories (slug, name, url) VALUES ('womens-watches', 'Womens Watches', 'https://dummyjson.com/products/category/womens-watches')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    url = EXCLUDED.url,
    updated_at = timezone('utc'::text, now());

