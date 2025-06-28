export interface Assessment {
  id: string;
  created_at: string;
  patient_name: string;
  patient_age: number;
  patient_location: string;
  gender: string;
  existing_conditions: string[];
  medications: string[];
  spider_veins: string;
  pain_and_heaviness: string;
  bulging_veins: string;
  skin_discoloration: string;
  ulcers: string;
  duration: string;
  long_hours: string;
  dvt_history: string;
  family_history: string;
  previous_treatments: string[];
  severity_level: number;
  risk_level: string;
  ai_confidence_score: number;
  symptoms_json: {
    primary: string[];
    secondary: string[];
    severity: Record<string, number>;
  };
  recommendation: string;
  assessment_date: string;
  follow_up_date?: string;
  treatment_plan?: {
    recommended_treatments: string[];
    lifestyle_changes: string[];
    medications: string[];
    follow_up_schedule: string;
  };
}