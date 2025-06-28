/*
  # Update RLS policies for assessments table
  
  1. Changes
    - Allow anonymous users to insert assessments
    - Keep existing policy for authenticated users to read assessments
  
  2. Security
    - Maintains read protection (only authenticated users can read)
    - Allows anyone to submit assessments (required for the public form)
*/

-- Drop the existing insert policy
DROP POLICY IF EXISTS "Allow users to insert assessments" ON assessments;

-- Create new policy that allows anyone to insert
CREATE POLICY "Allow anyone to insert assessments"
  ON assessments
  FOR INSERT
  TO public
  WITH CHECK (true);