-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Staff can view their own schedules" ON public.lesson_schedules;
DROP POLICY IF EXISTS "Staff can insert their own schedules" ON public.lesson_schedules;
DROP POLICY IF EXISTS "Staff can update their own schedules" ON public.lesson_schedules;
DROP POLICY IF EXISTS "Staff can delete their own schedules" ON public.lesson_schedules;
DROP POLICY IF EXISTS "Students can view their own classes" ON public.enrolled_classes;
DROP POLICY IF EXISTS "Students can insert their own classes" ON public.enrolled_classes;
DROP POLICY IF EXISTS "Students can update their own classes" ON public.enrolled_classes;
DROP POLICY IF EXISTS "Parents can view their children records" ON public.children_records;
DROP POLICY IF EXISTS "Parents can insert their children records" ON public.children_records;
DROP POLICY IF EXISTS "Parents can update their children records" ON public.children_records;

-- Fix profiles table structure
DROP TABLE IF EXISTS public.profiles CASCADE;
CREATE TABLE public.profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    role TEXT DEFAULT 'student',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

-- Create the security definer function for user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM public.profiles 
        WHERE user_id = auth.uid()
    );
END;
$$;

-- Create new RLS policies for lesson_schedules
CREATE POLICY "Staff can view their own schedules" ON public.lesson_schedules
    FOR SELECT USING (auth.uid() = staff_id);

CREATE POLICY "Staff can manage their own schedules" ON public.lesson_schedules
    FOR ALL USING (auth.uid() = staff_id);

-- Create new RLS policies for enrolled_classes  
CREATE POLICY "Students can view their own classes" ON public.enrolled_classes
    FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Students can manage their own classes" ON public.enrolled_classes
    FOR ALL USING (auth.uid() = student_id);

-- Create new RLS policies for children_records
CREATE POLICY "Parents can view their children records" ON public.children_records
    FOR SELECT USING (auth.uid() = parent_id);

CREATE POLICY "Parents can manage their children records" ON public.children_records
    FOR ALL USING (auth.uid() = parent_id);

-- Add trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample profile data
INSERT INTO public.profiles (user_id, full_name, email, role) 
SELECT id, 'Demo User', email, 'staff' 
FROM auth.users 
LIMIT 1
ON CONFLICT (user_id) DO UPDATE SET 
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;