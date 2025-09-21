-- Create the missing trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some test users with appropriate roles for testing
-- Staff user
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES ('00000000-0000-0000-0000-000000000001', 'staff@ogrcs.com', 'Test Staff', 'staff')
ON CONFLICT (id) DO UPDATE SET role = 'staff';

-- Parent user  
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES ('00000000-0000-0000-0000-000000000002', 'parent@ogrcs.com', 'Test Parent', 'parent')
ON CONFLICT (id) DO UPDATE SET role = 'parent';

-- Student user
INSERT INTO public.profiles (id, email, full_name, role) 
VALUES ('00000000-0000-0000-0000-000000000003', 'student@ogrcs.com', 'Test Student', 'student')
ON CONFLICT (id) DO UPDATE SET role = 'student';