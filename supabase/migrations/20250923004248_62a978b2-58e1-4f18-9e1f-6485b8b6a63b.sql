-- Create homepage_images table for managing homepage image content
CREATE TABLE public.homepage_images (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    section VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200) NOT NULL,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create schedule_notifications table for notification system
CREATE TABLE public.schedule_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID NOT NULL,
    sender_id UUID NOT NULL, 
    schedule_id UUID,
    notification_type VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for both tables
ALTER TABLE public.homepage_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for homepage_images (admin/staff can manage, everyone can view active ones)
CREATE POLICY "Everyone can view active homepage images" 
ON public.homepage_images 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can manage homepage images" 
ON public.homepage_images 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- RLS policies for schedule_notifications (users can only see their own notifications)
CREATE POLICY "Users can view their own notifications" 
ON public.schedule_notifications 
FOR SELECT 
USING (auth.uid() = recipient_id);

CREATE POLICY "Users can update their own notifications" 
ON public.schedule_notifications 
FOR UPDATE 
USING (auth.uid() = recipient_id);

CREATE POLICY "Users can delete their own notifications" 
ON public.schedule_notifications 
FOR DELETE 
USING (auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can insert notifications" 
ON public.schedule_notifications 
FOR INSERT 
WITH CHECK (auth.uid() = sender_id);

-- Add updated_at trigger for homepage_images
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_homepage_images_updated_at
    BEFORE UPDATE ON public.homepage_images
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();