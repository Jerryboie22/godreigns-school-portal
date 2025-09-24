-- Improve the slug generation function to be more WordPress-like
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
            regexp_replace(
              regexp_replace(title_text, '[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]', 
                CASE 
                  WHEN title_text ~ '[àáâãäå]' THEN 'a'
                  WHEN title_text ~ '[æ]' THEN 'ae'
                  WHEN title_text ~ '[ç]' THEN 'c'
                  WHEN title_text ~ '[èéêë]' THEN 'e'
                  WHEN title_text ~ '[ìíîï]' THEN 'i'
                  WHEN title_text ~ '[ð]' THEN 'd'
                  WHEN title_text ~ '[ñ]' THEN 'n'
                  WHEN title_text ~ '[òóôõöø]' THEN 'o'
                  WHEN title_text ~ '[ùúûü]' THEN 'u'
                  WHEN title_text ~ '[ýþÿ]' THEN 'y'
                  ELSE ''
                END, 'g'
              ), -- Handle accented characters
              '[^a-z0-9\s-]', '', 'g'                    -- Remove special chars except spaces and hyphens
            ),
            '\s+', '-', 'g'                              -- Replace spaces with hyphens
          ),
          '-+', '-', 'g'                                 -- Replace multiple hyphens with single hyphen
        ),
        '^-+|-+$', '', 'g'                               -- Remove leading/trailing hyphens
      )
    )
  );
END;
$function$;

-- Update all existing posts with proper WordPress-style slugs
UPDATE posts 
SET slug = public.generate_slug_from_title(title)
WHERE slug IS NULL 
   OR slug != public.generate_slug_from_title(title)
   OR slug ~ '[\s/\\]'  -- Contains spaces, slashes, or backslashes
   OR slug != lower(slug); -- Not lowercase

-- Ensure the trigger exists and is properly set up
DROP TRIGGER IF EXISTS set_post_slug_trigger ON public.posts;

CREATE TRIGGER set_post_slug_trigger
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_post_slug();