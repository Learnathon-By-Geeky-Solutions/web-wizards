import { api } from '../store/api/apiService';

const BASE_URL = '/api/medications';

// Medication API functions
export const fetchMedications = async (query = '') => {
  try {
    const url = query ? `${BASE_URL}/medications/search/?q=${query}` : `${BASE_URL}/medications/`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching medications:', error);
    throw error;
  }
};

export const fetchMedicationById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/medications/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medication with ID ${id}:`, error);
    throw error;
  }
};

// Medication Plans API functions
export const fetchMedicationPlans = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/medication-plans/?${queryString}` 
      : `${BASE_URL}/medication-plans/`;
      
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching medication plans:', error);
    throw error;
  }
};

export const fetchMedicationPlanById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/medication-plans/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching medication plan with ID ${id}:`, error);
    throw error;
  }
};

export const createMedicationPlan = async (planData) => {
  try {
    const response = await api.post(`${BASE_URL}/medication-plans/`, planData);
    return response.data;
  } catch (error) {
    console.error('Error creating medication plan:', error);
    throw error;
  }
};

export const updateMedicationPlan = async (id, planData) => {
  try {
    const response = await api.put(`${BASE_URL}/medication-plans/${id}/`, planData);
    return response.data;
  } catch (error) {
    console.error(`Error updating medication plan with ID ${id}:`, error);
    throw error;
  }
};

export const deleteMedicationPlan = async (id) => {
  try {
    await api.delete(`${BASE_URL}/medication-plans/${id}/`);
    return true;
  } catch (error) {
    console.error(`Error deleting medication plan with ID ${id}:`, error);
    throw error;
  }
};

export const getMedicationPlanSchedule = async (planId) => {
  const response = await api.get(`/medications/plans/${planId}/schedule/`);
  return response.data;
};

export const updateMedicationSchedule = async (planId, scheduleData) => {
  const response = await api.post(`/medications/plans/${planId}/update_schedule/`, scheduleData);
  return response.data;
};

export const getTodaySchedule = async () => {
  const response = await api.get('/medications/plans/today_schedule/');
  return response.data;
};

export const getUpcomingDoses = async () => {
  const response = await api.get('/medications/plans/upcoming_doses/');
  return response.data;
};

export const toggleNotifications = async (planId, enabled) => {
  const response = await api.post(`/medications/plans/${planId}/toggle_notifications/`, { enabled });
  return response.data;
};

export const getPlansByHealthIssue = async (healthIssueId) => {
  const response = await api.get(`/medications/plans/by_health_issue/?health_issue_id=${healthIssueId}`);
  return response.data;
};

export const getActivePlans = async () => {
  const response = await api.get('/medications/plans/active_plans/');
  return response.data;
};