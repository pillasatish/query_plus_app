import { z } from 'zod';

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

// External AI service response interface
interface ExternalAIResponse {
  prediction: string;
  confidence: number;
  analysis?: string;
  recommendations?: string[];
  severity?: number;
}

export class AIPhotoAnalyzer {
  private externalApiUrl: string;

  constructor() {
    // Use the external varicose veins AI service
    this.externalApiUrl = 'https://varicose-veins.vercel.app/api/analyze';
  }

  async analyzeImage(
    imageFile: File,
    patientInfo: PatientInfo,
    symptoms: SymptomAnswers
  ): Promise<PhotoAnalysisResult> {
    try {
      // Call the external AI service
      const result = await this.callExternalAI(imageFile, patientInfo, symptoms);
      
      // Transform the external response to our format
      return this.transformExternalResponse(result, symptoms);
    } catch (error) {
      console.error('External AI Analysis Error:', error);
      
      // Fallback to symptom-based analysis
      return this.generateFallbackAnalysis(symptoms);
    }
  }

  private async callExternalAI(
    imageFile: File,
    patientInfo: PatientInfo,
    symptoms: SymptomAnswers
  ): Promise<ExternalAIResponse> {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    // Add patient context as metadata
    formData.append('patientInfo', JSON.stringify({
      age: patientInfo.age,
      location: patientInfo.location,
      symptoms: symptoms
    }));

    const response = await fetch(this.externalApiUrl, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type header - let browser set it for FormData
      }
    });

    if (!response.ok) {
      throw new Error(`External AI service error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  }

  private transformExternalResponse(
    externalResult: ExternalAIResponse,
    symptoms: SymptomAnswers
  ): PhotoAnalysisResult {
    // Map external prediction to our severity scale
    const severity = this.mapPredictionToSeverity(externalResult.prediction, externalResult.severity);
    
    // Extract findings from prediction and analysis
    const findings = this.extractFindings(externalResult.prediction, externalResult.analysis);
    
    // Generate recommendations based on external result
    const recommendations = externalResult.recommendations || this.generateRecommendations(severity);
    
    return {
      severity,
      findings,
      recommendations,
      confidence: externalResult.confidence || 0.8,
      detailed_analysis: externalResult.analysis || `AI Analysis: ${externalResult.prediction}`,
      risk_factors: this.identifyRiskFactors(symptoms),
      treatment_urgency: this.determineTreatmentUrgency(severity)
    };
  }

  private mapPredictionToSeverity(prediction: string, severityFromAPI?: number): number {
    // If the external API provides severity directly, use it
    if (severityFromAPI !== undefined && severityFromAPI >= 0 && severityFromAPI <= 4) {
      return severityFromAPI;
    }

    // Map prediction text to severity levels
    const predictionLower = prediction.toLowerCase();
    
    if (predictionLower.includes('severe') || predictionLower.includes('ulcer') || predictionLower.includes('stage 4')) {
      return 4;
    } else if (predictionLower.includes('advanced') || predictionLower.includes('significant') || predictionLower.includes('stage 3')) {
      return 3;
    } else if (predictionLower.includes('moderate') || predictionLower.includes('stage 2')) {
      return 2;
    } else if (predictionLower.includes('mild') || predictionLower.includes('spider') || predictionLower.includes('stage 1')) {
      return 1;
    } else if (predictionLower.includes('normal') || predictionLower.includes('healthy') || predictionLower.includes('no signs')) {
      return 0;
    }
    
    // Default to mild if unclear
    return 1;
  }

  private extractFindings(prediction: string, analysis?: string): string[] {
    const findings: string[] = [];
    const text = `${prediction} ${analysis || ''}`.toLowerCase();
    
    if (text.includes('varicose')) findings.push('Varicose veins detected');
    if (text.includes('spider')) findings.push('Spider veins present');
    if (text.includes('discolor') || text.includes('pigment')) findings.push('Skin discoloration observed');
    if (text.includes('swell') || text.includes('edema')) findings.push('Swelling detected');
    if (text.includes('ulcer') || text.includes('wound')) findings.push('Ulcers or wounds present');
    if (text.includes('bulg') || text.includes('protrude')) findings.push('Bulging veins identified');
    if (text.includes('normal') || text.includes('healthy')) findings.push('No significant abnormalities detected');
    
    // If no specific findings, use the prediction as a finding
    if (findings.length === 0) {
      findings.push(prediction);
    }
    
    return findings;
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
      detailed_analysis: 'Analysis based on reported symptoms (external AI service unavailable)',
      risk_factors: this.identifyRiskFactors(symptoms),
      treatment_urgency: this.determineTreatmentUrgency(severity)
    };
  }
}

// Factory function to create analyzer instance
export function createPhotoAnalyzer(): AIPhotoAnalyzer {
  return new AIPhotoAnalyzer();
}