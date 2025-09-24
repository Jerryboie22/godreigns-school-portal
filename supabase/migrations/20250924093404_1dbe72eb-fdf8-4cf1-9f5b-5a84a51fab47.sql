-- Insert the proprietress welcome address into homepage content
INSERT INTO public.homepage_content (
  section_type,
  title,
  content,
  is_visible,
  order_index
) VALUES (
  'proprietress_address',
  'PROPRIETRESS'' WELCOME ADDRESS FOR THE FIRST TERM OF 2025/2026 ACADEMIC SESSION',
  'Distinguished Parents, Guardians, Staff, and Beloved Students,

It is with great joy and gratitude to God Almighty that I warmly and sincerely welcome you all to the first term of the 2025/2026 academic session.

To our returning students, welcome back! We are delighted to see your bright faces again, and we trust you had a refreshing holiday. To our new students and parents joining our school family for the first time, we say a heartfelt welcome. You are now part of a nurturing community where excellence, discipline, and character-building remain our watchwords.

The start of a new academic year is always a season of fresh opportunities. It is a time to set new goals, embrace new challenges, and strive for greater achievements. In Our God Reigns Crystal School, we remain committed to providing a safe, stimulating, and supportive environment where every child can discover and develop their unique potential.

To our dear teachers and staff, I commend your tireless dedication and commitment. Together, let us continue to inspire, mentor, and guide our students towards academic excellence and moral uprightness. To our parents and guardians, we deeply appreciate your trust and partnership. Your cooperation and support are invaluable as we work hand in hand to shape the future of our children.

My admonition to our students this term is simple: be focused, be diligent, and be disciplined. Remember, success comes through hard work, respect, and consistency.

On behalf of the school management, I wish us all a fruitful, productive, and successful academic session ahead. With God on our side, this year will be filled with testimonies of growth and achievement.

Once again, welcome to the 2025/2026 academic session.

Thank you, and God bless you all.

Pastor (Mrs) Kehinde Adetuberu
Proprietress',
  true,
  10
) ON CONFLICT DO NOTHING;