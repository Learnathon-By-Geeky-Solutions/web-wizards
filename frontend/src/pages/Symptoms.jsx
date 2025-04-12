import React, { useState, useEffect } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import SymptomsHome from '../components/MedicalRecord/Symptoms/SymptomsHome';
import LogSymptoms from '../components/MedicalRecord/Symptoms/LogSymptoms';

const Symptoms = () => {
  const [currentPage, setCurrentPage] = useState('SYMPTOMS_HOME');
  const [selectedHealthIssue, setSelectedHealthIssue] = useState(null);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  // Extract health issue ID from URL parameters or router state
  useEffect(() => {
    const issueId = searchParams.get('issueId');
    if (issueId) {
      setSelectedHealthIssue(issueId);
    } else if (location.state?.currentIssue?.id) {
      setSelectedHealthIssue(location.state.currentIssue.id);
    }
  }, [searchParams, location.state]);

  // Handlers
  const openLogSymptoms = (healthIssueId) => {
    setSelectedHealthIssue(healthIssueId === 'all' ? null : healthIssueId);
    setCurrentPage('LOG_SYMPTOMS');
  };

  const closeLogSymptoms = () => {
    setCurrentPage('SYMPTOMS_HOME');
  };

  return (
    <div className="space-y-6">
      {/* Symptoms Pages */}
      <div className="relative">
        {currentPage === 'SYMPTOMS_HOME' && (
          <SymptomsHome 
            openLogSymptoms={openLogSymptoms} 
            initialHealthIssue={selectedHealthIssue}
          />
        )}
        {currentPage === 'LOG_SYMPTOMS' && (
          <LogSymptoms 
            closeLogSymptoms={closeLogSymptoms} 
            initialHealthIssue={selectedHealthIssue} 
          />
        )}
      </div>
    </div>
  );
};

export default Symptoms;