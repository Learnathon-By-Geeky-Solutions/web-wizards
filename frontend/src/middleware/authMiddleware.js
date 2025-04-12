import { refreshUserSession } from '../store/slices/userSlice';
import jwtDecode from 'jwt-decode';

// Time before token expiry to trigger refresh (in milliseconds)
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export const createAuthMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const state = store.getState();
    
    // Check token expiration on relevant actions
    if (state.user.isAuthenticated) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const expirationTime = decodedToken.exp * 1000; // Convert to milliseconds
                const currentTime = Date.now();
                
                // If token is close to expiring, refresh it
                if (expirationTime - currentTime < REFRESH_THRESHOLD) {
                    store.dispatch(refreshUserSession());
                }
            } catch (error) {
                console.error('Error checking token expiration:', error);
            }
        }
    }
    
    return result;
};