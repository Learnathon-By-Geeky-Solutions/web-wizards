// Get the API URL from environment variables or use a default
const API_URL = 'http://127.0.0.1:8000';

/**
 * User Profile API Functions
 * This module handles all profile-related API requests
 */

/**
 * Fetch the current user's profile data
 */
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/api/users/profile/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Upload a profile image for the current user
 * @param {File} imageFile - The image file to upload
 */
export const uploadProfileImage = async (imageFile) => {
  try {
    const token = localStorage.getItem('accessToken');
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(`${API_URL}/api/users/upload-profile-image/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to upload image');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};

/**
 * Update the current user's profile information
 * @param {Object} profileData - The profile data to update
 */
export const updatePatientProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/api/users/update-profile/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update profile');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
};