-- JWT-based helpers (avoid touching auth.users in policies)
create or replace function public.current_user_email()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select coalesce((current_setting('request.jwt.claims', true))::jsonb ->> 'email', '')
$$;

create or replace function public.is_super_admin_from_jwt()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.current_user_email() in ('jerryemeka22@gmail.com','ogrcs@yahoo.com')
$$;

-- Replace profiles policies to remove any dependency on auth.users
DROP POLICY IF EXISTS "Profiles: select own or by super admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: insert self or by super admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: update own or by super admin" ON public.profiles;
DROP POLICY IF EXISTS "Profiles: delete by super admin" ON public.profiles;

CREATE POLICY "Profiles: select own or SA (jwt)"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR public.is_super_admin_from_jwt()
);

CREATE POLICY "Profiles: insert self or SA (jwt)"
ON public.profiles
FOR INSERT
WITH CHECK (
  auth.uid() = id OR public.is_super_admin_from_jwt()
);

CREATE POLICY "Profiles: update own or SA (jwt, no role escalation)"
ON public.profiles
FOR UPDATE
USING (
  auth.uid() = id OR public.is_super_admin_from_jwt()
)
WITH CHECK (
  public.is_super_admin_from_jwt() OR (
    auth.uid() = id AND role = public.get_current_user_role()
  )
);

CREATE POLICY "Profiles: delete by SA (jwt)"
ON public.profiles
FOR DELETE
USING (
  public.is_super_admin_from_jwt()
);