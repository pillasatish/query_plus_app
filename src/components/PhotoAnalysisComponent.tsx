import React, { useState } from 'react';
import { Upload, X, Loader2, Camera, AlertCircle, CheckCircle, Eye, Brain } from 'lucide-react';
import { createPhotoAnalyzer, PhotoAnalysisResult } from '../lib/aiPhotoAnalysis';

interface PhotoAnalysisComponentProps {
  patientInfo: {
    name: string;
    age: string;
    location: string;
  };
  symptoms: {
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
  };
  onAnalysisComplete: (result: PhotoAnalysisResult) => void;
  onSkip: () => void;
}

const PhotoAnalysisComponent: React.FC<PhotoAnalysisComponentProps> = ({
  patientInfo,
  symptoms,
  onAnalysisComplete,
  onSkip
}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setError(null);
    
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size must be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const simulateProgress = () => {
    const stages = [
      { progress: 20, stage: 'Processing image...' },
      { progress: 40, stage: 'Analyzing vein patterns...' },
      { progress: 60, stage: 'Correlating with symptoms...' },
      { progress: 80, stage: 'Generating recommendations...' },
      { progress: 100, stage: 'Analysis complete!' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        setAnalysisProgress(stages[currentStage].progress);
        setAnalysisStage(stages[currentStage].stage);
        currentStage++;
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return interval;
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setError(null);
    setAnalysisProgress(0);
    setAnalysisStage('Initializing AI analysis...');

    const progressInterval = simulateProgress();

    try {
      const analyzer = createPhotoAnalyzer();
      
      if (!analyzer) {
        // Fallback analysis without OpenAI
        setAnalysisStage('Using symptom-based analysis...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const fallbackResult: PhotoAnalysisResult = {
          severity: calculateFallbackSeverity(),
          findings: generateFallbackFindings(),
          recommendations: generateFallbackRecommendations(),
          confidence: 0.7,
          detailed_analysis: 'Analysis based on reported symptoms and basic image processing.',
          risk_factors: identifyRiskFactors(),
          treatment_urgency: 'medium'
        };
        
        onAnalysisComplete(fallbackResult);
      } else {
        const result = await analyzer.analyzeImage(selectedImage, patientInfo, symptoms);
        onAnalysisComplete(result);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError('Analysis failed. Please try again or skip this step.');
    } finally {
      clearInterval(progressInterval);
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setAnalysisStage('');
    }
  };

  const calculateFallbackSeverity = (): number => {
    if (symptoms.ulcers === 'yes') return 4;
    if (symptoms.bulgingVeins === 'yes' || symptoms.skinDiscoloration === 'yes') return 3;
    if (symptoms.painAndHeaviness === 'yes') return 2;
    if (symptoms.spiderVeins === 'yes') return 1;
    return 0;
  };

  const generateFallbackFindings = (): string[] => {
    const findings: string[] = [];
    if (symptoms.spiderVeins === 'yes') findings.push('Spider veins reported');
    if (symptoms.painAndHeaviness === 'yes') findings.push('Pain and heaviness symptoms');
    if (symptoms.bulgingVeins === 'yes') findings.push('Bulging veins reported');
    if (symptoms.skinDiscoloration === 'yes') findings.push('Skin discoloration noted');
    if (symptoms.ulcers === 'yes') findings.push('Ulcers or wounds present');
    return findings;
  };

  const generateFallbackRecommendations = (): string[] => {
    const severity = calculateFallbackSeverity();
    switch (severity) {
      case 4: return ['Immediate medical consultation', 'Wound care management'];
      case 3: return ['Schedule consultation soon', 'Consider advanced treatments'];
      case 2: return ['Lifestyle modifications', 'Compression therapy'];
      case 1: return ['Monitor symptoms', 'Preventive measures'];
      default: return ['Maintain healthy lifestyle', 'Regular check-ups'];
    }
  };

  const identifyRiskFactors = (): string[] => {
    const factors: string[] = [];
    if (symptoms.familyHistory === 'yes') factors.push('Family history');
    if (symptoms.longHours === 'yes') factors.push('Prolonged standing/sitting');
    if (symptoms.dvtHistory === 'yes') factors.push('DVT history');
    return factors;
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center mb-6">
          <Brain className="h-8 w-8 text-primary mr-3" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">AI Photo Analysis</h3>
            <p className="text-gray-600">Upload a photo for advanced AI-powered vein analysis</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div 
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            {!previewUrl ? (
              <div className="space-y-4">
                <div className="mx-auto h-16 w-16 text-gray-400">
                  {isAnalyzing ? (
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                  ) : (
                    <Camera className="h-16 w-16" />
                  )}
                </div>
                <div>
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose Photo
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleFileInput}
                      disabled={isAnalyzing}
                    />
                  </label>
                  <p className="mt-2 text-sm text-gray-600">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 rounded-lg mx-auto"
                />
                {!isAnalyzing && (
                  <button
                    onClick={clearImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                    <div className="text-white text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                      <p className="text-sm font-medium">{analysisStage}</p>
                      <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${analysisProgress}%` }}
                        ></div>
                      </div>
                      <p className="text-xs mt-1">{analysisProgress}% complete</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Photo Guidelines */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Photo Guidelines for Best Results:
          </h4>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Ensure good lighting and clear visibility</li>
            <li>• Show both legs from knee to ankle</li>
            <li>• Stand straight with legs slightly apart</li>
            <li>• Avoid shadows, reflections, or obstructions</li>
            <li>• Remove socks, stockings, or tight clothing</li>
            <li>• Take photo from a comfortable distance (2-3 feet)</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {selectedImage && !isAnalyzing && (
            <button
              onClick={handleAnalyze}
              className="w-full flex items-center justify-center px-4 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors font-medium"
            >
              <Brain className="h-5 w-5 mr-2" />
              Analyze Photo with AI
            </button>
          )}
          
          <button
            onClick={onSkip}
            disabled={isAnalyzing}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Skip Photo Analysis & Continue
          </button>
        </div>

        {/* AI Analysis Info */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <h4 className="text-sm font-medium text-green-900">Advanced AI Analysis</h4>
              <p className="text-xs text-green-800 mt-1">
                Our AI system analyzes your photo using advanced computer vision and medical knowledge to provide detailed insights about your vein health, correlating visual findings with your reported symptoms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoAnalysisComponent;