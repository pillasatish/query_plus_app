/*
  # Update assessments table with patient information and AI assessment fields

  1. Changes
    - Add patient information columns
    - Add AI assessment fields
    - Add medical history fields
    - Add risk assessment fields

  2. Security
    - Maintains existing RLS policies
    - Data remains protected and accessible only to authenticated users
*/

DO $$ 
BEGIN
  -- Add patient information columns
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'assessments' AND column_name = 'patient_name'
  ) THEN
    ALTER TABLE assessments 
      ADD COLUMN patient_name text,
      ADD COLUMN patient_age integer,
      ADD COLUMN patient_location text,
      ADD COLUMN gender text,
      ADD COLUMN existing_conditions text[],
      ADD COLUMN medications text[],
      ADD COLUMN risk_level text,
      ADD COLUMN ai_confidence_score decimal,
      ADD COLUMN symptoms_json jsonb,
      ADD COLUMN assessment_date timestamptz DEFAULT now(),
      ADD COLUMN follow_up_date timestamptz,
      ADD COLUMN treatment_plan jsonb;
  END IF;
END $$;