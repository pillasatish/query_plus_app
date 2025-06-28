import React, { useState } from 'react';
import { PatientData } from '../types';

interface PatientInfoProps {
  onNext: (data: PatientData) => void;
}

const PatientInfo: React.FC<PatientInfoProps> = ({ onNext }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    city: '',
    phone: ''
  });
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!formData.name.trim()) newErrors.push('Full Name is required');
    if (!formData.age || parseInt(formData.age) < 1 || parseInt(formData.age) > 120) {
      newErrors.push('Please enter a valid age between 1 and 120');
    }
    if (!formData.city.trim()) newErrors.push('City is required');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const patientData: PatientData = {
      name: formData.name.trim(),
      age: parseInt(formData.age),
      city: formData.city.trim(),
      phone: formData.phone.trim(),
      timestamp: new Date().toISOString()
    };

    onNext(patientData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl card-shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Patient Information</h2>
      
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <ul className="text-red-600 text-sm">
            {errors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age *
            </label>
            <input
              type="number"
              id="age"
              min="1"
              max="120"
              value={formData.age}
              onChange={(e) => handleInputChange('age', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="Enter your age"
            />
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-lg hover:shadow-lg transition-all duration-300"
        >
          Start Assessment
        </button>
      </form>
    </div>
  );
};

export default PatientInfo;