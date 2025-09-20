-- Update the constraint to allow 'staff' as well
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['student'::text, 'parent'::text, 'teacher'::text, 'staff'::text, 'admin'::text]));

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