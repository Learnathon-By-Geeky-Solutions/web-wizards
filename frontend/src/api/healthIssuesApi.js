import { api } from '../store/api/apiService';

const API_URL = 'http://localhost:8000/api';
const BASE_URL = '/medical-records/health-issues';  // Keep the relative path

// Create a modern fetch client for API calls
const fetchClient = {
  async request(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('accessToken');
    
    const headers = {
      'Content-Type': options.isFormData ? undefined : 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers
    };
    
    try {
      const response = await fetch(url, {
        ...options,
        headers
      });
      
      if (!response.ok) {
        const error = new Error(`HTTP error! Status: ${response.status}`);
        error.status = response.status;
        error.response = response;
        throw error;
      }
      
      // For DELETE operations or when no content is expected
      if (response.status === 204) {
        return null;
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  },
  
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },
  
  post(endpoint, data, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
      isFormData,
      ...options
    });
  },
  
  put(endpoint, data, options = {}) {
    const isFormData = data instanceof FormData;
    return this.request(endpoint, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
      isFormData,
      ...options
    });
  },
  
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

// Re-export the RTK Query hooks
export const {
  useGetHealthIssuesQuery,
  useGetHealthIssueQuery,
  useCreateHealthIssueMutation,
  useUpdateHealthIssueMutation,
  useDeleteHealthIssueMutation,
  useCreateSymptomMutation,
  useGetHealthIssueSymptomsQuery,
} = api;

// Legacy functions using fetch API for backward compatibility
export const fetchHealthIssues = async () => {
  try {
    return await fetchClient.get(`${BASE_URL}/`);
  } catch (error) {
    console.error('Error fetching health issues:', error);
    throw error;
  }
};

export const fetchHealthIssueById = async (id) => {
  try {
    return await fetchClient.get(`${BASE_URL}/${id}/`);
  } catch (error) {
    console.error(`Error fetching health issue with ID ${id}:`, error);
    throw error;
  }
};

export const createHealthIssue = async (healthIssueData) => {
  try {
    console.log(healthIssueData);
    return await fetchClient.post(`${BASE_URL}/`, healthIssueData);
  } catch (error) {
    console.error('Error creating health issue:', error);
    throw error;
  }
};

export const updateHealthIssue = async (id, healthIssueData) => {
  try {
    return await fetchClient.put(`${BASE_URL}/${id}/`, healthIssueData);
  } catch (error) {
    console.error(`Error updating health issue with ID ${id}:`, error);
    throw error;
  }
};

export const deleteHealthIssue = async (id) => {
  try {
    await fetchClient.delete(`${BASE_URL}/${id}/`);
  } catch (error) {
    console.error(`Error deleting health issue with ID ${id}:`, error);
    throw error;
  }
};

