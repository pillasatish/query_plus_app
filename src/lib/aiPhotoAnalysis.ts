import { z } from 'zod';
import { uploadImage, analyzeImage as callSupabaseAnalyzeImage, ImageAnalysisResult as SupabaseImageAnalysisResult } from './imageAnalysis';

// Define the analysis result schema
const AnalysisResultSchema = z.object({
  severity: z.number().min(0).max(4),
  findings: z.array(z.string()),
  recommendations: z.array(z.string()),
  confidence: z.number().min(0).max(1),
  detailed_analysis: z.string(),
  risk_factors: z.array(z.string()).optional(),
  treatment_urgency: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export type PhotoAnalysisResult = z.infer<typeof AnalysisResultSchema>;

interface PatientInfo {
  name: string;
  age: string;
  location: string;
}

interface SymptomAnswers {
  spiderVeins: string;
  painAndHeaviness: string;
  bulgingVeins: string;
  skinDiscoloration: string;
  ulcers: string;
  duration: string;
  longHours: string;
  dvtHistory: string;
  familyHistory: string;
  previousTreatments: string[];
  existingConditions: string[];
  medications: string[];
}

export class AIPhotoAnalyzer {
  constructor() {
    // Using Supabase Edge Function for AI analysis
  }

  async analyzeImage(
    imageFile: File,
    patientInfo: PatientInfo,
    symptoms: SymptomAnswers
  ): Promise<PhotoAnalysisResult> {
    try {
      // Upload image to get public URL
      const imageUrl = await uploadImage(imageFile);
      
      // Call Supabase AI analysis
      const result = await callSupabaseAnalyzeImage(imageUrl);
      
      // Transform the Supabase response to our format
      return this.transformSupabaseResponse(result, symptoms);
    } catch (error) {
      console.error('Supabase AI Analysis Error:', error);
      
      // Fallback to symptom-based analysis
      return this.generateFallbackAnalysis(symptoms);
    }
  }

  private transformSupabaseResponse(
    supabaseResult: SupabaseImageAnalysisResult,
    symptoms: SymptomAnswers
  ): PhotoAnalysisResult {
    // Convert boolean findings object to array of strings
    const findings: string[] = [];
    if (supabaseResult.findings.varicose_veins) findings.push('Varicose veins detected');
    if (supabaseResult.findings.spider_veins) findings.push('Spider veins present');
    if (supabaseResult.findings.skin_discoloration) findings.push('Skin discoloration observed');
    if (supabaseResult.findings.swelling) findings.push('Swelling detected');
    if (supabaseResult.findings.ulcers) findings.push('Ulcers or wounds present');
    if (supabaseResult.findings.bulging_veins) findings.push('Bulging veins identified');
    
    // If no findings, add a default message
    if (findings.length === 0) {
      findings.push('No significant abnormalities detected');
    }
    
    // Generate recommendations based on severity
    const recommendations = this.generateRecommendations(supabaseResult.severity);
    
    return {
      severity: supabaseResult.severity,
      findings,
      recommendations,
      confidence: supabaseResult.confidence,
      detailed_analysis: supabaseResult.analysis,
      risk_factors: this.identifyRiskFactors(symptoms),
      treatment_urgency: this.determineTreatmentUrgency(supabaseResult.severity)
    };
  }

  private generateRecommendations(severity: number): string[] {
    switch (severity) {
      case 4:
        return [
          'Immediate medical consultation required',
          'Wound care and ulcer management',
          'Consider surgical intervention',
          'Compression therapy under medical supervision'
        ];
      case 3:
        return [
          'Schedule consultation within 2-3 weeks',
          'Endovenous laser treatment (EVLT)',
          'Radiofrequency ablation (RFA)',
          'Medical-grade compression stockings'
        ];
      case 2:
        return [
          'Sclerotherapy treatment',
          'Lifestyle modifications',
          'Regular exercise program',
          'Compression therapy'
        ];
      case 1:
        return [
          'Monitor symptoms regularly',
          'Lifestyle changes and exercise',
          'Consider cosmetic sclerotherapy',
          'Preventive compression stockings'
        ];
      default:
        return [
          'Continue healthy lifestyle',
          'Regular monitoring',
          'Preventive measures'
        ];
    }
  }

  private identifyRiskFactors(symptoms: SymptomAnswers): string[] {
    const riskFactors: string[] = [];
    
    if (symptoms.familyHistory === 'yes') riskFactors.push('Family history of varicose veins');
    if (symptoms.longHours === 'yes') riskFactors.push('Prolonged standing or sitting');
    if (symptoms.dvtHistory === 'yes') riskFactors.push('Previous DVT history');
    if (symptoms.existingConditions.includes('Obesity')) riskFactors.push('Obesity');
    if (symptoms.existingConditions.includes('Diabetes')) riskFactors.push('Diabetes');
    
    return riskFactors;
  }

  private determineTreatmentUrgency(severity: number): 'low' | 'medium' | 'high' | 'urgent' {
    switch (severity) {
      case 4: return 'urgent';
      case 3: return 'high';
      case 2: return 'medium';
      default: return 'low';
    }
  }

  private generateFallbackAnalysis(symptoms: SymptomAnswers): PhotoAnalysisResult {
    let severity = 0;
    const findings: string[] = [];
    
    // Calculate severity based on symptoms
    if (symptoms.ulcers === 'yes') {
      severity = 4;
      findings.push('Ulcers reported by patient');
    } else if (symptoms.bulgingVeins === 'yes' || symptoms.skinDiscoloration === 'yes') {
      severity = 3;
      findings.push('Advanced symptoms reported');
    } else if (symptoms.painAndHeaviness === 'yes') {
      severity = 2;
      findings.push('Moderate symptoms reported');
    } else if (symptoms.spiderVeins === 'yes') {
      severity = 1;
      findings.push('Mild symptoms reported');
    }

    return {
      severity,
      findings,
      recommendations: this.generateRecommendations(severity),
      confidence: 0.6, // Lower confidence for fallback
      detailed_analysis: 'Analysis based on reported symptoms (AI service unavailable)',
      risk_factors: this.identifyRiskFactors(symptoms),
      treatment_urgency: this.determineTreatmentUrgency(severity)
    };
  }
}

// Factory function to create analyzer instance
export function createPhotoAnalyzer(): AIPhotoAnalyzer {
  return new AIPhotoAnalyzer();
}