import React from 'react';
import { Brain, Stethoscope, Bot, ArrowRight } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: <Brain className="h-12 w-12 text-primary" />,
      title: "AI Analysis",
      description: "Our advanced AI system analyzes your symptoms and medical history in real-time",
      details: [
        "Symptom pattern recognition",
        "Risk factor analysis",
        "Condition severity assessment"
      ]
    },
    {
      icon: <Bot className="h-12 w-12 text-primary" />,
      title: "Smart Recommendations",
      description: "Get personalized treatment recommendations based on AI insights",
      details: [
        "Treatment options comparison",
        "Success rate predictions",
        "Cost-benefit analysis"
      ]
    },
    {
      icon: <Stethoscope className="h-12 w-12 text-primary" />,
      title: "Expert Verification",
      description: "AI-matched specialists review and confirm your treatment plan",
      details: [
        "Specialist matching",
        "Treatment customization",
        "Ongoing progress monitoring"
      ]
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Bot className="h-5 w-5 text-primary mr-2" />
            <span className="text-primary font-semibold">AI-Driven Process</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">How Our AI Works</h2>
          <p className="mt-4 text-lg text-gray-600">Experience seamless healthcare with our intelligent system</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="absolute -inset-4 bg-primary/10 rounded-full animate-pulse"></div>
                    {step.icon}
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">{step.title}</h3>
                <p className="text-gray-600 mb-4 text-center">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-600">
                      <ArrowRight className="h-4 w-4 text-primary mr-2" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;