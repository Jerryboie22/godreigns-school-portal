-- RLS policies to allow staff (teachers) to add/edit students, and admins to manage all
-- Note: PostgreSQL doesn't support IF NOT EXISTS for policies, so we'll drop and recreate

-- Drop existing policies first
DROP POLICY IF EXISTS "Admins can manage all students" ON public.students;
DROP POLICY IF EXISTS "Teachers can insert students" ON public.students;
DROP POLICY IF EXISTS "Teachers can update students" ON public.students;

-- Admins can manage all students
CREATE POLICY "Admins can manage all students"
  ON public.students
  FOR ALL
  TO authenticated
  USING (public.get_current_user_role() = 'admin')
  WITH CHECK (public.get_current_user_role() = 'admin');

-- Teachers can insert students
CREATE POLICY "Teachers can insert students"
  ON public.students
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_current_user_role() = 'teacher');

-- Teachers can update students
CREATE POLICY "Teachers can update students"
  ON public.students
  FOR UPDATE
  TO authenticated
  USING (public.get_current_user_role() = 'teacher')
  WITH CHECK (public.get_current_user_role() = 'teacher');