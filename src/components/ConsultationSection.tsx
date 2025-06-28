import React from 'react';
import { Calendar, Video, Clock, CreditCard } from 'lucide-react';

const ConsultationSection: React.FC = () => {
  const handleCall = () => {
    window.location.href = 'tel:+917093765543';
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Book a Consultation</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Video Consultation</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Video className="h-5 w-5 text-primary mr-3" />
                <span className="text-gray-600">Speak with a specialist from home</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-3" />
                <span className="text-gray-600">15-minute consultation</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary mr-3" />
                <span className="text-gray-600">₹499 only</span>
              </div>
            </div>
            <button
              onClick={handleCall}
              className="mt-6 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Book Now
            </button>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">In-Clinic Consultation</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-primary mr-3" />
                <span className="text-gray-600">Visit our clinic in person</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-primary mr-3" />
                <span className="text-gray-600">30-minute consultation</span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-primary mr-3" />
                <span className="text-gray-600">₹999 only</span>
              </div>
            </div>
            <button
              onClick={handleCall}
              className="mt-6 w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConsultationSection;