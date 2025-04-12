import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MedicationHeader from '../components/Medication/MedicationHeader';
import MedicationFilters from '../components/Medication/MedicationFilters';
import MedicationPlansList from '../components/Medication/MedicationPlansList';
import EmptyState from '../components/common/EmptyState';
import AddPlanButton from '../components/Medication/AddPlanButton';
import AddPlanModal from '../components/Medication/AddPlanModal';
import NotificationsMenu from '../components/Medication/NotificationsMenu';
import { 
  useGetMedicationPlansQuery, 
  useCreateMedicationPlanMutation,
  useUpdateMedicationPlanMutation,
  useDeleteMedicationPlanMutation 
} from '../store/api/apiService';
import {
  setStatusFilter,
  setHealthIssueFilter,
  setSearchTerm,
  setNotifications,
  setEditingPlan,
} from '../store/slices/medicationSlice';

const Medication = () => {
  const {
    statusFilter,
    healthIssueFilter,
    searchTerm,
    notifications,
    editingPlan
  } = useSelector(state => state.medication);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState('MEDICATION_HOME');
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // RTK Query hooks
  const { data: medicationPlans = [], isLoading, error } = useGetMedicationPlansQuery();
  const [createMedicationPlan] = useCreateMedicationPlanMutation();
  const [updateMedicationPlan] = useUpdateMedicationPlanMutation();
  const [deleteMedicationPlan] = useDeleteMedicationPlanMutation();

  // Extract health issue ID from URL parameters or router state
  useEffect(() => {
    const issueId = searchParams.get('issueId');
    if (issueId) {
      dispatch(setHealthIssueFilter(issueId));
    } else if (location.state?.currentIssue?.id) {
      dispatch(setHealthIssueFilter(location.state.currentIssue.id.toString()));
    }
  }, [searchParams, location.state, dispatch]);

  // Debug logging
  useEffect(() => {
    if (medicationPlans?.length > 0) {
      console.log("Medication plans received:", medicationPlans);
      console.log("Current status filter:", statusFilter);
    }
  }, [medicationPlans, statusFilter]);

  // Modal handlers
  const openAddPlanModal = () => {
    dispatch(setEditingPlan(null));
    setCurrentPage('ADD_MEDICATION_PLAN');
  };
  
  const openEditPlanModal = (plan) => {
    dispatch(setEditingPlan(plan));
    setCurrentPage('ADD_MEDICATION_PLAN');
  };
  
  const closeAddPlanModal = () => setCurrentPage('MEDICATION_HOME');

  // Handle adding or updating a plan
  const handleSavePlan = async (planData) => {
    try {
      if (editingPlan) {
        await updateMedicationPlan({ id: editingPlan.id, data: planData }).unwrap();
      } else {
        await createMedicationPlan(planData).unwrap();
      }
      closeAddPlanModal();
    } catch (err) {
      console.error('Error saving medication plan:', err);
    }
  };

  // Handle deleting a plan
  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this medication plan?')) {
      return;
    }
    
    try {
      await deleteMedicationPlan(planId).unwrap();
    } catch (err) {
      console.error('Error deleting medication plan:', err);
    }
  };

  // Normalize medication plans for consistent rendering
  const normalizedPlans = medicationPlans.map(plan => ({
    ...plan,
    status: plan.status.toLowerCase(), // Convert "Active" to "active" for consistent filtering
    medication_name: plan.medication?.name || plan.custom_medication_name || "", // Handle both medication or custom name
  }));

  // Filter logic
  const filteredPlans = normalizedPlans.filter((plan) => {
    // Handle 'all' filter special case
    if (statusFilter === 'all') {
      // Skip status filtering if 'all' is selected
    } else if (plan.status !== statusFilter.toLowerCase()) {
      return false;
    }
    
    // Health issue filter - handle special filter values
    if (healthIssueFilter === 'All Health Issues' || healthIssueFilter === 'All') {
      // Skip health issue filtering
    } else if (healthIssueFilter === 'Current Health Issues') {
      // Filter for current/active health issues
      if (!plan.health_issue_data || plan.health_issue_data.status !== 'active') return false;
    } else if (healthIssueFilter === 'Past Health Issues') {
      // Filter for past/inactive health issues
      if (!plan.health_issue_data || plan.health_issue_data.status === 'active') return false;
    } else if (healthIssueFilter && healthIssueFilter !== 'All') {
      // Filter by specific health issue ID
      if (!plan.health_issue_data || plan.health_issue_data.id !== parseInt(healthIssueFilter)) return false;
    }
    
    // Search term - search in both medication name and custom medication name
    if (searchTerm && !(
      (plan.medication_name && plan.medication_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (plan.custom_medication_name && plan.custom_medication_name.toLowerCase().includes(searchTerm.toLowerCase()))
    )) return false;
    
    return true;
  });

  // Handle toggle notifications
  const handleToggleNotifications = async (planId, enableNotifications) => {
    try {
      await updateMedicationPlan({ 
        id: planId, 
        data: { notifications_enabled: enableNotifications } 
      }).unwrap();
    } catch (err) {
      console.error('Error updating notifications setting:', err);
    }
  };

  if (isLoading && medicationPlans.length === 0) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6 relative">
        <NotificationsMenu 
          notifications={notifications} 
          setNotifications={(newNotifications) => dispatch(setNotifications(newNotifications))} 
        />
        
        {currentPage === 'MEDICATION_HOME' && (
          <div>
            <MedicationHeader fullName={user?.name || ''} />
            
            <MedicationFilters 
              statusFilter={statusFilter}
              setStatusFilter={(value) => dispatch(setStatusFilter(value))}
              healthIssueFilter={healthIssueFilter}
              setHealthIssueFilter={(value) => dispatch(setHealthIssueFilter(value))}
              searchTerm={searchTerm}
              setSearchTerm={(value) => dispatch(setSearchTerm(value))}
            />

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error?.data?.message || 'Error loading medication plans'}
              </div>
            )}

            {isLoading && (
              <div className="flex justify-center my-8">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-500"></div>
              </div>
            )}

            {!isLoading && medicationPlans.length === 0 ? (
              <EmptyState message="No medication plans found. Add your first medication plan." />
            ) : !isLoading && filteredPlans.length === 0 ? (
              <EmptyState message="No medication plans found for this filter." />
            ) : (
              <MedicationPlansList 
                plans={filteredPlans} 
                onEdit={openEditPlanModal}
                onDelete={handleDeletePlan}
                onToggleNotifications={handleToggleNotifications}
              />
            )}
            
            <AddPlanButton onClick={openAddPlanModal} />
          </div>
        )}

        <AddPlanModal 
          isOpen={currentPage === 'ADD_MEDICATION_PLAN'}
          onClose={closeAddPlanModal} 
          onSave={handleSavePlan} 
          initialData={editingPlan}
        />
      </div>
    </div>
  );
};

export default Medication;