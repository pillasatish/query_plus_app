import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">About QurePlus</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <p className="text-lg text-gray-600 mb-6">
              QurePlus is a leading healthcare platform specializing in varicose vein treatment. Our mission is to make quality vein care accessible, affordable, and convenient for everyone.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              With our innovative AI-powered assessment system and network of experienced specialists, we're revolutionizing how people access and receive treatment for varicose veins.
            </p>
            <p className="text-lg text-gray-600">
              Our team of dedicated healthcare professionals combines years of expertise with cutting-edge technology to provide personalized care solutions that work for you.
            </p>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1666214280557-f1b5022eb634?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Medical Team"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;