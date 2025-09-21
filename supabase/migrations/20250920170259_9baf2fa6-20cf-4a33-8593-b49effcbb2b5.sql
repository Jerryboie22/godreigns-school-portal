-- Check current role constraint and update it to allow all portal types
-- First, let's see what constraint exists and then fix it

-- Since the profiles.role column seems to have constraints, let's update it
-- Add the missing enum values to the existing app_role type
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'staff';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'parent'; 
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'student';

-- Update the role column to use the enum type properly
ALTER TABLE public.profiles ALTER COLUMN role TYPE app_role USING role::app_role;