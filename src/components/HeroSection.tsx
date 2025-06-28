import React, { useState, useRef, Suspense } from 'react';
import { ArrowUpRight, Bot, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import LegModel from './3D/LegModel';

interface HeroSectionProps {
  onStartAssessment: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartAssessment }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.9]);

  const scrollToHowItWorks = () => {
    const section = document.getElementById('how-it-works');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50"
        style={{ y }}
      />

      <div className="absolute inset-0 pointer-events-none">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={45} />
          <ambientLight intensity={0.5} />
          <spotLight 
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
            intensity={1} 
            castShadow 
          />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          <Suspense fallback={null}>
            <LegModel />
            <ContactShadows
              opacity={0.4}
              scale={10}
              blur={2}
              far={10}
              resolution={256}
              color="#000000"
            />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2}
          />
        </Canvas>
      </div>

      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          className="relative z-10 pb-8 bg-transparent sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32"
          style={{ opacity, scale }}
        >
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <motion.div 
                className="flex items-center justify-center lg:justify-start mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Bot className="h-8 w-8 text-primary animate-pulse" />
                <span className="ml-2 text-sm font-semibold text-primary-dark bg-primary/10 px-3 py-1 rounded-full">
                  AI-Powered Healthcare
                </span>
              </motion.div>
              <motion.h1 
                className="text-4xl tracking-tight font-black text-gray-900 sm:text-5xl md:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="block">Advanced AI Diagnosis</span>
                <span className="block text-primary">For Vein Health</span>
              </motion.h1>
              <motion.p 
                className="mt-3 text-base text-gray-500/90 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Experience the future of healthcare with our AI-driven diagnosis system. Get instant, accurate assessments and personalized treatment recommendations powered by advanced machine learning.
              </motion.p>
              <motion.div 
                className="mt-8 flex flex-col sm:flex-row sm:justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button
                  onClick={onStartAssessment}
                  className="flex items-center justify-center px-8 py-4 text-base font-semibold text-white bg-primary hover:bg-primary-dark rounded-md transition-colors duration-200 group"
                >
                  Start AI Assessment
                  <Sparkles className="ml-2 h-5 w-5 group-hover:animate-pulse" />
                </button>
                <button
                  onClick={scrollToHowItWorks}
                  className="flex items-center justify-center px-8 py-4 text-base font-semibold text-primary border-2 border-primary hover:bg-primary/5 rounded-md transition-colors duration-200"
                >
                  Learn How It Works
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </button>
              </motion.div>
              <motion.div 
                className="mt-8 grid grid-cols-3 gap-4 sm:gap-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {[
                  { label: 'AI Accuracy', value: '99.8%' },
                  { label: 'Patients Helped', value: '1,000+' },
                  { label: 'Expert Doctors', value: '5+' }
                ].map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white/50 backdrop-blur-sm rounded-lg p-4 text-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </main>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;