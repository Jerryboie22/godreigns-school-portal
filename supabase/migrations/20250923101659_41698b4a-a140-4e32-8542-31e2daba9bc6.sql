-- Fix security vulnerability: Remove public access to profiles table
-- and implement proper user-specific access control

-- Drop the overly permissive policy that allows everyone to view all profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a secure policy that only allows users to view their own profile
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow admins to view all profiles for legitimate administrative purposes
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (get_current_user_role() = 'admin');

-- Ensure users can still update their own profiles (this policy should already exist but let's make sure)
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Ensure users can insert their own profile (this policy should already exist but let's make sure)
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);