-- Create role enum with specified values
CREATE TYPE public.app_role AS ENUM (
  'super_admin', 
  'admin', 
  'teacher', 
  'student', 
  'parent', 
  'user'
);

-- Create profiles table linked to auth users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get current user role (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS public.app_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(user_id UUID, required_role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = required_role
  );
$$;

-- Create function to check if user is super admin by email (fail-safe)
CREATE OR REPLACE FUNCTION public.is_super_admin_by_email(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT user_email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com');
$$;

-- RLS Policies for profiles table
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

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    CASE 
      WHEN NEW.email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com') THEN 'super_admin'::public.app_role
      ELSE 'user'::public.app_role
    END
  );
  RETURN NEW;
END;
$$;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Trigger to update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert super admin profiles directly (in case they already exist in auth)
INSERT INTO public.profiles (id, email, full_name, role)
SELECT id, email, COALESCE(raw_user_meta_data ->> 'full_name', email), 'super_admin'::public.app_role
FROM auth.users
WHERE email IN ('jerryemeka22@gmail.com', 'ogrcs@yahoo.com')
ON CONFLICT (id) DO UPDATE SET role = 'super_admin';

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_profiles_email ON public.profiles(email);