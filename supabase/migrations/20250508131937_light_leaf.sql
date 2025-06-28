ALTER TABLE assessments
ADD COLUMN IF NOT EXISTS image_analysis_results jsonb,
ADD COLUMN IF NOT EXISTS image_analysis_confidence decimal,
ADD COLUMN IF NOT EXISTS image_analysis_timestamp timestamptz;