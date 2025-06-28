import React from 'react';
import { Phone, Mail, RotateCcw } from 'lucide-react';
import { PatientData, AssessmentData } from '../types';
import { calculateSeverity, getRecommendations } from '../utils/assessment';

interface ResultsProps {
  patientData: PatientData;
  assessmentData: AssessmentData;
  onNewAssessment: () => void;
}

const Results: React.FC<ResultsProps> = ({ patientData, assessmentData, onNewAssessment }) => {
  let [severity, level] = calculateSeverity(assessmentData);

  // Adjust severity based on AI analysis if available
  if (assessmentData.ai_analysis) {
    const aiData = assessmentData.ai_analysis;
    if (aiData.findings.ulcers) {
      severity = 'High';
      level = 4;
    } else if (aiData.findings.varicose_veins) {
      level = Math.min(level + aiData.severity_adjustment, 4);
      if (level >= 3) {
        severity = 'High';
      }
    }
  }

  const recommendations = getRecommendations(severity, level);
  const severityClass = `severity-${severity.toLowerCase()}`;

  const handleBookConsultation = () => {
    alert('Redirecting to consultation booking...');
  };

  const handleEmailResults = () => {
    alert('Results will be emailed to you!');
  };

  return (
    <div className={`bg-white p-8 rounded-2xl card-shadow max-w-4xl mx-auto ${severityClass}`}>
      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🎯 Assessment Results</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-primary-600">Level {level}</div>
          <div className="text-sm text-gray-600">Severity Level</div>
        </div>
        <div className="text-center p-4 bg-white rounded-lg shadow-sm">
          <div className="text-2xl font-bold text-primary-600">{severity}</div>
          <div className="text-sm text-gray-600">Risk Category</div>
        </div>
        {assessmentData.ai_analysis && (
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="text-2xl font-bold text-primary-600">
              {Math.round(assessmentData.ai_analysis.confidence * 100)}%
            </div>
            <div className="text-sm text-gray-600">AI Confidence</div>
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">{recommendations.title}</h3>
        <p className="text-gray-700 mb-6">{recommendations.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Recommended Treatments:</h4>
            <ul className="space-y-2">
              {recommendations.treatments.map((treatment, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span className="text-gray-700">{treatment}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Next Steps:</h4>
            <ul className="space-y-2">
              {recommendations.next_steps.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary-500 mr-2">•</span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {assessmentData.ai_analysis && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">AI Image Analysis Results:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-700 mb-3">Detected Conditions:</h5>
              <ul className="space-y-1">
                {Object.entries(assessmentData.ai_analysis.findings).map(([condition, detected]) => (
                  <li key={condition} className="flex items-center text-sm">
                    <span className={`mr-2 ${detected ? 'text-green-600' : 'text-red-600'}`}>
                      {detected ? '✅' : '❌'}
                    </span>
                    <span className="text-gray-700">
                      {condition.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: {detected ? 'Detected' : 'Not detected'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-700 mb-3">Analysis Details:</h5>
              <p className="text-sm text-gray-600">
                <strong>Analysis Confidence:</strong> {Math.round(assessmentData.ai_analysis.confidence * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleBookConsultation}
          className="flex items-center justify-center gap-2 bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
        >
          <Phone size={20} />
          Book Consultation
        </button>

        <button
          onClick={handleEmailResults}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Mail size={20} />
          Email Results
        </button>

        <button
          onClick={onNewAssessment}
          className="flex items-center justify-center gap-2 btn-primary text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          <RotateCcw size={20} />
          New Assessment
        </button>
      </div>
    </div>
  );
};

export default Results;