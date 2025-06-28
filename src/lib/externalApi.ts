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

export interface PhotoAnalysisResult {
  severity: number;
  findings: string[];
  recommendations: string[];
  confidence: number;
  report_url?: string;
  analysis_id?: string;
}

export async function analyzePhotoWithExternalAPI(
  imageFile: File,
  patientInfo: PatientInfo,
  symptoms: SymptomAnswers
): Promise<PhotoAnalysisResult> {
  try {
    // Create FormData to send the image and patient data
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('patientInfo', JSON.stringify(patientInfo));
    formData.append('symptoms', JSON.stringify(symptoms));
    formData.append('timestamp', new Date().toISOString());

    // Send to external API
    const response = await fetch('https://varicose-veins.vercel.app/api/analyze', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Validate the response structure
    if (!result || typeof result.severity !== 'number') {
      throw new Error('Invalid response format from analysis API');
    }

    return {
      severity: result.severity || 0,
      findings: result.findings || [],
      recommendations: result.recommendations || [],
      confidence: result.confidence || 0.5,
      report_url: result.report_url,
      analysis_id: result.analysis_id,
    };
  } catch (error) {
    console.error('Error calling external API:', error);
    
    // Fallback analysis based on symptoms if API fails
    return generateFallbackAnalysis(symptoms);
  }
}

function generateFallbackAnalysis(symptoms: SymptomAnswers): PhotoAnalysisResult {
  let severity = 0;
  const findings: string[] = [];
  const recommendations: string[] = [];

  // Basic severity calculation based on symptoms
  if (symptoms.ulcers === 'yes') {
    severity = 4;
    findings.push('Potential ulcers or wounds detected');
    recommendations.push('Immediate medical attention required');
  } else if (symptoms.bulgingVeins === 'yes' || symptoms.skinDiscoloration === 'yes') {
    severity = 3;
    findings.push('Advanced varicose vein symptoms');
    recommendations.push('Schedule consultation within 2-3 weeks');
  } else if (symptoms.painAndHeaviness === 'yes') {
    severity = 2;
    findings.push('Moderate vein-related symptoms');
    recommendations.push('Consider compression therapy and lifestyle changes');
  } else if (symptoms.spiderVeins === 'yes') {
    severity = 1;
    findings.push('Mild spider veins or early symptoms');
    recommendations.push('Monitor symptoms and consider preventive measures');
  }

  return {
    severity,
    findings,
    recommendations,
    confidence: 0.7, // Lower confidence for fallback analysis
  };
}

export async function uploadImageToExternalService(imageFile: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch('https://varicose-veins.vercel.app/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image to external service');
    }

    const result = await response.json();
    return result.imageUrl || result.url;
  } catch (error) {
    console.error('Error uploading to external service:', error);
    throw error;
  }
}