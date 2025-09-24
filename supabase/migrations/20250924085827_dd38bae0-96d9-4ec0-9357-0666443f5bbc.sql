-- Fix the slug generation function to be properly WordPress-like
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
          regexp_replace(
            -- First normalize accented characters to their base form
            translate(title_text, 
              'àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞŸ',
              'aaaaaaeceeeeiiiidnooooouuuuytyaaaaaaeceeeeiiiidnooooouuuuyty'
            ),
            '[^a-z0-9\s-]', '', 'gi'                     -- Remove special chars, keep letters, numbers, spaces, hyphens
          ),
          '\s+', '-', 'g'                                -- Replace spaces with hyphens
        ),
        '-+', '-', 'g'                                   -- Replace multiple hyphens with single hyphen
      )
    )
  );
END;
$function$;

-- Update all existing posts with corrected WordPress-style slugs
UPDATE posts 
SET slug = public.generate_slug_from_title(title);