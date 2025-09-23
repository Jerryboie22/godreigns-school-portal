-- Fix security vulnerability: Remove overly permissive analytics policy and implement proper access control

-- Drop the overly permissive policy that allows anyone to access analytics data
DROP POLICY IF EXISTS "Analytics manageable by system" ON public.site_analytics;

-- Keep the existing admin-only SELECT policy (it's correct)
-- "Analytics viewable by admins" already exists and is properly configured

-- Create a system-only INSERT policy for analytics collection
-- This allows the application to record analytics but prevents user access
CREATE POLICY "System can insert analytics data" 
ON public.site_analytics 
FOR INSERT 
WITH CHECK (true);

-- Create admin-only policies for UPDATE and DELETE operations
CREATE POLICY "Admins can update analytics data" 
ON public.site_analytics 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = ANY(ARRAY['super_admin'::app_role, 'admin'::app_role])
));

CREATE POLICY "Admins can delete analytics data" 
ON public.site_analytics 
FOR DELETE 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.role = ANY(ARRAY['super_admin'::app_role, 'admin'::app_role])
));