-- Create storage bucket for homepage images
INSERT INTO storage.buckets (id, name, public) VALUES ('homepage-images', 'homepage-images', true);

-- Create policies for homepage images storage
CREATE POLICY "Homepage images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'homepage-images');

CREATE POLICY "Authenticated users can upload homepage images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'homepage-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update homepage images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'homepage-images' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete homepage images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'homepage-images' AND auth.role() = 'authenticated');

-- Create homepage images table
CREATE TABLE public.homepage_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL, -- 'hero', 'about', 'gallery', 'leadership', etc.
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  alt_text TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_images ENABLE ROW LEVEL SECURITY;

-- Create policies for homepage images
CREATE POLICY "Homepage images are viewable by everyone" 
ON public.homepage_images 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage homepage images" 
ON public.homepage_images 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_homepage_images_updated_at
BEFORE UPDATE ON public.homepage_images
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default homepage images
INSERT INTO public.homepage_images (section, title, description, image_url, alt_text, order_index) VALUES
('hero', 'Students in Green Uniforms', 'Students participating in school activities', '/src/assets/students-green-uniforms.jpg', 'Our God Reigns Crystal School students in green uniforms', 1),
('hero', 'School Flyer', 'Official school admission flyer', '/src/assets/school-flyer.jpg', 'Our God Reigns Crystal School admission flyer', 2),
('about', 'Graduate Individual', 'Celebrating our graduates', '/src/assets/graduate-individual.jpg', 'Our God Reigns Crystal School graduate', 1),
('gallery', 'Gallery Image 1', 'School activities', '/src/assets/gallery1.jpg', 'School activities and events', 1),
('gallery', 'Gallery Image 2', 'School activities', '/src/assets/gallery2.jpg', 'School activities and events', 2),
('gallery', 'Gallery Image 3', 'School activities', '/src/assets/gallery3.jpg', 'School activities and events', 3),
('leadership', 'Proprietress', 'Pastor (Mrs) Kehinde Adetuberu', '/src/assets/proprietress.jpg', 'Pastor (Mrs) Kehinde Adetuberu - Proprietress', 1),
('leadership', 'Chairman', 'School Chairman', '/src/assets/chairman.jpg', 'School Chairman', 2),
('leadership', 'Principal', 'School Principal', '/src/assets/principal.jpg', 'School Principal', 3),
('leadership', 'Vice Principal', 'School Vice Principal', '/src/assets/vice-principal.jpg', 'School Vice Principal', 4);

-- Enable realtime for homepage images
ALTER TABLE public.homepage_images REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.homepage_images;