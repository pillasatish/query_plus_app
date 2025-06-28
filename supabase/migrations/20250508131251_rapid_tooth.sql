/*
  # Add AI analysis fields to assessments table

  1. Changes
    - Add image_analysis_results column for storing AI analysis data
    - Add image_analysis_confidence column for AI confidence score
    - Add image_analysis_timestamp column for tracking when analysis was performed

  2. Security
    - Maintains existing RLS policies
    - No additional security changes needed
*/

ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS image_analysis_results jsonb,
ADD COLUMN IF NOT EXISTS image_analysis_confidence decimal,
ADD COLUMN IF NOT EXISTS image_analysis_timestamp timestamptz;