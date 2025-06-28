import OpenAI from 'openai';
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

export class AIPhotoAnalyzer {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, this should be handled server-side
    });
  }

  async analyzeImage(
    imageFile: File,
    patientInfo: PatientInfo,
    symptoms: SymptomAnswers
  ): Promise<PhotoAnalysisResult> {
    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Create comprehensive prompt with patient context
      const prompt = this.createAnalysisPrompt(patientInfo, symptoms);
      
      const response = await this.openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are a specialized AI medical assistant trained in vascular medicine and varicose vein analysis. Analyze medical images with high precision and provide detailed, actionable insights."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.1, // Low temperature for consistent medical analysis
      });

      const analysisText = response.choices[0]?.message?.content;
      if (!analysisText) {
        throw new Error('No analysis received from AI');
      }

      // Parse the structured response
      const result = this.parseAnalysisResponse(analysisText, symptoms);
      
      // Validate the result
      return AnalysisResultSchema.parse(result);
    } catch (error) {
      console.error('AI Photo Analysis Error:', error);
      
      // Fallback to symptom-based analysis
      return this.generateFallbackAnalysis(symptoms);
    }
  }

  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  private createAnalysisPrompt(patientInfo: PatientInfo, symptoms: SymptomAnswers): string {
    return `
Please analyze this medical image of legs for varicose veins and related vascular conditions.

PATIENT CONTEXT:
- Name: ${patientInfo.name}
- Age: ${patientInfo.age}
- Location: ${patientInfo.location}

REPORTED SYMPTOMS:
- Spider veins: ${symptoms.spiderVeins}
- Pain and heaviness: ${symptoms.painAndHeaviness}
- Bulging veins: ${symptoms.bulgingVeins}
- Skin discoloration: ${symptoms.skinDiscoloration}
- Ulcers: ${symptoms.ulcers}
- Duration: ${symptoms.duration}
- Long hours standing/sitting: ${symptoms.longHours}
- DVT history: ${symptoms.dvtHistory}
- Family history: ${symptoms.familyHistory}
- Previous treatments: ${symptoms.previousTreatments.join(', ')}
- Existing conditions: ${symptoms.existingConditions.join(', ')}
- Current medications: ${symptoms.medications.join(', ')}

ANALYSIS REQUIREMENTS:
1. Examine the image for:
   - Varicose veins (enlarged, twisted veins)
   - Spider veins (small, web-like veins)
   - Skin discoloration or pigmentation changes
   - Swelling or edema
   - Ulcers or open wounds
   - Overall vein health

2. Provide your response in this exact JSON format:
{
  "severity": [0-4 integer scale],
  "findings": ["list of specific visual findings"],
  "recommendations": ["list of treatment recommendations"],
  "confidence": [0.0-1.0 confidence score],
  "detailed_analysis": "comprehensive analysis text",
  "risk_factors": ["identified risk factors"],
  "treatment_urgency": "low|medium|high|urgent"
}

SEVERITY SCALE:
- 0: No visible signs
- 1: Mild spider veins or early symptoms
- 2: Moderate symptoms with visible veins
- 3: Advanced varicose veins with complications
- 4: Severe condition with ulcers or major complications

Focus on accuracy and provide actionable medical insights while correlating visual findings with reported symptoms.
`;
  }

  private parseAnalysisResponse(analysisText: string, symptoms: SymptomAnswers): PhotoAnalysisResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed;
      }
    } catch (error) {
      console.warn('Failed to parse JSON response, using fallback parsing');
    }

    // Fallback parsing if JSON extraction fails
    return this.extractAnalysisFromText(analysisText, symptoms);
  }

  private extractAnalysisFromText(text: string, symptoms: SymptomAnswers): PhotoAnalysisResult {
    // Extract severity from text
    let severity = 0;
    if (text.toLowerCase().includes('severe') || text.toLowerCase().includes('ulcer')) {
      severity = 4;
    } else if (text.toLowerCase().includes('advanced') || text.toLowerCase().includes('significant')) {
      severity = 3;
    } else if (text.toLowerCase().includes('moderate')) {
      severity = 2;
    } else if (text.toLowerCase().includes('mild') || text.toLowerCase().includes('spider')) {
      severity = 1;
    }

    // Extract findings
    const findings: string[] = [];
    if (text.toLowerCase().includes('varicose')) findings.push('Varicose veins detected');
    if (text.toLowerCase().includes('spider')) findings.push('Spider veins present');
    if (text.toLowerCase().includes('discolor')) findings.push('Skin discoloration observed');
    if (text.toLowerCase().includes('swell')) findings.push('Swelling detected');
    if (text.toLowerCase().includes('ulcer')) findings.push('Ulcers or wounds present');

    // Generate recommendations based on severity
    const recommendations = this.generateRecommendations(severity);

    return {
      severity,
      findings,
      recommendations,
      confidence: 0.75,
      detailed_analysis: text,
      risk_factors: this.identifyRiskFactors(symptoms),
      treatment_urgency: this.determineTreatmentUrgency(severity)
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
      detailed_analysis: 'Analysis based on reported symptoms (image analysis unavailable)',
      risk_factors: this.identifyRiskFactors(symptoms),
      treatment_urgency: this.determineTreatmentUrgency(severity)
    };
  }
}

// Factory function to create analyzer instance
export function createPhotoAnalyzer(): AIPhotoAnalyzer | null {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.warn('OpenAI API key not found. Photo analysis will use fallback method.');
    return null;
  }
  
  return new AIPhotoAnalyzer(apiKey);
}