-- RLS policies to allow staff (teachers) to add/edit students, and admins to manage all
-- Ensure RLS is enabled (already enabled if policies exist)

-- Admins can manage all students
create policy if not exists "Admins can manage all students"
  on public.students
  for all
  to authenticated
  using (public.get_current_user_role() = 'admin')
  with check (public.get_current_user_role() = 'admin');

-- Teachers can insert students
create policy if not exists "Teachers can insert students"
  on public.students
  for insert
  to authenticated
  with check (public.get_current_user_role() = 'teacher');

-- Teachers can update students
create policy if not exists "Teachers can update students"
  on public.students
  for update
  to authenticated
  using (public.get_current_user_role() = 'teacher')
  with check (public.get_current_user_role() = 'teacher');