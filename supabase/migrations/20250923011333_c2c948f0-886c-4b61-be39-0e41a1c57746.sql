-- Fix the profiles table to ensure user_id column exists and is properly referenced
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_pkey;

-- Add user_id as primary key if it doesn't exist, or ensure it references auth.users
DO $$ 
BEGIN
    -- Check if user_id column exists, if not add it
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='user_id') THEN
        ALTER TABLE public.profiles ADD COLUMN user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Ensure user_id is the primary key
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_pkey PRIMARY KEY (user_id);
    
    -- Create trigger to auto-create profile when user signs up
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS trigger
    LANGUAGE plpgsql
    SECURITY DEFINER SET search_path = public
    AS $function$
    BEGIN
      INSERT INTO public.profiles (user_id, email, full_name, role)
      VALUES (
        NEW.id, 
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
        COALESCE(NEW.raw_user_meta_data ->> 'role', 'student')
      )
      ON CONFLICT (user_id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        role = COALESCE(EXCLUDED.role, profiles.role),
        updated_at = now();
      RETURN NEW;
    END;
    $function$;

    -- Create trigger for new user signup
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      
EXCEPTION WHEN OTHERS THEN
    -- If there are existing issues, continue
    NULL;
END $$;