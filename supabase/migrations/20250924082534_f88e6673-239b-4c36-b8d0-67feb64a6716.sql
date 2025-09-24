-- Add name column to teachers table for direct name storage
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS name TEXT;

-- Insert some sample homepage content
INSERT INTO public.homepage_content (section_type, title, content, order_index, is_visible) VALUES
('hero', 'Welcome to Our God Reigns Crystal School', 'Experience excellence in education with our comprehensive academic programs.', 1, true),
('features', 'Academic Excellence', 'We provide quality education that prepares students for success in higher education and life.', 2, true),
('testimonials', 'Student Success Stories', 'Our graduates excel in universities and professional careers worldwide.', 3, true),
('announcements', 'Admission Open', 'Admission is now open for the 2025/2026 academic session. Apply today!', 4, true)
ON CONFLICT DO NOTHING;