-- Fix profiles table to use correct user_id column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS id;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure lesson_schedules table exists
CREATE TABLE IF NOT EXISTS public.lesson_schedules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_id UUID NOT NULL,
    subject TEXT NOT NULL,
    class_level TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ensure enrolled_classes table exists
CREATE TABLE IF NOT EXISTS public.enrolled_classes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID NOT NULL,
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher_id UUID,
    teacher_name TEXT,
    grade TEXT,
    attendance_percentage NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Ensure children_records table exists
CREATE TABLE IF NOT EXISTS public.children_records (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    parent_id UUID NOT NULL,
    child_name TEXT NOT NULL,
    class_level TEXT NOT NULL,
    admission_number TEXT,
    current_gpa NUMERIC,
    attendance_percentage NUMERIC DEFAULT 0,
    outstanding_fees NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.lesson_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolled_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for lesson_schedules
CREATE POLICY "Staff can view their own schedules" ON public.lesson_schedules
    FOR SELECT USING (auth.uid() = staff_id);

CREATE POLICY "Staff can insert their own schedules" ON public.lesson_schedules
    FOR INSERT WITH CHECK (auth.uid() = staff_id);

CREATE POLICY "Staff can update their own schedules" ON public.lesson_schedules
    FOR UPDATE USING (auth.uid() = staff_id);

CREATE POLICY "Staff can delete their own schedules" ON public.lesson_schedules
    FOR DELETE USING (auth.uid() = staff_id);

-- Create RLS policies for enrolled_classes
CREATE POLICY "Students can view their own classes" ON public.enrolled_classes
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own classes" ON public.enrolled_classes
    FOR INSERT WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own classes" ON public.enrolled_classes
    FOR UPDATE USING (auth.uid() = student_id);

-- Create RLS policies for children_records
CREATE POLICY "Parents can view their children records" ON public.children_records
    FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their children records" ON public.children_records
    FOR INSERT WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their children records" ON public.children_records
    FOR UPDATE USING (auth.uid() = parent_id);

-- Add triggers for updated_at
CREATE TRIGGER update_lesson_schedules_updated_at
    BEFORE UPDATE ON public.lesson_schedules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_enrolled_classes_updated_at
    BEFORE UPDATE ON public.enrolled_classes
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_records_updated_at
    BEFORE UPDATE ON public.children_records
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data for testing
INSERT INTO public.lesson_schedules (staff_id, subject, class_level, day_of_week, start_time, end_time, room, notes) VALUES
    ((SELECT id FROM auth.users LIMIT 1), 'Mathematics', 'Grade 10', 1, '09:00', '10:00', 'Room 101', 'Algebra basics'),
    ((SELECT id FROM auth.users LIMIT 1), 'Physics', 'Grade 11', 2, '10:00', '11:00', 'Lab 1', 'Motion and forces'),
    ((SELECT id FROM auth.users LIMIT 1), 'Chemistry', 'Grade 12', 3, '11:00', '12:00', 'Lab 2', 'Organic chemistry')
ON CONFLICT DO NOTHING;

INSERT INTO public.enrolled_classes (student_id, class_name, subject, teacher_name, grade, attendance_percentage) VALUES
    ((SELECT id FROM auth.users LIMIT 1), 'Grade 10A', 'Mathematics', 'Mr. Johnson', 'A-', 95),
    ((SELECT id FROM auth.users LIMIT 1), 'Grade 10A', 'English', 'Ms. Smith', 'B+', 88),
    ((SELECT id FROM auth.users LIMIT 1), 'Grade 10A', 'Science', 'Dr. Brown', 'A', 92)
ON CONFLICT DO NOTHING;

INSERT INTO public.children_records (parent_id, child_name, class_level, admission_number, current_gpa, attendance_percentage, outstanding_fees) VALUES
    ((SELECT id FROM auth.users LIMIT 1), 'Sarah Johnson', 'Grade 10', 'ADM2024001', 3.8, 95, 50000),
    ((SELECT id FROM auth.users LIMIT 1), 'Michael Johnson', 'Grade 8', 'ADM2024002', 3.6, 92, 0)
ON CONFLICT DO NOTHING;