import React from 'react';
import { Syringe, Zap, Ban as Bandage, Activity } from 'lucide-react';

const TreatmentsSection: React.FC = () => {
  const treatments = [
    {
      icon: <Syringe className="h-8 w-8 text-primary" />,
      name: "Sclerotherapy",
      description: "A minimally invasive procedure that involves injecting a solution directly into the affected veins.",
      benefits: ["Quick procedure", "Minimal downtime", "High success rate"]
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      name: "Endovenous Laser Treatment",
      description: "Uses laser energy to heat and close problematic veins, redirecting blood flow to healthy veins.",
      benefits: ["No surgical incisions", "Local anesthesia only", "Return to activities quickly"]
    },
    {
      icon: <Bandage className="h-8 w-8 text-primary" />,
      name: "Compression Therapy",
      description: "Conservative treatment using specialized stockings to improve blood flow and reduce symptoms.",
      benefits: ["Non-invasive", "Can be done at home", "Preventive benefits"]
    },
    {
      icon: <Activity className="h-8 w-8 text-primary" />,
      name: "VenaSeal™",
      description: "Advanced closure system using medical adhesive to seal affected veins permanently.",
      benefits: ["No heat or tumescence", "Single treatment", "Immediate results"]
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Treatments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {treatments.map((treatment, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="mb-4">{treatment.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{treatment.name}</h3>
              <p className="text-gray-600 mb-4">{treatment.description}</p>
              <ul className="space-y-2">
                {treatment.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center text-sm text-gray-600">
                    <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatmentsSection;