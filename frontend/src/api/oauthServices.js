// frontend/src/api/oauthServices.js
const API_URL = 'http://127.0.0.1:8000';

/**
 * OAuth Authentication Services
 */

// Initiates Google OAuth login process
export const initiateGoogleLogin = async () => {
  try {
    // Get the redirect URI
    const redirectUri = `${window.location.origin}/google-callback`;
    
    // Get the auth URL from the backend
    const response = await fetch(`${API_URL}/api/users/google/login/?redirect_uri=${encodeURIComponent(redirectUri)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to initiate Google login');
    }

    const data = await response.json();
    
    // Redirect to Google's auth page
    window.location.href = data.auth_url;
  } catch (error) {
    console.error('Google login initiation error:', error);
    throw error;
  }
};

// Process Google OAuth callback
export const processGoogleCallback = async (code) => {
  try {
    const response = await fetch(`${API_URL}/api/users/google/callback/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Google authentication failed');
    }

    const responseData = await response.json();
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', responseData.access);
    localStorage.setItem('refreshToken', responseData.refresh);
    
    return responseData;
  } catch (error) {
    console.error('Google auth error:', error);
    throw error;
  }
};