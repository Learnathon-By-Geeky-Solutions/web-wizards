// Get the API URL from environment variables or use a default
const API_URL = 'http://127.0.0.1:8000';

/**
 * Authentication API Functions
 * This module handles user registration, login, and logout
 */

export const registerUser = async (data) => {
    try {
      const response = await fetch(`${API_URL}/api/users/register/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }
  
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

export const loginUser = async (data) => {
  try {
    const response = await fetch(`${API_URL}/api/users/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const responseData = await response.json();
    return {
      access: responseData.access,
      refresh: responseData.refresh,
      user: responseData.user
    };
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch(`${API_URL}/api/users/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      })
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }

    // Clear all auth related data from localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    // Still remove tokens even if the API call fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    throw error;
  }
};

/**
 * Sends a password reset request for the specified email
 * @param {string} email - The user's email address
 * @returns {Promise<object>} - Response from the server
 */
export const forgotPassword = async (email) => {
  try {
    const response = await fetch(`${API_URL}/api/users/forgot-password/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send password reset email');
    }

    return await response.json();
  } catch (error) {
    console.error('Forgot password error:', error);
    throw error;
  }
};

