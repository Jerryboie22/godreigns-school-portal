-- Update the constraint to allow 'staff' role
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['student'::text, 'parent'::text, 'teacher'::text, 'staff'::text, 'admin'::text]));