-- Create missing tables to fix build errors

-- Create posts table for blog functionality
CREATE TABLE public.posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image TEXT,
  slug TEXT UNIQUE,
  published BOOLEAN DEFAULT false,
  author_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gallery_images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id),
  student_id TEXT UNIQUE,
  class TEXT,
  section TEXT,
  admission_date DATE,
  parent_contact TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id),
  employee_id TEXT UNIQUE,
  subject TEXT,
  qualification TEXT,
  experience_years INTEGER,
  department TEXT,
  hire_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create site_analytics table
CREATE TABLE public.site_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  visit_count INTEGER DEFAULT 1,
  unique_visitors INTEGER DEFAULT 1,
  last_visited TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create school_fees table
CREATE TABLE public.school_fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id),
  amount DECIMAL(10,2) NOT NULL,
  due_date DATE NOT NULL,
  status TEXT DEFAULT 'pending',
  payment_date DATE,
  academic_year TEXT,
  term TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_fees ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for public content
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (published = true);
CREATE POLICY "Admin can manage posts" ON public.posts FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Gallery images are viewable by everyone" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admin can manage gallery" ON public.gallery_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Users can view own student data" ON public.students FOR SELECT USING (
  profile_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin', 'teacher'))
);

CREATE POLICY "Admin can manage students" ON public.students FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Users can view teacher data" ON public.teachers FOR SELECT USING (
  profile_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admin can manage teachers" ON public.teachers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Analytics viewable by admins" ON public.site_analytics FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Analytics manageable by system" ON public.site_analytics FOR ALL USING (true);

CREATE POLICY "Users can view own fees" ON public.school_fees FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.profile_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

CREATE POLICY "Admin can manage fees" ON public.school_fees FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
);

-- Create indexes for performance
CREATE INDEX idx_posts_published ON public.posts(published);
CREATE INDEX idx_posts_author ON public.posts(author_id);
CREATE INDEX idx_students_profile ON public.students(profile_id);
CREATE INDEX idx_teachers_profile ON public.teachers(profile_id);
CREATE INDEX idx_school_fees_student ON public.school_fees(student_id);
CREATE INDEX idx_site_analytics_path ON public.site_analytics(page_path);