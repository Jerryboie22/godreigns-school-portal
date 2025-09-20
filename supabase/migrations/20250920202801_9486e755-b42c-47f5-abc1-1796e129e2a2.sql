-- Create a SECURITY DEFINER function to safely read the current user's role without triggering RLS recursion
create or replace function public.get_current_user_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- Drop problematic recursive policies
DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own basic profile (no role change)" ON public.profiles;

-- Recreate safe, non-recursive policies
-- 1) Allow admins and super admins to view all profiles
CREATE POLICY "Admins and supers can view all profiles"
ON public.profiles
FOR SELECT
USING (
  public.get_current_user_role() IN ('admin','super_admin')
  OR EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = auth.uid()
      AND u.email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
  )
);

-- 2) Super admins can manage all profiles
CREATE POLICY "Super admins can manage all profiles"
ON public.profiles
FOR ALL
USING (
  public.get_current_user_role() = 'super_admin'
  OR EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = auth.uid()
      AND u.email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
  )
);

-- 3) Users can update their own profile but cannot change role (no recursion via function)
CREATE POLICY "Users can update own basic profile (no role change)"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role = public.get_current_user_role()
);
