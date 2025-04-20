import React, { useState } from 'react';
import SymptomsHome from './Symptoms/SymptomsHome';
import LogSymptoms from './Symptoms/LogSymptoms';

const Symptoms = () => {
  const [isLoading] = useState(false); // Removed unused setIsLoading
  const [currentPage, setCurrentPage] = useState('SYMPTOMS_HOME');

  // Handlers
  const openLogSymptoms = () => setCurrentPage('LOG_SYMPTOMS');
  const closeLogSymptoms = () => setCurrentPage('SYMPTOMS_HOME');

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Symptoms Pages */}
      <div className="relative">
        {currentPage === 'SYMPTOMS_HOME' && (
          <SymptomsHome openLogSymptoms={openLogSymptoms} />
        )}
        {currentPage === 'LOG_SYMPTOMS' && (
          <LogSymptoms closeLogSymptoms={closeLogSymptoms} />
        )}
      </div>
    </div>
  );
};

export default Symptoms;