import Cookies from 'js-cookie';
import { secureStore, secureRetrieve } from '../utils/security';

// Format API URL consistently and log for debugging
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

// Log API URL for debugging
console.log('TokenService using API URL:', API_URL);

// In-memory storage for access token (not accessible from XSS attacks)
let inMemoryToken = null;

// Cookie configuration for refresh tokens
const REFRESH_TOKEN_COOKIE_OPTIONS = {
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  httpOnly: true, // Not accessible via JavaScript
  sameSite: 'strict', // Prevent CSRF
  path: '/',
  expires: 7, // 7 days (matching backend config)
};

// Fallback for environments where HttpOnly cookies don't work (like local dev)
const REFRESH_TOKEN_KEY = '_secure_refresh_token';
const ACCESS_TOKEN_KEY = '_secure_access_token';

/**
 * Token Service - Provides secure token storage and management
 */
class TokenService {
  /**
   * Store access token securely (primarily in memory)
   * @param {string} token - JWT access token
   */
  setAccessToken(token) {
    if (!token) return;
    
    // Store token in memory (primary storage)
    inMemoryToken = token;
    
    // Fallback for page refreshes - store encrypted in sessionStorage
    secureStore(ACCESS_TOKEN_KEY, token, true);
  }

  /**
   * Get the stored access token
   * @returns {string|null} Access token or null
   */
  getAccessToken() {
    // First try the in-memory token
    if (inMemoryToken) return inMemoryToken;
    
    // If not in memory (e.g. after page refresh), try to get from sessionStorage
    const token = secureRetrieve(ACCESS_TOKEN_KEY, true);
    
    // If found in session storage, restore to memory for future use
    if (token) {
      inMemoryToken = token;
    }
    
    return token;
  }

  /**
   * Store refresh token securely (preferably in HttpOnly cookie)
   * @param {string} token - JWT refresh token
   */
  setRefreshToken(token) {
    if (!token) return;
    
    try {
      // Try to set as HttpOnly cookie via backend API
      this.setHttpOnlyCookie(token);
      
      // Fallback: encrypt and store in localStorage if cookie setting fails
      secureStore(REFRESH_TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing refresh token:', error);
      // Fallback to localStorage with encryption
      secureStore(REFRESH_TOKEN_KEY, token);
    }
  }

  /**
   * Get refresh token from storage
   * @returns {string|null} Refresh token or null
   */
  getRefreshToken() {
    // First try to get from cookie (only works if not truly HttpOnly)
    const cookieToken = Cookies.get('refresh_token');
    
    // If not in cookie, try encrypted localStorage
    if (!cookieToken) {
      return secureRetrieve(REFRESH_TOKEN_KEY);
    }
    
    return cookieToken;
  }

  /**
   * Make API call to set HttpOnly cookie via backend
   * @param {string} token - Refresh token
   */
  async setHttpOnlyCookie(token) {
    try {
      await fetch(`${API_URL}/api/users/auth/set-refresh-cookie/`, {
        method: 'POST',
        credentials: 'include', // Important for cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: token }),
      });
    } catch (error) {
      console.error('Failed to set HttpOnly cookie:', error);
      throw error;
    }
  }

  /**
   * Clear all stored tokens
   * @param {boolean} isPageRefresh - Whether this is being called during a page refresh
   */
  clearTokens(isPageRefresh = false) {
    // Clear in-memory token
    inMemoryToken = null;
    
    // Clear sessionstorage token
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    
    // Clear localStorage token
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem('accessToken'); // Remove old token location
    localStorage.removeItem('refreshToken'); // Remove old token location
    
    // Clear cookie if exists
    Cookies.remove('refresh_token');
    
    // Make API call to clear HttpOnly cookie - but skip during page refresh
    if (!isPageRefresh) {
      this.clearHttpOnlyCookie().catch(err => 
        console.error('Failed to clear HttpOnly cookie:', err)
      );
    }
  }

  /**
   * Make API call to clear HttpOnly cookie
   */
  async clearHttpOnlyCookie() {
    try {
      await fetch(`${API_URL}/api/users/auth/clear-refresh-cookie/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Failed to clear HttpOnly cookie:', error);
      throw error;
    }
  }
  
  /**
   * Get authorization header value for API requests
   * @returns {string} Authorization header value or empty string
   */
  getAuthHeader() {
    const token = this.getAccessToken();
    return token ? `Bearer ${token}` : '';
  }
  
  /**
   * Check if user has a valid access token
   * @returns {boolean} Whether user is authenticated
   */
  isAuthenticated() {
    return !!this.getAccessToken();
  }
}

export const tokenService = new TokenService();