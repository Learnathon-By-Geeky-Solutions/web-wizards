import { api } from './apiService';

const BASE_URL = '/api/medical-records/health-issues';

// Health Issues
export const fetchHealthIssues = async () => {
  try {
    const response = await api.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching health issues:', error);
    throw error;
  }
};

export const fetchHealthIssueById = async (id) => {
  try {
    const response = await api.get(`${BASE_URL}/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching health issue with ID ${id}:`, error);
    throw error;
  }
};

export const createHealthIssue = async (healthIssueData) => {
  try {
    const response = await api.post(`${BASE_URL}/`, healthIssueData);
    return response.data;
  } catch (error) {
    console.error('Error creating health issue:', error);
    throw error;
  }
};

export const updateHealthIssue = async (id, healthIssueData) => {
  try {
    const response = await api.put(`${BASE_URL}/${id}/`, healthIssueData);
    return response.data;
  } catch (error) {
    console.error(`Error updating health issue with ID ${id}:`, error);
    throw error;
  }
};

export const deleteHealthIssue = async (id) => {
  try {
    await api.delete(`${BASE_URL}/${id}/`);
  } catch (error) {
    console.error(`Error deleting health issue with ID ${id}:`, error);
    throw error;
  }
};

// Logbook entries
export const fetchLogbookEntriesByHealthIssue = async (healthIssueId) => {
  try {
    const response = await api.get(`${BASE_URL}/${healthIssueId}/logbook/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching logbook entries for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createLogbookEntry = async (entryData) => {
  try {
    const response = await api.post(`${BASE_URL}/${entryData.health_issue}/logbook/`, entryData);
    return response.data;
  } catch (error) {
    console.error('Error creating logbook entry:', error);
    throw error;
  }
};

export const updateLogbookEntry = async (healthIssueId, entryId, entryData) => {
  try {
    const response = await api.put(`${BASE_URL}/${healthIssueId}/logbook/${entryId}/`, entryData);
    return response.data;
  } catch (error) {
    console.error(`Error updating logbook entry with ID ${entryId}:`, error);
    throw error;
  }
};

export const deleteLogbookEntry = async (healthIssueId, entryId) => {
  try {
    await api.delete(`${BASE_URL}/${healthIssueId}/logbook/${entryId}/`);
  } catch (error) {
    console.error(`Error deleting logbook entry with ID ${entryId}:`, error);
    throw error;
  }
};

// Symptoms
export const fetchSymptomsByHealthIssue = async (healthIssueId) => {
  try {
    const response = await api.get(`${BASE_URL}/${healthIssueId}/symptoms/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching symptoms for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createSymptom = async (symptomData) => {
  try {
    const response = await api.post(`${BASE_URL}/${symptomData.health_issue}/symptoms/`, symptomData);
    return response.data;
  } catch (error) {
    console.error('Error creating symptom:', error);
    throw error;
  }
};

export const updateSymptom = async (healthIssueId, symptomId, symptomData) => {
  try {
    const response = await api.put(`${BASE_URL}/${healthIssueId}/symptoms/${symptomId}/`, symptomData);
    return response.data;
  } catch (error) {
    console.error(`Error updating symptom with ID ${symptomId}:`, error);
    throw error;
  }
};

export const deleteSymptom = async (healthIssueId, symptomId) => {
  try {
    await api.delete(`${BASE_URL}/${healthIssueId}/symptoms/${symptomId}/`);
  } catch (error) {
    console.error(`Error deleting symptom with ID ${symptomId}:`, error);
    throw error;
  }
};

// Charts
export const fetchChartsByHealthIssue = async (healthIssueId) => {
  try {
    const response = await api.get(`${BASE_URL}/${healthIssueId}/charts/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching charts for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createChart = async (chartData) => {
  try {
    const response = await api.post(`${BASE_URL}/${chartData.health_issue}/charts/`, chartData);
    return response.data;
  } catch (error) {
    console.error('Error creating chart data:', error);
    throw error;
  }
};

export const updateChart = async (healthIssueId, chartId, chartData) => {
  try {
    const response = await api.put(`${BASE_URL}/${healthIssueId}/charts/${chartId}/`, chartData);
    return response.data;
  } catch (error) {
    console.error(`Error updating chart with ID ${chartId}:`, error);
    throw error;
  }
};

export const deleteChart = async (healthIssueId, chartId) => {
  try {
    await api.delete(`${BASE_URL}/${healthIssueId}/charts/${chartId}/`);
  } catch (error) {
    console.error(`Error deleting chart with ID ${chartId}:`, error);
    throw error;
  }
};

// Lab Results
export const fetchLabResultsByHealthIssue = async (healthIssueId) => {
  try {
    const response = await api.get(`${BASE_URL}/${healthIssueId}/lab-results/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching lab results for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createLabResult = async (labResultData) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${labResultData.get('health_issue')}/lab-results/`, 
      labResultData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating lab result:', error);
    throw error;
  }
};

export const updateLabResult = async (healthIssueId, labResultId, labResultData) => {
  try {
    const response = await api.put(
      `${BASE_URL}/${healthIssueId}/lab-results/${labResultId}/`, 
      labResultData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating lab result with ID ${labResultId}:`, error);
    throw error;
  }
};

export const deleteLabResult = async (healthIssueId, labResultId) => {
  try {
    await api.delete(`${BASE_URL}/${healthIssueId}/lab-results/${labResultId}/`);
  } catch (error) {
    console.error(`Error deleting lab result with ID ${labResultId}:`, error);
    throw error;
  }
};

// Documents
export const fetchDocumentsByHealthIssue = async (healthIssueId) => {
  try {
    const response = await api.get(`${BASE_URL}/${healthIssueId}/documents/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching documents for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const createDocument = async (documentData) => {
  try {
    const response = await api.post(
      `${BASE_URL}/${documentData.get('health_issue')}/documents/`, 
      documentData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating document:', error);
    throw error;
  }
};

export const updateDocument = async (healthIssueId, documentId, documentData) => {
  try {
    const response = await api.put(
      `${BASE_URL}/${healthIssueId}/documents/${documentId}/`, 
      documentData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating document with ID ${documentId}:`, error);
    throw error;
  }
};

export const deleteDocument = async (healthIssueId, documentId) => {
  try {
    await api.delete(`${BASE_URL}/${healthIssueId}/documents/${documentId}/`);
  } catch (error) {
    console.error(`Error deleting document with ID ${documentId}:`, error);
    throw error;
  }
};