-- Create portal sections table
CREATE TABLE public.portal_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  portal_type TEXT NOT NULL CHECK (portal_type IN ('staff', 'student')),
  section_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL DEFAULT 'FileText',
  order_index INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  content_type TEXT NOT NULL DEFAULT 'custom' CHECK (content_type IN ('custom', 'schedule', 'students', 'assignments', 'grades', 'resources', 'messages', 'reports', 'progress', 'lessons', 'attendance')),
  custom_content JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(portal_type, section_key)
);

-- Enable RLS
ALTER TABLE public.portal_sections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Portal sections are viewable by everyone" 
ON public.portal_sections 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage portal sections" 
ON public.portal_sections 
FOR ALL 
USING (auth.role() = 'authenticated'::text);

-- Create trigger for timestamps
CREATE TRIGGER update_portal_sections_updated_at
BEFORE UPDATE ON public.portal_sections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default sections for staff portal
INSERT INTO public.portal_sections (portal_type, section_key, title, description, icon, order_index, content_type) VALUES
('staff', 'schedule', 'Schedule', 'Your classes and timetable', 'Calendar', 1, 'schedule'),
('staff', 'students', 'Students', 'View and manage your students', 'Users', 2, 'students'),
('staff', 'assignments', 'Assignments', 'Create and manage assignments', 'FileText', 3, 'assignments'),
('staff', 'lessons', 'Lesson Plans', 'Create and view lesson plans', 'BookOpen', 4, 'lessons'),
('staff', 'attendance', 'Attendance', 'Mark and track attendance', 'CheckSquare', 5, 'attendance'),
('staff', 'messages', 'Messages', 'Communicate with parents', 'MessageSquare', 6, 'messages'),
('staff', 'reports', 'Reports', 'Generate academic reports', 'BarChart', 7, 'reports');

-- Insert default sections for student portal
INSERT INTO public.portal_sections (portal_type, section_key, title, description, icon, order_index, content_type) VALUES
('student', 'grades', 'Grades', 'View your academic performance', 'Trophy', 1, 'grades'),
('student', 'assignments', 'Assignments', 'View assignments and tasks', 'FileText', 2, 'assignments'),
('student', 'schedule', 'Schedule', 'Your daily class schedule', 'Clock', 3, 'schedule'),
('student', 'resources', 'Resources', 'Learning materials and downloads', 'BookOpen', 4, 'resources'),
('student', 'progress', 'Progress', 'Track your academic progress', 'Target', 5, 'progress');