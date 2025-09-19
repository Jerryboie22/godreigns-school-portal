-- Create posts table for blog functionality
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  author_id UUID REFERENCES auth.users(id),
  category TEXT DEFAULT 'General',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Published posts are viewable by everyone" 
ON public.posts 
FOR SELECT 
USING (status = 'published');

CREATE POLICY "Admins can manage all posts" 
ON public.posts 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Create policies for gallery
CREATE POLICY "Gallery images are viewable by everyone" 
ON public.gallery_images 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage gallery images" 
ON public.gallery_images 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

-- Create site_analytics table for accurate statistics
CREATE TABLE public.site_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_id UUID,
  session_id TEXT,
  visit_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address TEXT
);

-- Enable RLS
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics
CREATE POLICY "Admins can view all analytics" 
ON public.site_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
));

CREATE POLICY "Anyone can insert analytics data" 
ON public.site_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create trigger for posts updated_at
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample posts data
INSERT INTO public.posts (title, content, excerpt, image, status, category, featured) VALUES
('NECO Excellence Awards 2025', 'Miss Adeyemo Emmanuella Adedamola receives national recognition for academic excellence...', 'Outstanding achievement in NECO examinations showcases school excellence...', '/assets/neco-excellence-awards.jpg', 'published', 'Awards', true),
('Million Naira Achievement Fund', 'School launches achievement fund to support exceptional students...', 'New fund supports academic excellence and student achievements...', '/assets/million-naira-cheque.jpg', 'published', 'News', false),
('Cultural Heritage Celebration', 'Students showcase Nigerian culture through dance and art...', 'Annual celebration highlights rich cultural diversity...', '/assets/cultural-dance.jpg', 'published', 'Campus Life', false);