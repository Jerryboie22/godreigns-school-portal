-- Fix security warnings by setting search_path for functions
CREATE OR REPLACE FUNCTION public.generate_slug_from_title(title_text TEXT)
RETURNS TEXT 
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(title_text, '[^a-zA-Z0-9\s-]', '', 'g'),
        '\s+', '-', 'g'
      ),
      '-+', '-', 'g'
    )
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.set_post_slug()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- If slug is not provided, generate it from title
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = public.generate_slug_from_title(NEW.title);
    
    -- Ensure uniqueness by appending a number if needed
    WHILE EXISTS (SELECT 1 FROM public.posts WHERE slug = NEW.slug AND id != NEW.id) LOOP
      NEW.slug = public.generate_slug_from_title(NEW.title) || '-' || extract(epoch from now())::integer;
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$;