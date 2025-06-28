import React, { useState } from 'react';
import { AssessmentData } from '../types';
import { mockAIAnalysis } from '../utils/assessment';

interface AssessmentProps {
  patientName: string;
  onNext: (data: AssessmentData) => void;
  onBack: () => void;
}

const Assessment: React.FC<AssessmentProps> = ({ patientName, onNext, onBack }) => {
  const [answers, setAnswers] = useState({
    visible_veins: '',
    ulcers: '',
    previous_treatment: ''
  });
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const assessmentData: AssessmentData = {
      visible_veins: answers.visible_veins,
      ulcers: answers.ulcers,
      previous_treatment: answers.previous_treatment,
      has_image: uploadedImage !== null
    };

    if (uploadedImage) {
      assessmentData.ai_analysis = mockAIAnalysis(uploadedImage);
    }

    onNext(assessmentData);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedImage(file);
    }
  };

  const isFormValid = answers.visible_veins && answers.ulcers && answers.previous_treatment;

  return (
    <div className="bg-white p-8 rounded-2xl card-shadow max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment for {patientName}</h2>
      <p className="text-gray-600 mb-8">Please answer the following questions:</p>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              1. Do you see any veins visible on your legs?
            </h3>
            <div className="flex gap-4">
              {['Yes', 'No'].map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="visible_veins"
                    value={option}
                    checked={answers.visible_veins === option}
                    onChange={(e) => setAnswers(prev => ({ ...prev, visible_veins: e.target.value }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              2. Do you have open sores, ulcers, or non-healing wounds on your legs?
            </h3>
            <div className="flex gap-4">
              {['Yes', 'No'].map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="ulcers"
                    value={option}
                    checked={answers.ulcers === option}
                    onChange={(e) => setAnswers(prev => ({ ...prev, ulcers: e.target.value }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              3. Have you done any treatment for varicose veins previously?
            </h3>
            <div className="flex gap-4">
              {['Yes', 'No'].map((option) => (
                <label key={option} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="previous_treatment"
                    value={option}
                    checked={answers.previous_treatment === option}
                    onChange={(e) => setAnswers(prev => ({ ...prev, previous_treatment: e.target.value }))}
                    className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Optional: Upload a photo of your legs for AI analysis
            </h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <div className="text-gray-500">
                  <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-sm">
                    {uploadedImage ? uploadedImage.name : 'Click to upload an image'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, JPEG up to 10MB</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={!isFormValid}
            className="flex-1 btn-primary text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
          >
            Get Results
          </button>
        </div>
      </form>
    </div>
  );
};

export default Assessment;