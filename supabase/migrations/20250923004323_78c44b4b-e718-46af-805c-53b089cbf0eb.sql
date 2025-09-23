-- Fix RLS policies for homepage_images to allow public viewing
DROP POLICY IF EXISTS "Authenticated users can manage homepage images" ON public.homepage_images;
DROP POLICY IF EXISTS "Homepage images are viewable by everyone" ON public.homepage_images;

-- Create new policies that work properly
CREATE POLICY "Everyone can view active homepage images" 
ON public.homepage_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage homepage images" 
ON public.homepage_images 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Fix RLS policies for schedule_notifications to handle unauthenticated users
DROP POLICY IF EXISTS "Users can create notifications" ON public.schedule_notifications;
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.schedule_notifications;
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.schedule_notifications;

-- Recreate policies with proper authentication checks
CREATE POLICY "Authenticated users can insert notifications" 
ON public.schedule_notifications 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view their own notifications" 
ON public.schedule_notifications 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND auth.uid() = recipient_id);

CREATE POLICY "Users can update their own notifications" 
ON public.schedule_notifications 
FOR UPDATE 
USING (auth.uid() IS NOT NULL AND auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.schedule_notifications 
FOR DELETE 
USING (auth.uid() IS NOT NULL AND auth.uid() = recipient_id);