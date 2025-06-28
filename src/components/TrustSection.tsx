import React from 'react';
import { Shield } from 'lucide-react';

const TrustSection: React.FC = () => {
  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-purple-600" />
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Trusted by 10,000+ Patients</h2>
          <p className="mt-4 text-lg text-gray-500">Leading hospitals and doctors trust QurePlus for varicose vein treatment</p>
        </div>
      </div>
    </div>
  );
};

export default TrustSection;