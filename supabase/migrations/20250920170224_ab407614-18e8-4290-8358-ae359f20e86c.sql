-- Update existing admin users to also have appropriate role access
-- For demonstration, let's add some test credentials that can be used for each portal type

-- Create test users for each portal type (these are just profile records for demo purposes)
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'staff.test@ogrcs.com', 'Staff Test User', 'staff'),
  ('22222222-2222-2222-2222-222222222222', 'parent.test@ogrcs.com', 'Parent Test User', 'parent'), 
  ('33333333-3333-3333-3333-333333333333', 'student.test@ogrcs.com', 'Student Test User', 'student')
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role;