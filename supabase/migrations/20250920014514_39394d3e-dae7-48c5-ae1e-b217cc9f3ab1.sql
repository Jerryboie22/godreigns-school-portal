-- Create a table for homepage content editing
CREATE TABLE public.homepage_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key text NOT NULL UNIQUE,
  title text,
  content text,
  image_url text,
  link_url text,
  link_text text,
  order_index integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.homepage_content ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view homepage content" 
ON public.homepage_content 
FOR SELECT 
USING (is_visible = true);

CREATE POLICY "Admins can manage homepage content" 
ON public.homepage_content 
FOR ALL 
USING (EXISTS ( 
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = 'admin'
));

-- Insert default homepage sections
INSERT INTO public.homepage_content (section_key, title, content, is_visible) VALUES
('welcome_message', 'Welcome to Our School', 'Providing quality education and nurturing young minds for a brighter future.', true),
('mission', 'Our Mission', 'To provide holistic education that develops students academically, socially, and morally.', true),
('vision', 'Our Vision', 'To be the leading educational institution that produces well-rounded global citizens.', true),
('contact_info', 'Contact Information', 'Get in touch with us for admissions and inquiries.', true);

-- Create trigger for updated_at
CREATE TRIGGER update_homepage_content_updated_at
BEFORE UPDATE ON public.homepage_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();