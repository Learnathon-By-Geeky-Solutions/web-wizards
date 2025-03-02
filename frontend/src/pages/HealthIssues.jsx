import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import HealthIssuesHeader from '../components/HealthIssues/HealthIssuesHeader';
import EmptyState from '../components/HealthIssues/EmptyState';
import AddButton from '../components/HealthIssues/AddButton';
import LogHealthIssueModal from '../components/HealthIssues/LogHealthIssueModal';
import HealthIssueList from '../components/HealthIssues/HealthIssueList';

const HealthIssues = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('HEALTH_ISSUES_HOME');
  const [healthIssues, setHealthIssues] = useState([]);

  const openLogHealthIssues = () => setCurrentPage('LOG_HEALTH_ISSUES');
  const closeLogHealthIssues = () => setCurrentPage('HEALTH_ISSUES_HOME');
  
  const addHealthIssue = (newIssue) => {
    setHealthIssues([...healthIssues, { ...newIssue, id: Date.now() }]);
    setCurrentPage('HEALTH_ISSUES_HOME');
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <div className="mt-6 relative">
          {currentPage === 'HEALTH_ISSUES_HOME' && (
            <div>
              <HealthIssuesHeader />
              {healthIssues.length === 0 ? (
                <EmptyState message="This user has not logged any health issues yet." />
              ) : (
                <HealthIssueList issues={healthIssues} />
              )}
              <AddButton onClick={openLogHealthIssues} />
            </div>
          )}

          {currentPage === 'LOG_HEALTH_ISSUES' && (
            <div>
              <HealthIssuesHeader />
              <LogHealthIssueModal onClose={closeLogHealthIssues} onSave={addHealthIssue} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthIssues;
