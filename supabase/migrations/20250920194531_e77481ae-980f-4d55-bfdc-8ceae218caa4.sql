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
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
  OR
  EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() AND u.email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
  )
);

-- Admins can view profiles
CREATE POLICY "Admins can view profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role IN ('admin', 'super_admin')
  )
  OR
  EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() AND u.email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
  )
);

-- Users can update their own basic profile info (not role)
CREATE POLICY "Users can update own basic profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Only super admins can manage all profiles including roles
CREATE POLICY "Super admins can manage all profiles"
ON public.profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p 
    WHERE p.id = auth.uid() AND p.role = 'super_admin'
  )
  OR
  EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.id = auth.uid() AND u.email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
  )
);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Fix function search paths
ALTER FUNCTION public.get_current_user_role() SET search_path = public;
ALTER FUNCTION public.has_role(UUID, public.app_role) SET search_path = public;
ALTER FUNCTION public.is_super_admin_by_email(TEXT) SET search_path = public;
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);