import { api } from '../store/api/apiService';

const BASE_URL = '/api/medications';

// Notification API functions
export const fetchNotifications = async (filters = {}) => {
  try {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    const url = queryString 
      ? `${BASE_URL}/notifications/?${queryString}` 
      : `${BASE_URL}/notifications/`;
      
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

export const fetchPendingNotifications = async () => {
  try {
    const response = await api.get('/medications/notifications/pending/');
    return response.data;
  } catch (error) {
    console.error('Error fetching pending notifications:', error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await api.post(`/medications/notifications/${notificationId}/mark_as_read/`);
    return response.data;
  } catch (error) {
    console.error(`Error marking notification ${notificationId} as read:`, error);
    throw error;
  }
};

export const dismissNotification = async (notificationId) => {
  try {
    const response = await api.post(`/medications/notifications/${notificationId}/dismiss/`);
    return response.data;
  } catch (error) {
    console.error(`Error dismissing notification ${notificationId}:`, error);
    throw error;
  }
};