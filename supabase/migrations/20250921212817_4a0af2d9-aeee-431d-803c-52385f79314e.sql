-- Create site_settings table for global site configuration
CREATE TABLE public.site_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key text NOT NULL UNIQUE,
  value text,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create navigation_menu table for dynamic menu management
CREATE TABLE public.navigation_menu (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label text NOT NULL,
  url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  parent_id uuid REFERENCES public.navigation_menu(id) ON DELETE CASCADE,
  is_active boolean NOT NULL DEFAULT true,
  target text DEFAULT '_self',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create pages table for dynamic page content
CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  content text NOT NULL,
  excerpt text,
  featured_image text,
  meta_title text,
  meta_description text,
  meta_keywords text,
  is_published boolean NOT NULL DEFAULT true,
  template text DEFAULT 'default',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create page_sections table for modular page content
CREATE TABLE public.page_sections (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid REFERENCES public.pages(id) ON DELETE CASCADE,
  section_type text NOT NULL, -- hero, content, gallery, testimonials, etc.
  title text,
  content text,
  image_url text,
  link_url text,
  link_text text,
  order_index integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  settings jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create media_library table for centralized file management
CREATE TABLE public.media_library (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename text NOT NULL,
  original_filename text NOT NULL,
  file_url text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  alt_text text,
  caption text,
  description text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create homepage_content table if it doesn't exist (it might already exist)
CREATE TABLE IF NOT EXISTS public.homepage_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_type text NOT NULL,
  title text,
  content text,
  image_url text,
  link_url text,
  link_text text,
  order_index integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  settings jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admin access
CREATE POLICY "Admin can manage site settings" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin can manage navigation" ON public.navigation_menu
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin can manage pages" ON public.pages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin can manage page sections" ON public.page_sections
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

CREATE POLICY "Admin can manage media library" ON public.media_library
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('super_admin', 'admin')
    )
  );

-- Public read access for published content
CREATE POLICY "Published pages are viewable by everyone" ON public.pages
  FOR SELECT USING (is_published = true);

CREATE POLICY "Active navigation is viewable by everyone" ON public.navigation_menu
  FOR SELECT USING (is_active = true);

CREATE POLICY "Site settings are viewable by everyone" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Published page sections are viewable by everyone" ON public.page_sections
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Media library is viewable by everyone" ON public.media_library
  FOR SELECT USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_navigation_menu_updated_at
  BEFORE UPDATE ON public.navigation_menu
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_media_library_updated_at
  BEFORE UPDATE ON public.media_library
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (key, value, description) VALUES
  ('site_name', 'Okwuonye Grace Royal Comprehensive School', 'The name of the school/site'),
  ('site_tagline', 'Excellence in Education', 'Site tagline or motto'),
  ('contact_email', 'info@okwuonyegrcs.edu.ng', 'Primary contact email'),
  ('contact_phone', '+234 (0) 123 456 7890', 'Primary contact phone'),
  ('contact_address', 'Umuahia, Abia State, Nigeria', 'School address'),
  ('facebook_url', 'https://www.facebook.com/profile.php?id=100064995772701', 'Facebook page URL'),
  ('twitter_url', '', 'Twitter/X profile URL'),
  ('instagram_url', '', 'Instagram profile URL'),
  ('youtube_url', '', 'YouTube channel URL'),
  ('logo_url', '/src/assets/logo.jpeg', 'School logo URL'),
  ('favicon_url', '/favicon.ico', 'Site favicon URL');

-- Insert default navigation menu
INSERT INTO public.navigation_menu (label, url, order_index, is_active) VALUES
  ('Home', '/', 1, true),
  ('About', '/about', 2, true),
  ('Admissions', '/admissions', 3, true),
  ('Gallery', '/gallery', 4, true),
  ('Blog', '/blog', 5, true),
  ('Contact', '/contact', 6, true),
  ('Portals', '/portals', 7, true);

-- Insert default pages
INSERT INTO public.pages (title, slug, content, meta_title, meta_description, is_published) VALUES
  ('About Us', 'about', 'Welcome to Okwuonye Grace Royal Comprehensive School...', 'About Okwuonye Grace Royal Comprehensive School', 'Learn about our school''s mission, vision, and educational excellence in Umuahia, Abia State.', true),
  ('Admissions', 'admissions', 'Join our community of excellence...', 'School Admissions - Okwuonye Grace Royal Comprehensive School', 'Apply for admission to Okwuonye Grace Royal Comprehensive School. Learn about our admission process and requirements.', true),
  ('Contact Us', 'contact', 'Get in touch with us...', 'Contact Okwuonye Grace Royal Comprehensive School', 'Contact information for Okwuonye Grace Royal Comprehensive School in Umuahia, Abia State.', true);