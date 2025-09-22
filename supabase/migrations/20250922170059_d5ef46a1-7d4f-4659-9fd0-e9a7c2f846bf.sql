-- Create lesson schedules table
CREATE TABLE public.lesson_schedules (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    staff_id UUID NOT NULL,
    subject TEXT NOT NULL,
    class_level TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1 = Monday, 7 = Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- Create schedule notifications table
CREATE TABLE public.schedule_notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    recipient_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    schedule_id UUID NOT NULL REFERENCES public.lesson_schedules(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    notification_type TEXT NOT NULL DEFAULT 'schedule_change',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.lesson_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_notifications ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role 
        FROM public.profiles 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for lesson_schedules
-- Staff can view and edit their own schedules
CREATE POLICY "Staff can view their own schedules" 
ON public.lesson_schedules 
FOR SELECT 
USING (staff_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'teacher'));

CREATE POLICY "Staff can create their own schedules" 
ON public.lesson_schedules 
FOR INSERT 
WITH CHECK (staff_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'teacher'));

CREATE POLICY "Staff can update their own schedules" 
ON public.lesson_schedules 
FOR UPDATE 
USING (staff_id = auth.uid() OR public.get_current_user_role() IN ('admin', 'teacher'));

-- Admins can view and manage all schedules
CREATE POLICY "Admins can view all schedules" 
ON public.lesson_schedules 
FOR SELECT 
USING (public.get_current_user_role() IN ('admin'));

CREATE POLICY "Admins can manage all schedules" 
ON public.lesson_schedules 
FOR ALL 
USING (public.get_current_user_role() IN ('admin'));

-- RLS Policies for schedule_notifications
CREATE POLICY "Users can view their own notifications" 
ON public.schedule_notifications 
FOR SELECT 
USING (recipient_id = auth.uid());

CREATE POLICY "Users can create notifications" 
ON public.schedule_notifications 
FOR INSERT 
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their own notifications" 
ON public.schedule_notifications 
FOR UPDATE 
USING (recipient_id = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_lesson_schedules_updated_at
BEFORE UPDATE ON public.lesson_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to notify on schedule changes
CREATE OR REPLACE FUNCTION public.notify_schedule_change()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify admins when staff changes their schedule
    IF TG_OP = 'UPDATE' AND OLD.staff_id = NEW.staff_id THEN
        INSERT INTO public.schedule_notifications (
            recipient_id,
            sender_id,
            schedule_id,
            message,
            notification_type
        )
        SELECT 
            p.user_id,
            NEW.staff_id,
            NEW.id,
            'Schedule updated for ' || NEW.subject || ' - ' || NEW.class_level,
            'schedule_change'
        FROM public.profiles p
        WHERE p.role = 'admin';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for schedule change notifications
CREATE TRIGGER schedule_change_notification
AFTER UPDATE ON public.lesson_schedules
FOR EACH ROW
EXECUTE FUNCTION public.notify_schedule_change();

-- Add indexes for better performance
CREATE INDEX idx_lesson_schedules_staff_id ON public.lesson_schedules(staff_id);
CREATE INDEX idx_lesson_schedules_day_time ON public.lesson_schedules(day_of_week, start_time);
CREATE INDEX idx_schedule_notifications_recipient ON public.schedule_notifications(recipient_id, is_read);