// Logbook entries
export const fetchLogbookEntriesByHealthIssue = async (healthIssueId) => {
  try {
    return await fetchClient.get(`${BASE_URL}/${healthIssueId}/logbook/`);
  } catch (error) {
    console.error(`Error fetching logbook entries for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createLogbookEntry = async (entryData) => {
  try {
    return await fetchClient.post(`${BASE_URL}/${entryData.health_issue}/logbook/`, entryData);
  } catch (error) {
    console.error('Error creating logbook entry:', error);
    throw error;
  }
};

export const updateLogbookEntry = async (healthIssueId, entryId, entryData) => {
  try {
    return await fetchClient.put(`${BASE_URL}/${healthIssueId}/logbook/${entryId}/`, entryData);
  } catch (error) {
    console.error(`Error updating logbook entry with ID ${entryId}:`, error);
    throw error;
  }
};

export const deleteLogbookEntry = async (healthIssueId, entryId) => {
  try {
    await fetchClient.delete(`${BASE_URL}/${healthIssueId}/logbook/${entryId}/`);
  } catch (error) {
    console.error(`Error deleting logbook entry with ID ${entryId}:`, error);
    throw error;
  }
};

// Symptoms
export const fetchSymptomsByHealthIssue = async (healthIssueId) => {
  try {
    return await fetchClient.get(`${BASE_URL}/${healthIssueId}/symptoms/`);
  } catch (error) {
    console.error(`Error fetching symptoms for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createSymptom = async (symptomData) => {
  try {
    return await fetchClient.post(`${BASE_URL}/${symptomData.health_issue}/symptoms/`, symptomData);
  } catch (error) {
    console.error('Error creating symptom:', error);
    throw error;
  }
};

export const updateSymptom = async (healthIssueId, symptomId, symptomData) => {
  try {
    return await fetchClient.put(`${BASE_URL}/${healthIssueId}/symptoms/${symptomId}/`, symptomData);
  } catch (error) {
    console.error(`Error updating symptom with ID ${symptomId}:`, error);
    throw error;
  }
};

export const deleteSymptom = async (healthIssueId, symptomId) => {
  try {
    await fetchClient.delete(`${BASE_URL}/${healthIssueId}/symptoms/${symptomId}/`);
  } catch (error) {
    console.error(`Error deleting symptom with ID ${symptomId}:`, error);
    throw error;
  }
};

// Charts
export const fetchChartsByHealthIssue = async (healthIssueId) => {
  try {
    return await fetchClient.get(`${BASE_URL}/${healthIssueId}/charts/`);
  } catch (error) {
    console.error(`Error fetching charts for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createChart = async (chartData) => {
  try {
    return await fetchClient.post(`${BASE_URL}/${chartData.health_issue}/charts/`, chartData);
  } catch (error) {
    console.error('Error creating chart data:', error);
    throw error;
  }
};

export const updateChart = async (healthIssueId, chartId, chartData) => {
  try {
    return await fetchClient.put(`${BASE_URL}/${healthIssueId}/charts/${chartId}/`, chartData);
  } catch (error) {
    console.error(`Error updating chart with ID ${chartId}:`, error);
    throw error;
  }
};

export const deleteChart = async (healthIssueId, chartId) => {
  try {
    await fetchClient.delete(`${BASE_URL}/${healthIssueId}/charts/${chartId}/`);
  } catch (error) {
    console.error(`Error deleting chart with ID ${chartId}:`, error);
    throw error;
  }
};

// Lab Results
export const fetchLabResultsByHealthIssue = async (healthIssueId) => {
  try {
    return await fetchClient.get(`${BASE_URL}/${healthIssueId}/lab-results/`);
  } catch (error) {
    console.error(`Error fetching lab results for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createLabResult = async (labResultData) => {
  try {
    return await fetchClient.post(
      `${BASE_URL}/${labResultData.get('health_issue')}/lab-results/`, 
      labResultData
    );
  } catch (error) {
    console.error('Error creating lab result:', error);
    throw error;
  }
};

export const updateLabResult = async (healthIssueId, labResultId, labResultData) => {
  try {
    return await fetchClient.put(
      `${BASE_URL}/${healthIssueId}/lab-results/${labResultId}/`, 
      labResultData
    );
  } catch (error) {
    console.error(`Error updating lab result with ID ${labResultId}:`, error);
    throw error;
  }
};

export const deleteLabResult = async (healthIssueId, labResultId) => {
  try {
    await fetchClient.delete(`${BASE_URL}/${healthIssueId}/lab-results/${labResultId}/`);
  } catch (error) {
    console.error(`Error deleting lab result with ID ${labResultId}:`, error);
    throw error;
  }
};

// Documents
export const fetchDocumentsByHealthIssue = async (healthIssueId) => {
  try {
    return await fetchClient.get(`${BASE_URL}/${healthIssueId}/documents/`);
  } catch (error) {
    console.error(`Error fetching documents for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

// Search health issues
export const searchHealthIssues = async (query) => {
  try {
    return await fetchClient.get(`${BASE_URL}/search/?q=${encodeURIComponent(query)}`);
  } catch (error) {
    console.error('Error searching health issues:', error);
    throw error;
  }
};

export const createDocument = async (documentData) => {
  try {
    return await fetchClient.post(
      `${BASE_URL}/${documentData.get('health_issue')}/documents/`, 
      documentData
    );
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocument = async (healthIssueId, documentId, documentData) => {
  try {
    return await fetchClient.put(
      `${BASE_URL}/${healthIssueId}/documents/${documentId}/`, 
      documentData
    );
  } catch (error) {
    console.error(`Error updating document with ID ${documentId}:`, error);
    throw error;
  }
};

export const deleteDocument = async (healthIssueId, documentId) => {
  try {
    await fetchClient.delete(`${BASE_URL}/${healthIssueId}/documents/${documentId}/`);
  } catch (error) {
    console.error(`Error deleting document with ID ${documentId}:`, error);
    throw error;
  }
};