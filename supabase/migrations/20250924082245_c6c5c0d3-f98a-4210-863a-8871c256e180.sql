-- Improve slug generation to match WordPress format
CREATE OR REPLACE FUNCTION public.generate_slug_from_title(title_text TEXT)
RETURNS TEXT 
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
BEGIN
  -- Return empty if input is null or empty
  IF title_text IS NULL OR title_text = '' THEN
    RETURN '';
  END IF;
  
  RETURN trim(
    both '-' from
    lower(
      regexp_replace(
        regexp_replace(
          regexp_replace(
            regexp_replace(title_text, '[^\w\s-]', '', 'g'), -- Remove special chars, keep word chars, spaces, hyphens
            '\s+', '-', 'g'                                  -- Replace spaces with hyphens
          ),
          '-+', '-', 'g'                                     -- Replace multiple hyphens with single hyphen
        ),
        '^-+|-+$', '', 'g'                                   -- Remove leading/trailing hyphens
      )
    )
  );
END;
$$;

-- Update existing posts to use the improved slug format
UPDATE public.posts 
SET slug = public.generate_slug_from_title(title)
WHERE slug IS NOT NULL;