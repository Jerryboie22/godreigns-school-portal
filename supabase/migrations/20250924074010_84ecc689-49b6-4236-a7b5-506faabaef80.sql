-- Add featured_image and slug columns to posts table
ALTER TABLE public.posts 
ADD COLUMN IF NOT EXISTS featured_image TEXT,
ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug (allowing nulls for existing posts)
CREATE UNIQUE INDEX IF NOT EXISTS posts_slug_unique_idx ON public.posts (slug) WHERE slug IS NOT NULL;

-- Create function to generate slug from title if slug is empty
CREATE OR REPLACE FUNCTION public.generate_slug_from_title(title_text TEXT)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger function to auto-generate slug if not provided
CREATE OR REPLACE FUNCTION public.set_post_slug()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate slug
DROP TRIGGER IF EXISTS trigger_set_post_slug ON public.posts;
CREATE TRIGGER trigger_set_post_slug
  BEFORE INSERT OR UPDATE ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_post_slug();

-- Update existing posts to have slugs generated from their titles
UPDATE public.posts 
SET slug = public.generate_slug_from_title(title)
WHERE slug IS NULL OR slug = '';

-- Handle any potential duplicates by adding timestamp
UPDATE public.posts 
SET slug = slug || '-' || extract(epoch from created_at)::integer
WHERE id IN (
  SELECT id FROM (
    SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY created_at) as rn
    FROM public.posts
  ) t WHERE t.rn > 1
);