-- Fix the slug generation function to be simpler and more WordPress-like
CREATE OR REPLACE FUNCTION public.generate_slug_from_title(title_text text)
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $function$
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
          regexp_replace(title_text, '[^a-zA-Z0-9\s-]', '', 'g'), -- Remove special chars, keep letters, numbers, spaces, hyphens
          '\s+', '-', 'g'                                         -- Replace spaces with hyphens
        ),
        '-+', '-', 'g'                                            -- Replace multiple hyphens with single hyphen
      )
    )
  );
END;
$function$;

-- Update all existing posts with corrected WordPress-style slugs
UPDATE posts 
SET slug = public.generate_slug_from_title(title);

-- Ensure uniqueness for any duplicates by adding timestamp suffix
UPDATE posts 
SET slug = slug || '-' || extract(epoch from created_at)::integer
WHERE id IN (
  SELECT id FROM (
    SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
    FROM posts
  ) t WHERE rn > 1
);