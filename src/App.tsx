import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import Header from './components/Header';
import PatientInfo from './components/PatientInfo';
import Assessment from './components/Assessment';
import Results from './components/Results';
import AdminPanel from './components/AdminPanel';
import { PatientData, AssessmentData, AssessmentRecord, Step } from './types';
import { saveAssessment } from './utils/storage';

function App() {
  const [currentStep, setCurrentStep] = useState<Step>('info');
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);

  const handlePatientInfoNext = (data: PatientData) => {
    setPatientData(data);
    setCurrentStep('assessment');
  };

  const handleAssessmentNext = (data: AssessmentData) => {
    setAssessmentData(data);
    setCurrentStep('results');
  };

  const handleAssessmentBack = () => {
    setCurrentStep('info');
  };

  const handleNewAssessment = () => {
    setPatientData(null);
    setAssessmentData(null);
    setCurrentStep('info');
  };

  const handleShowAdmin = () => {
    setCurrentStep('admin');
  };

  const handleBackFromAdmin = () => {
    setCurrentStep('info');
  };

  // Save assessment when showing results
  React.useEffect(() => {
    if (currentStep === 'results' && patientData && assessmentData) {
      const record: AssessmentRecord = {
        ...patientData,
        ...assessmentData,
        severity: 'Medium', // This will be calculated in Results component
        severity_level: 2,
        recommendations: JSON.stringify({})
      };
      saveAssessment(record);
    }
  }, [currentStep, patientData, assessmentData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      {/* Admin Button */}
      <div className="fixed top-4 right-4 z-10">
        <button
          onClick={handleShowAdmin}
          className="bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          title="Admin Panel"
        >
          <Settings size={24} className="text-gray-600" />
        </button>
      </div>

      <div className="container mx-auto px-4 pb-8">
        {currentStep === 'info' && (
          <PatientInfo onNext={handlePatientInfoNext} />
        )}

        {currentStep === 'assessment' && patientData && (
          <Assessment
            patientName={patientData.name}
            onNext={handleAssessmentNext}
            onBack={handleAssessmentBack}
          />
        )}

        {currentStep === 'results' && patientData && assessmentData && (
          <Results
            patientData={patientData}
            assessmentData={assessmentData}
            onNewAssessment={handleNewAssessment}
          />
        )}

        {currentStep === 'admin' && (
          <AdminPanel onBack={handleBackFromAdmin} />
        )}
      </div>
    </div>
  );
}

export default App;