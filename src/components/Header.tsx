import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="gradient-bg text-white text-center py-12 mb-8 rounded-b-3xl">
      <h1 className="text-4xl font-bold mb-2">💜 QurePlus</h1>
      <h3 className="text-xl font-semibold mb-2">AI-Powered Vein Health Assessment</h3>
      <p className="text-lg opacity-90">Get instant, accurate assessments for your vein health</p>
    </div>
  );
};

export default Header;