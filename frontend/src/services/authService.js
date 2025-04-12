const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const TOKEN_REFRESH_THRESHOLD = 3 * 60 * 1000; // 3 minutes in milliseconds (adjusted for 15-min token)

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
        this.startTokenRefreshTimer();
    }

    // Start timer to check token expiration periodically
    startTokenRefreshTimer() {
        // Clear any existing interval
        if (this.tokenRefreshInterval) {
            clearInterval(this.tokenRefreshInterval);
        }
        
        // Check token expiration every minute
        this.tokenRefreshInterval = setInterval(() => {
            this.checkTokenExpiration();
        }, 60000); // 1 minute
    }

    // Check if token is close to expiration and refresh if needed
    async checkTokenExpiration() {
        const token = localStorage.getItem('accessToken');
        if (!token) return;
        
        const expiryTime = getTokenExpiryTime(token);
        if (!expiryTime) return;
        
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        
        // If token will expire within the threshold, refresh it
        if (timeUntilExpiry < TOKEN_REFRESH_THRESHOLD) {
            try {
                await this.refreshToken();
            } catch (error) {
                console.error('Failed to refresh token:', error);
            }
        }
    }

    // Helper method for API requests
    async apiRequest(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        
        // Default request options
        const requestOptions = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };
        
        // Add auth header if token exists
        const token = localStorage.getItem('accessToken');
        if (token) {
            requestOptions.headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Before making any request, check if token needs refreshing
        await this.checkTokenExpiration();
        
        try {
            const response = await fetch(url, requestOptions);
            
            // Handle 401 Unauthorized errors (token expired)
            if (response.status === 401) {
                try {
                    // Try to refresh the token
                    await this.refreshToken();
                    
                    // Retry the original request with new token
                    const newToken = localStorage.getItem('accessToken');
                    if (newToken) {
                        requestOptions.headers['Authorization'] = `Bearer ${newToken}`;
                        return fetch(url, requestOptions);
                    }
                } catch (refreshError) {
                    // If refresh fails, logout
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
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
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        
        try {
            const response = await fetch(`${API_URL}/api/token/refresh/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh: refreshToken
                }),
            });
            
            if (!response.ok) {
                throw new Error('Token refresh failed');
            }
            
            const data = await response.json();
            const { access } = data;
            
            localStorage.setItem('accessToken', access);
            
            // If refresh token rotation is enabled, update the refresh token too
            if (data.refresh) {
                localStorage.setItem('refreshToken', data.refresh);
            }
            
            return access;
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
            
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);

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
            const refreshToken = localStorage.getItem('refreshToken');
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
            
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }

    getAuthHeader() {
        const token = localStorage.getItem('accessToken');
        return token ? `Bearer ${token}` : '';
    }

    isAuthenticated() {
        return !!localStorage.getItem('accessToken');
    }

    setAuthContext(context) {
        this.authContext = context;
    }
}

export const authService = new AuthService();