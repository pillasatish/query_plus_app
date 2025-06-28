export interface PatientData {
  name: string;
  age: number;
  city: string;
  phone: string;
  timestamp: string;
}

export interface AssessmentData {
  visible_veins: string;
  ulcers: string;
  previous_treatment: string;
  has_image: boolean;
  ai_analysis?: AIAnalysis;
}

export interface AIAnalysis {
  confidence: number;
  findings: {
    varicose_veins: boolean;
    spider_veins: boolean;
    skin_discoloration: boolean;
    ulcers: boolean;
    swelling: boolean;
  };
  severity_adjustment: number;
}

export interface Recommendations {
  title: string;
  description: string;
  treatments: string[];
  next_steps: string[];
}

export interface AssessmentRecord extends PatientData, AssessmentData {
  severity: string;
  severity_level: number;
  recommendations: string;
}

export type Step = 'info' | 'assessment' | 'results' | 'admin';