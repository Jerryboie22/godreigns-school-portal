-- Fix infinite recursion in profiles policies
-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own basic profile (no role change)" ON public.profiles;

-- Create non-recursive policies
-- Users can always view and update their own profile
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id);

-- Super admins (by email) can view and manage all profiles
CREATE POLICY "Super admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
  )
);

CREATE POLICY "Super admins can manage all profiles" 
ON public.profiles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
  )
);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = id);