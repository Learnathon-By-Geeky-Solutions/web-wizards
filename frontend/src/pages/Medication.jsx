import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/authContext';
import Sidebar from '../components/Sidebar';
import MedicationHeader from '../components/Medication/MedicationHeader';
import MedicationFilters from '../components/Medication/MedicationFilters';
import MedicationPlansList from '../components/Medication/MedicationPlansList';
import EmptyState from '../components/Medication/EmptyState';
import AddPlanButton from '../components/Medication/AddPlanButton';
import AddPlanModal from '../components/Medication/AddPlanModal';

const Medication = () => {
  const [isLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('MEDICATION_HOME');

  // Filters state
  const [statusFilter, setStatusFilter] = useState('Active');
  const [healthIssueFilter, setHealthIssueFilter] = useState('All Health Issues');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample medication plan data
  const [medicationPlans, setMedicationPlans] = useState([
    {
      id: 'Chat-0009',
      description: '1 mg, when needed, ongoing',
      effectiveDate: '2025-01-08',
      status: 'Active',
    },
  ]);

  // Modal handlers
  const openAddPlanModal = () => setCurrentPage('ADD_MEDICATION_PLAN');
  const closeAddPlanModal = () => setCurrentPage('MEDICATION_HOME');
  
  // Generate a cryptographically secure random ID
  const generateSecureId = () => {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return `Chat-${array[0].toString().padStart(4, '0')}`;
  };

  // Add new plan
  const handleAddPlan = (newPlan) => {
    setMedicationPlans([...medicationPlans, { ...newPlan, id: generateSecureId() }]);
    closeAddPlanModal();
  };

  // Filter logic
  const filteredPlans = medicationPlans.filter((plan) => {
    if (statusFilter !== 'All' && plan.status !== statusFilter) return false;
    if (searchTerm && !plan.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {currentPage === 'MEDICATION_HOME' && (
          <div>
            <MedicationHeader />
            
            <MedicationFilters 
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              healthIssueFilter={healthIssueFilter}
              setHealthIssueFilter={setHealthIssueFilter}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />

            {filteredPlans.length > 0 ? (
              <MedicationPlansList plans={filteredPlans} />
            ) : (
              <EmptyState message="No medication plans found for this filter." />
            )}
            
            <AddPlanButton onClick={openAddPlanModal} />
          </div>
        )}

        {currentPage === 'ADD_MEDICATION_PLAN' && (
          <AddPlanModal onClose={closeAddPlanModal} onSave={handleAddPlan} />
        )}
      </div>
    </div>
  );
};

export default Medication;