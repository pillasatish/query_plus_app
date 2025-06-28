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

export async function analyzeImage(imageUrl: string): Promise<ImageAnalysisResult> {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to analyze image');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
}