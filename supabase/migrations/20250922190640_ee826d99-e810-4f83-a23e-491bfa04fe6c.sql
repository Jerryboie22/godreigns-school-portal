-- Create enrolled_classes table for student portal
CREATE TABLE public.enrolled_classes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL,
  class_name text NOT NULL,
  subject text NOT NULL,
  teacher_name text,
  teacher_id uuid,
  grade text,
  attendance_percentage numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create children_records table for parent portal
CREATE TABLE public.children_records (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id uuid NOT NULL,
  child_name text NOT NULL,
  class_level text NOT NULL,
  admission_number text,
  current_gpa numeric,
  attendance_percentage numeric DEFAULT 0,
  outstanding_fees numeric DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.enrolled_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.children_records ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for enrolled_classes
CREATE POLICY "Students can view their own enrolled classes"
ON public.enrolled_classes
FOR SELECT
USING (auth.uid() = student_id);

CREATE POLICY "Students can insert their own enrolled classes"
ON public.enrolled_classes
FOR INSERT
WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own enrolled classes"
ON public.enrolled_classes
FOR UPDATE
USING (auth.uid() = student_id);

CREATE POLICY "Admins can manage all enrolled classes"
ON public.enrolled_classes
FOR ALL
USING (get_current_user_role() = 'admin');

-- Create RLS policies for children_records
CREATE POLICY "Parents can view their own children records"
ON public.children_records
FOR SELECT
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can insert their own children records"
ON public.children_records
FOR INSERT
WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Parents can update their own children records"
ON public.children_records
FOR UPDATE
USING (auth.uid() = parent_id);

CREATE POLICY "Admins can manage all children records"
ON public.children_records
FOR ALL
USING (get_current_user_role() = 'admin');

-- Create triggers for updating timestamps
CREATE TRIGGER update_enrolled_classes_updated_at
BEFORE UPDATE ON public.enrolled_classes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_children_records_updated_at
BEFORE UPDATE ON public.children_records
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();