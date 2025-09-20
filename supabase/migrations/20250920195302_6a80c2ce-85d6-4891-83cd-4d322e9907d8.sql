-- Strengthen RLS to prevent self-escalation
DROP POLICY IF EXISTS "Users can update own basic profile" ON public.profiles;

CREATE POLICY "Users can update own basic profile (no role change)"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id 
  AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

-- Ensure only super admins can update/delete others
-- (Already enforced by existing policies). No change needed.

-- Add missing analytics columns expected by frontend
ALTER TABLE public.site_analytics 
  ADD COLUMN IF NOT EXISTS session_id TEXT,
  ADD COLUMN IF NOT EXISTS user_id UUID,
  ADD COLUMN IF NOT EXISTS user_agent TEXT;