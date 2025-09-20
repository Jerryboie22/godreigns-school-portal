-- Add RLS Policies for profiles table

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Super admins can view all profiles
CREATE POLICY "Super admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'super_admin');

-- Admins can view profiles (but not modify roles)
CREATE POLICY "Admins can view profiles"
ON public.profiles
FOR SELECT
USING (public.get_current_user_role() = 'admin');

-- Users can update their own profile (but not role)
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Only super admins can update roles
CREATE POLICY "Only super admins can update roles"
ON public.profiles
FOR UPDATE
USING (
  public.get_current_user_role() = 'super_admin'
  OR public.is_super_admin_by_email((SELECT email FROM auth.users WHERE id = auth.uid()))
)
WITH CHECK (
  -- Prevent anyone from becoming super_admin except the designated emails
  (NEW.role != 'super_admin' OR NEW.email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com'))
  AND 
  -- Super admins can only be the designated emails
  (OLD.role != 'super_admin' OR OLD.email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com'))
);

-- Super admins and admins can insert new profiles
CREATE POLICY "Super admins and admins can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (
  public.get_current_user_role() IN ('super_admin', 'admin')
  OR auth.uid() = id
);

-- Fix function search paths
ALTER FUNCTION public.get_current_user_role() SET search_path = public;
ALTER FUNCTION public.has_role(UUID, public.app_role) SET search_path = public;
ALTER FUNCTION public.is_super_admin_by_email(TEXT) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- Insert super admin profiles directly (in case they already exist in auth)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data ->> 'full_name', email), 'super_admin'::public.app_role
FROM auth.users
WHERE email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';