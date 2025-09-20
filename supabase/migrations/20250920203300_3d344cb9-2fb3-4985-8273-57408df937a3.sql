-- Create helper function that safely checks super admin status without exposing auth.users in policy
create or replace function public.is_current_user_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from auth.users u
    where u.id = auth.uid()
      and u.email in ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
  );
$$;

-- Clean up existing problematic policies that reference auth.users directly or cause recursion
DROP POLICY IF EXISTS "Admins and supers can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Super admins can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own basic profile (no role change)" ON public.profiles;

-- Recreate minimal, safe, non-recursive policies
-- View own or if super admin
CREATE POLICY "Profiles: select own or by super admin"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR public.is_current_user_super_admin()
);

-- Insert only self (or super admin)
CREATE POLICY "Profiles: insert self or by super admin"
ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id OR public.is_current_user_super_admin()
);

-- Update own profile (or super admin)
CREATE POLICY "Profiles: update own or by super admin"
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = id OR public.is_current_user_super_admin()
)
WITH CHECK (
  auth.uid() = id OR public.is_current_user_super_admin()
);

-- Delete only by super admin (optional safety)
CREATE POLICY "Profiles: delete by super admin"
ON public.profiles
FOR DELETE
USING (
  public.is_current_user_super_admin()
);