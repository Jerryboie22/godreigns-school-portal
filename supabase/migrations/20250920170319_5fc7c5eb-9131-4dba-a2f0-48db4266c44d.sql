-- Create the enum type and update the role column
CREATE TYPE public.app_role AS ENUM ('admin', 'staff', 'parent', 'student');

-- Drop any existing constraint on role column
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Update the role column to use the enum type
ALTER TABLE public.profiles ALTER COLUMN role TYPE app_role USING role::app_role;

-- Now add test users for each portal type
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'staff.test@ogrcs.com', 'Staff Test User', 'staff'),
  ('22222222-2222-2222-2222-222222222222', 'parent.test@ogrcs.com', 'Parent Test User', 'parent'), 
  ('33333333-3333-3333-3333-333333333333', 'student.test@ogrcs.com', 'Student Test User', 'student')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;