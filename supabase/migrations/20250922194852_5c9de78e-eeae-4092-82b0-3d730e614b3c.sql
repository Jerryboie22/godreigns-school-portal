-- Create assignments table for lesson plans
CREATE TABLE public.assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  class_level TEXT NOT NULL,
  due_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for assignments
CREATE POLICY "Teachers can view their own assignments" 
ON public.assignments 
FOR SELECT 
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can create their own assignments" 
ON public.assignments 
FOR INSERT 
WITH CHECK (auth.uid() = teacher_id);

CREATE POLICY "Teachers can update their own assignments" 
ON public.assignments 
FOR UPDATE 
USING (auth.uid() = teacher_id);

CREATE POLICY "Teachers can delete their own assignments" 
ON public.assignments 
FOR DELETE 
USING (auth.uid() = teacher_id);

CREATE POLICY "Admins can manage all assignments" 
ON public.assignments 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- Create fee_payments table for tracking payments
CREATE TABLE public.fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  parent_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  fee_type TEXT NOT NULL,
  payment_method TEXT DEFAULT 'card',
  status TEXT DEFAULT 'pending',
  transaction_id TEXT,
  payment_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for fee_payments
CREATE POLICY "Parents can view their own payments" 
ON public.fee_payments 
FOR SELECT 
USING (auth.uid() = parent_id);

CREATE POLICY "Parents can create their own payments" 
ON public.fee_payments 
FOR INSERT 
WITH CHECK (auth.uid() = parent_id);

CREATE POLICY "Admins can manage all payments" 
ON public.fee_payments 
FOR ALL 
USING (get_current_user_role() = 'admin');

-- Add triggers for updated_at
CREATE TRIGGER update_assignments_updated_at
BEFORE UPDATE ON public.assignments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fee_payments_updated_at
BEFORE UPDATE ON public.fee_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();