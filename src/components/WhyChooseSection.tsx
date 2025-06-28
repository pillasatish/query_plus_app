import React from 'react';
import { Bot, Brain, Sparkles, Shield, Clock, BarChart } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const WhyChooseSection: React.FC = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -50]);

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-primary" />,
      title: "Advanced AI Diagnosis",
      description: "Our AI system analyzes symptoms with 99.8% accuracy for precise diagnosis"
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Personalized Treatment",
      description: "AI-powered recommendations tailored to your specific condition"
    },
    {
      icon: <Bot className="h-8 w-8 text-primary" />,
      title: "24/7 AI Monitoring",
      description: "Continuous symptom tracking and progress analysis"
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Private",
      description: "HIPAA-compliant data protection with advanced encryption"
    },
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Instant Results",
      description: "Get immediate AI-powered insights and recommendations"
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Smart Analytics",
      description: "Detailed progress tracking with predictive insights"
    }
  ];

  return (
    <motion.section 
      className="py-16 bg-gradient-to-b from-gray-50 to-white"
      style={{ y }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center justify-center px-4 py-2 bg-primary/10 rounded-full mb-4">
            <Bot className="h-5 w-5 text-primary mr-2" />
            <span className="text-primary font-semibold">AI-Powered Healthcare</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Why Choose QurePlus AI?</h2>
          <p className="mt-4 text-lg text-gray-600">Experience the future of healthcare with our advanced AI technology</p>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-lg mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WhyChooseSection;