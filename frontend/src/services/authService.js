// Format API URL consistently and log for debugging
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '');

// Log API URL for debugging
console.log('AuthService using API URL:', API_URL);

// Adjusted for 15-minute token lifespan - refresh when 3 minutes remaining
const TOKEN_REFRESH_THRESHOLD = 3 * 60 * 1000; 
import { tokenService } from './tokenService';
import { isTokenExpired } from '../utils/security';

// Parse JWT and get expiration time
const getTokenExpiryTime = (token) => {
    if (!token) return null;
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload.exp * 1000; // Convert to milliseconds
    } catch (error) {
        console.error('Error parsing token:', error);
        return null;
    }
};

class AuthService {
    constructor() {
        this.tokenRefreshInterval = null;
        this.authContext = null;
        // Don't start the timer immediately - wait for initialization
    }

    // Start timer to check token expiration periodically
    startTokenRefreshTimer() {
        // Clear any existing interval
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }
        
        console.log("Starting token refresh timer");
        
        // Check token expiration every minute
        this.tokenRefreshInterval = setInterval(() => {
            this.checkTokenExpiration();
        }, 60000); // 1 minute
        
        // Also check immediately on start
        this.checkTokenExpiration();
    }

    // Check if token is close to expiration and refresh if needed
    async checkTokenExpiration() {
        const token = tokenService.getAccessToken();
        if (!token) return;
        
        const expiryTime = getTokenExpiryTime(token);
        if (!expiryTime) return;
        
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        
        console.log(`Token expires in ${Math.floor(timeUntilExpiry / 1000 / 60)} minutes ${Math.floor((timeUntilExpiry / 1000) % 60)} seconds`);
        
        // If token will expire within the threshold, refresh it
        if (timeUntilExpiry < TOKEN_REFRESH_THRESHOLD) {
            console.log("Token nearing expiration, refreshing...");
            try {
                const refreshResult = await this.refreshToken();
                console.log("Token refreshed successfully:", !!refreshResult);
                return refreshResult;
            } catch (error) {
                console.error('Failed to refresh token:', error);
                return null;
            }
        }
        
        return token;
    }

    // Helper method for API requests
    async apiRequest(endpoint, options = {}) {
        // Ensure endpoint starts with /api/ if not already
        if (!endpoint.startsWith('/api/') && !endpoint.startsWith('api/')) {
            endpoint = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        }
        
        const url = `${API_URL}${endpoint}`;
        console.log('Making API request to:', url);
        
        // Default request options
        const requestOptions = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include', // Include cookies in requests
        };
        
        // Add auth header if token exists
        const authHeader = tokenService.getAuthHeader();
        if (authHeader) {
            requestOptions.headers['Authorization'] = authHeader;
        }
        
        // Before making any request, check if token needs refreshing
        await this.checkTokenExpiration();
        
        try {
            const response = await fetch(url, requestOptions);
            
            // Handle 401 Unauthorized errors (token expired)
            if (response.status === 401) {
                try {
                    console.log("401 Unauthorized, attempting token refresh");
                    // Try to refresh the token
                    await this.refreshToken();
                    
                    // Retry the original request with new token
                    const newAuthHeader = tokenService.getAuthHeader();
                    if (newAuthHeader) {
                        console.log("Retrying original request with new token");
                        requestOptions.headers['Authorization'] = newAuthHeader;
                        return fetch(url, requestOptions);
                    }
                } catch (refreshError) {
                    console.error("Token refresh failed after 401:", refreshError);
                    // If refresh fails, logout
                    tokenService.clearTokens();
                    
                    // Only redirect if not already on login page
                    if (!window.location.pathname.includes('/login')) {
                        window.location.href = '/login';
                    }
                    throw refreshError;
                }
            }
            
            // Check if response is successful
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(JSON.stringify({ status: response.status, data: errorData }));
            }
            
            // Check if response has content
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            }
            
            return await response.text();
            
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    }

    // Refresh the token using the refresh token
    async refreshToken() {
        const refreshToken = tokenService.getRefreshToken();
        if (!refreshToken) {
            console.error("No refresh token available");
            throw new Error('No refresh token available');
        }
        
        try {
            console.log("Attempting to refresh token with refresh token");
            const response = await fetch(`${API_URL}/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies in request
                body: JSON.stringify({
                    refresh: refreshToken
                }),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("Token refresh failed with status:", response.status, errorData);
                throw new Error('Token refresh failed');
            }
            
            const data = await response.json();
            console.log("Token refresh successful, received new tokens");
            
            // Store access token securely
            if (data.access) {
                tokenService.setAccessToken(data.access);
            }
            
            // If refresh token rotation is enabled, update the refresh token too
            if (data.refresh) {
                tokenService.setRefreshToken(data.refresh);
            }
            
            return data;
        } catch (error) {
            console.error('Error refreshing token:', error);
            throw error;
        }
    }

    async login(credentials) {
        try {
            const response = await this.apiRequest('/api/token/', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });
            
            const { access, refresh } = response;
            
            // Store tokens securely
            tokenService.setAccessToken(access);
            tokenService.setRefreshToken(refresh);

            // Start token refresh timer
            this.startTokenRefreshTimer();

            // Update AuthContext if it exists
            if (this.authContext?.login) {
                await this.authContext.login(credentials);
            }
            
            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async logout() {
        try {
            const refreshToken = tokenService.getRefreshToken();
            if (refreshToken) {
                await this.apiRequest('/api/token/blacklist/', {
                    method: 'POST',
                    body: JSON.stringify({
                        refresh: refreshToken
                    }),
                });
            }
        } catch (error) {
            console.error('Error during logout:', error);
        } finally {
            // Clear token refresh interval
            if (this.tokenRefreshInterval) {
                clearInterval(this.tokenRefreshInterval);
            }
            
            // Clear all tokens
            tokenService.clearTokens();
        }
    }

    getAuthHeader() {
        return tokenService.getAuthHeader();
    }

    isAuthenticated() {
        return tokenService.isAuthenticated();
    }

    setAuthContext(context) {
        this.authContext = context;
    }
}

export const authService = new AuthService();