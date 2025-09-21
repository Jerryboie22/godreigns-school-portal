-- Fix RLS policies (PostgreSQL doesn't support IF NOT EXISTS for policies)
-- Drop and recreate policies to ensure they exist

-- Homepage content policies
DROP POLICY IF EXISTS "Admin can manage homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Homepage content is viewable by everyone" ON public.homepage_content;

CREATE POLICY "Admin can manage homepage content" ON public.homepage_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Homepage content is viewable by everyone" ON public.homepage_content
  FOR SELECT USING (is_visible = true);

-- Create storage buckets for file management
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
  ('cms-media', 'cms-media', true, 52428800, ARRAY['image/*', 'video/*', 'application/pdf']::text[]),
  ('blog-images', 'blog-images', true, 10485760, ARRAY['image/*']::text[]),
  ('gallery', 'gallery', true, 10485760, ARRAY['image/*']::text[])
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for CMS media management
DROP POLICY IF EXISTS "CMS media is publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload CMS media" ON storage.objects; 
DROP POLICY IF EXISTS "Admin can update CMS media" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete CMS media" ON storage.objects;
DROP POLICY IF EXISTS "Blog images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage blog images" ON storage.objects;
DROP POLICY IF EXISTS "Gallery images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Admin can manage gallery images" ON storage.objects;

CREATE POLICY "CMS media is publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'cms-media');

CREATE POLICY "Admin can upload CMS media" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'cms-media' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin can update CMS media" 
  ON storage.objects 
  FOR UPDATE 
  USING (
    bucket_id = 'cms-media' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin can delete CMS media" 
  ON storage.objects 
  FOR DELETE 
  USING (
    bucket_id = 'cms-media' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Policies for blog-images and gallery buckets
CREATE POLICY "Blog images are publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'blog-images');

CREATE POLICY "Admin can manage blog images" 
  ON storage.objects 
  FOR ALL 
  USING (
    bucket_id = 'blog-images' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Gallery images are publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'gallery');

CREATE POLICY "Admin can manage gallery images" 
  ON storage.objects 
  FOR ALL 
  USING (
    bucket_id = 'gallery' 
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );