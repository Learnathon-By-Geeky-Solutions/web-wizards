import { api } from '../store/api/apiService';

const API_URL = 'http://localhost:8000';
const BASE_URL = `${API_URL}/api/medical-records`;

// Helper function to make authenticated requests
const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = localStorage.getItem('accessToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status: ${response.status}`);
  }

  return response.json();
};

// Document API functions
export const fetchDocuments = async (filters = {}) => {
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
      ? `${BASE_URL}/documents/?${queryString}` 
      : `${BASE_URL}/documents/`;
      
    return await makeAuthenticatedRequest(url);
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

export const fetchDocumentById = async (id) => {
  try {
    return await makeAuthenticatedRequest(`${BASE_URL}/documents/${id}/`);
  } catch (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    throw error;
  }
};

export const fetchDocumentsByType = async (documentType) => {
  try {
    return await makeAuthenticatedRequest(`${BASE_URL}/documents/by_type/?type=${documentType}`);
  } catch (error) {
    console.error(`Error fetching documents of type ${documentType}:`, error);
    throw error;
  }
};

export const fetchDocumentsByHealthIssue = async (healthIssueId) => {
  try {
    return await makeAuthenticatedRequest(`${BASE_URL}/documents/by_health_issue/?health_issue_id=${healthIssueId}`);
  } catch (error) {
    console.error(`Error fetching documents for health issue ${healthIssueId}:`, error);
    throw error;
  }
};

export const uploadAndProcessDocument = async (formData) => {
  try {
    // Use fetch directly with the full URL to bypass potential Vite proxying issues
    const token = localStorage.getItem('accessToken');
    
    // Remove any existing timestamp, type or signature parameters that might be causing issues
    // This lets the backend generate its own signature based on the file
    if (formData.has('timestamp')) formData.delete('timestamp');
    if (formData.has('type')) formData.delete('type');
    if (formData.has('signature')) formData.delete('signature');
    
    const response = await fetch(`${BASE_URL}/documents/upload_and_process/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type when using FormData, the browser will set it with the boundary
      },
      body: formData  // FormData will be properly sent with multipart/form-data
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Upload failed with status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

export const deleteDocument = async (id) => {
  try {
    await makeAuthenticatedRequest(`${BASE_URL}/documents/${id}/`, {
      method: 'DELETE'
    });
    return true;
  } catch (error) {
    console.error(`Error deleting document with ID ${id}:`, error);
    throw error;
  }
};

export const updateDocument = async (id, documentData) => {
  try {
    return await makeAuthenticatedRequest(`${BASE_URL}/documents/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(documentData)
    });
  } catch (error) {
    console.error(`Error updating document with ID ${id}:`, error);
    throw error;
  }
};

export const reprocessWithOCR = async (id) => {
  try {
    return await makeAuthenticatedRequest(`${BASE_URL}/documents/${id}/reprocess_with_ocr/`, {
      method: 'POST'
    });
  } catch (error) {
    console.error(`Error reprocessing document with ID ${id}:`, error);
    throw error;
  }
};