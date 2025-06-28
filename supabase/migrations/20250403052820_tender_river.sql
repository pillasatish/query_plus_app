/*
  # Create assessments table for storing user responses

  1. New Tables
    - `assessments`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with timezone)
      - `spider_veins` (text)
      - `pain_and_heaviness` (text)
      - `bulging_veins` (text)
      - `skin_discoloration` (text)
      - `ulcers` (text)
      - `duration` (text)
      - `long_hours` (text)
      - `dvt_history` (text)
      - `family_history` (text)
      - `previous_treatments` (text[])
      - `severity_level` (integer)
      - `recommendation` (text)
      - `image_url` (text, nullable)

  2. Security
    - Enable RLS on `assessments` table
    - Add policy for authenticated users to read all assessments
    - Add policy for authenticated users to insert their own assessments
*/

CREATE TABLE assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  spider_veins text NOT NULL,
  pain_and_heaviness text NOT NULL,
  bulging_veins text NOT NULL,
  skin_discoloration text NOT NULL,
  ulcers text NOT NULL,
  duration text NOT NULL,
  long_hours text NOT NULL,
  dvt_history text NOT NULL,
  family_history text NOT NULL,
  previous_treatments text[] NOT NULL,
  severity_level integer NOT NULL,
  recommendation text NOT NULL,
  image_url text
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all users to read assessments"
  ON assessments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow users to insert assessments"
  ON assessments
  FOR INSERT
  TO authenticated
  WITH CHECK (true);