-- Fix RLS policy for homepage_content table
-- (The table might already exist and need additional policies)

-- First, check if homepage_content policies exist and add missing ones
CREATE POLICY IF NOT EXISTS "Admin can manage homepage content" ON public.homepage_content
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY IF NOT EXISTS "Homepage content is viewable by everyone" ON public.homepage_content
  FOR SELECT USING (is_visible = true);

-- Create storage buckets for file management
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('cms-media', 'cms-media', true),
  ('blog-images', 'blog-images', true),
  ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for CMS media management
CREATE POLICY IF NOT EXISTS "CMS media is publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'cms-media');

CREATE POLICY IF NOT EXISTS "Admin can upload CMS media" 
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

CREATE POLICY IF NOT EXISTS "Admin can update CMS media" 
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

CREATE POLICY IF NOT EXISTS "Admin can delete CMS media" 
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

-- Similar policies for blog-images and gallery buckets
CREATE POLICY IF NOT EXISTS "Blog images are publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'blog-images');

CREATE POLICY IF NOT EXISTS "Admin can manage blog images" 
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

CREATE POLICY IF NOT EXISTS "Gallery images are publicly accessible" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'gallery');

CREATE POLICY IF NOT EXISTS "Admin can manage gallery images" 
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