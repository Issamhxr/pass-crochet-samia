-- ============================================
-- Pass-Crochet Samia — Supabase Setup Script
-- Run this once in: Supabase > SQL Editor
-- ============================================

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image TEXT NOT NULL DEFAULT '/images/product-1.jpg',
  stock INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  description TEXT DEFAULT '',
  materials TEXT DEFAULT '',
  dimensions TEXT DEFAULT '',
  care_instructions TEXT DEFAULT '',
  related_products TEXT[] DEFAULT '{}',
  variants JSONB DEFAULT '[]',
  rating DECIMAL(3,1) DEFAULT 5.0,
  reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (key-value store)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS (protected by our own admin session at Next.js level)
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE settings DISABLE ROW LEVEL SECURITY;

-- ---- Seed categories ----
INSERT INTO categories (name, position) VALUES
  ('Amigurumis', 1),
  ('Sacs en Granny', 2),
  ('Accessoires', 3),
  ('Petites créations', 4),
  ('Accessoires enfants', 5)
ON CONFLICT (name) DO NOTHING;

-- ---- Seed products ----
INSERT INTO products (id, name, category, price, image, stock, in_stock, description, materials, dimensions, care_instructions, related_products, variants, rating, reviews) VALUES
('1', 'Amigurumi Ours', 'Amigurumis', 35, '/images/product-1.jpg', 15, true,
 'Un adorable petit ours en crochet fait main avec amour. Parfait comme cadeau ou pour votre collection personnelle.',
 'Fil acrylique 100% (doux et hypoallergénique)', 'Hauteur: 15cm', 'Lavage à la main avec eau tiède et savon doux',
 ARRAY['5','4'],
 '[{"type":"color","label":"Couleur","options":[{"name":"Beige clair","value":"beige"},{"name":"Marron clair","value":"brown"},{"name":"Gris","value":"gray"},{"name":"Blanc cassé","value":"cream"}]}]'::jsonb,
 4.8, 24),

('2', 'Sac à Main Granny', 'Sacs en Granny', 55, '/images/product-2.jpg', 8, true,
 'Sac élégant en carré granny aux couleurs douces. Un accessoire intemporel qui complète parfaitement votre style.',
 'Fil coton biologique et acrylique mélangé', 'Largeur: 35cm, Hauteur: 30cm, Profondeur: 15cm',
 'Lavage à la main recommandé. Laisser sécher à plat.', ARRAY['3','6'],
 '[{"type":"color","label":"Couleur","options":[{"name":"Rose et crème","value":"pink-cream"},{"name":"Beige et rose","value":"beige-pink"},{"name":"Multicolore","value":"multicolor"}]},{"type":"size","label":"Taille","options":[{"name":"Petit","value":"small"},{"name":"Moyen","value":"medium","priceModifier":10},{"name":"Grand","value":"large","priceModifier":20}]}]'::jsonb,
 4.9, 31),

('3', 'Pochette Rose', 'Accessoires', 28, '/images/product-3.jpg', 20, true,
 'Petite pochette rose pâle parfaite pour ranger vos essentiels. Délicate et pratique.',
 'Fil acrylique doux', 'Largeur: 20cm, Hauteur: 15cm', 'Lavage à la main avec eau tiède',
 ARRAY['1','4'],
 '[{"type":"color","label":"Couleur","options":[{"name":"Rose pâle","value":"pink"},{"name":"Blanc cassé","value":"cream"},{"name":"Bleu poudré","value":"blue"},{"name":"Lavande","value":"lavender"}]}]'::jsonb,
 4.7, 18),

('4', 'Porte-clés Coloré', 'Petites créations', 15, '/images/product-4.jpg', 30, true,
 'Petit porte-clés amigurumi coloré pour personnaliser votre quotidien.',
 'Fil acrylique', 'Hauteur: 8cm', 'Nettoyage avec un chiffon sec',
 ARRAY['1','5'],
 '[{"type":"color","label":"Personnage","options":[{"name":"Ours","value":"bear"},{"name":"Chat","value":"cat"},{"name":"Lapin","value":"rabbit"},{"name":"Coeur","value":"heart"}]}]'::jsonb,
 4.6, 12),

('5', 'Amigurumi Chat', 'Amigurumis', 40, '/images/product-5.jpg', 12, true,
 'Un mignon petit chat en crochet avec des détails adorables.',
 'Fil acrylique premium', 'Hauteur: 17cm', 'Lavage délicat à la main',
 ARRAY['1','6'],
 '[{"type":"color","label":"Couleur du chat","options":[{"name":"Gris","value":"gray"},{"name":"Orange","value":"orange"},{"name":"Blanc","value":"white"},{"name":"Noir","value":"black"}]}]'::jsonb,
 4.9, 29),

('6', 'Sac d''Enfant', 'Accessoires enfants', 32, '/images/product-6.jpg', 10, true,
 'Petit sac parfait pour les enfants, fait avec des couleurs joyeuses.',
 'Fil acrylique', 'Largeur: 25cm, Hauteur: 20cm', 'Lavage à la main',
 ARRAY['2','3'],
 '[{"type":"color","label":"Couleur","options":[{"name":"Arc-en-ciel","value":"rainbow"},{"name":"Rose et violet","value":"pink-purple"},{"name":"Bleu et vert","value":"blue-green"}]}]'::jsonb,
 4.8, 22)

ON CONFLICT (id) DO NOTHING;

-- ---- Storage bucket ----
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images', 'images', true,
  5242880,
  ARRAY['image/jpeg','image/jpg','image/png','image/webp','image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies (allow public read + anon upload)
DO $$
BEGIN
  DROP POLICY IF EXISTS "Public read images" ON storage.objects;
  DROP POLICY IF EXISTS "Anon upload images" ON storage.objects;
  DROP POLICY IF EXISTS "Anon update images" ON storage.objects;
  DROP POLICY IF EXISTS "Anon delete images" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public read images"  ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Anon upload images"  ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'images');
CREATE POLICY "Anon update images"  ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'images');
CREATE POLICY "Anon delete images"  ON storage.objects FOR DELETE TO anon USING (bucket_id = 'images');
