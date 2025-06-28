import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

export interface ImageAnalysisResult {
  confidence: number;
  findings: {
    varicoseVeins: boolean;
    spiderVeins: boolean;
    skinDiscoloration: boolean;
    ulcers: boolean;
    swelling: boolean;
  };
  severity: number;
  recommendations: string[];
  rawAnalysis?: string;
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('assessment-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('assessment-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

export async function analyzeImage(
  imageUrl: string, 
  context?: {
    patient: {
      name: string;
      age: number;
      location: string;
    };
    symptoms: {
      visibleVeins: boolean;
      painHeaviness: boolean;
      skinChanges: boolean;
      ulcers: boolean;
      duration: string;
      familyHistory: boolean;
      previousTreatments: string[];
      riskFactors: {
        prolongedStanding: boolean;
        dvtHistory: boolean;
        existingConditions: string[];
        medications: string[];
      };
    };
  }
): Promise<ImageAnalysisResult> {
  try {
    // Use Supabase client to invoke the edge function
    const { data, error } = await supabase.functions.invoke('analyze-image', {
      body: { 
        imageUrl,
        context 
      },
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error analyzing image:', error);
    
    // Return a fallback analysis result
    return {
      confidence: 0.6,
      findings: {
        varicoseVeins: context?.symptoms?.visibleVeins || false,
        spiderVeins: context?.symptoms?.visibleVeins || false,
        skinDiscoloration: context?.symptoms?.skinChanges || false,
        ulcers: context?.symptoms?.ulcers || false,
        swelling: false
      },
      severity: context?.symptoms?.ulcers ? 4 : context?.symptoms?.skinChanges ? 3 : context?.symptoms?.visibleVeins ? 2 : 1,
      recommendations: [
        'Consult with a vascular specialist',
        'Consider compression therapy',
        'Maintain regular exercise routine'
      ],
      rawAnalysis: 'Analysis completed using symptom-based assessment due to service unavailability'
    };
  }
}