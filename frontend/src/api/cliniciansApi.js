import { api } from '../store/api/apiService';

const BASE_URL = '/api/clinicians';

// Clinicians API functions
export const fetchClinicians = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/clinicians/?${queryString}` 
      : `${BASE_URL}/clinicians/`;
      
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching clinicians:', error);
    throw error;
  }
};

export const fetchClinicianById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/clinicians/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching clinician with ID ${id}:`, error);
    throw error;
  }
};

export const fetchTopRatedClinicians = async () => {
  try {
    const response = await api.get(`${BASE_URL}/clinicians/top_rated/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top-rated clinicians:', error);
    throw error;
  }
};

export const fetchCliniciansBySpecialization = async (specializationId) => {
  try {
    const response = await api.get(`${BASE_URL}/clinicians/by_specialization/?specialization_id=${specializationId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching clinicians for specialization ${specializationId}:`, error);
    throw error;
  }
};

// Specialization API functions
export const fetchSpecializations = async () => {
  try {
    const response = await api.get(`${BASE_URL}/specializations/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching specializations:', error);
    throw error;
  }
};

// Diagnostic Centers API functions
export const fetchDiagnosticCenters = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value);
      }
    });
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/diagnostic-centers/?${queryString}` 
      : `${BASE_URL}/diagnostic-centers/`;
      
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching diagnostic centers:', error);
    throw error;
  }
};

export const fetchDiagnosticCenterById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/diagnostic-centers/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching diagnostic center with ID ${id}:`, error);
    throw error;
  }
};

export const fetchTopRatedDiagnosticCenters = async () => {
  try {
    const response = await api.get(`${BASE_URL}/diagnostic-centers/top_rated/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching top-rated diagnostic centers:', error);
    throw error;
  }
};

export const fetchDiagnosticCentersByService = async (service) => {
  try {
    const response = await api.get(`${BASE_URL}/diagnostic-centers/by_service/?service=${encodeURIComponent(service)}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching diagnostic centers for service ${service}:`, error);
    throw error;
  }
};

// Reviews API functions
export const fetchReviewsForClinician = async (clinicianId) => {
  try {
    const response = await api.get(`${BASE_URL}/reviews/?clinician_id=${clinicianId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for clinician ${clinicianId}:`, error);
    throw error;
  }
};

export const fetchReviewsForDiagnosticCenter = async (centerId) => {
  try {
    const response = await api.get(`${BASE_URL}/reviews/?diagnostic_center_id=${centerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for diagnostic center ${centerId}:`, error);
    throw error;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const response = await api.post(`${BASE_URL}/reviews/`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};