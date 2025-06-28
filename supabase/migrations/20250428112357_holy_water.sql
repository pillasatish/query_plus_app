/*
  # Update storage bucket for assessment images

  1. Changes
    - Create storage bucket if it doesn't exist
    - Set up public access policies
    - Configure file size limits
    - Add file type restrictions
  
  2. Security
    - Enable public read access
    - Restrict file types to images only
    - Limit file size to 10MB
*/

DO $$
BEGIN
  -- Create the storage bucket if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'assessment-images'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('assessment-images', 'assessment-images', true);
  END IF;
END $$;

-- Update bucket settings
UPDATE storage.buckets
SET 
  public = true,
  file_size_limit = 10485760
WHERE id = 'assessment-images';

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload images" ON storage.objects;

-- Create new policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assessment-images');

CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'assessment-images'
  AND (LOWER(RIGHT(name, 4)) IN ('.jpg', '.png', '.gif')
    OR LOWER(RIGHT(name, 5)) = '.jpeg'
    OR LOWER(RIGHT(name, 5)) = '.webp')
);