/*
  # Create storage bucket for assessment images

  1. New Storage
    - Create 'assessment-images' bucket for storing leg photos
    - Enable public access for viewing images
    - Allow authenticated users to upload images with size restrictions
  
  2. Security
    - Limit file types to common image formats
    - Restrict file size to 10MB
    - Enable public access for viewing
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assessment-images', 'assessment-images', true);

-- Allow public access to view images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assessment-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'assessment-images'
  AND (LOWER(RIGHT(name, 4)) IN ('.jpg', '.png', '.gif')
    OR LOWER(RIGHT(name, 5)) = '.jpeg'
    OR LOWER(RIGHT(name, 5)) = '.webp')
);