/**
 * Security utility functions for securing frontend application
 */

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} input - User provided string input
 * @returns {string} Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Validate JWT token format (does not verify signature)
 * @param {string} token - JWT token to validate
 * @returns {boolean} Whether token has valid format
 */
export const isValidJwtFormat = (token) => {
  if (!token || typeof token !== 'string') return false;
  
  // JWT tokens consist of three parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  
  // Each part should be a base64url encoded string
  try {
    parts.forEach(part => {
      // Test if part is base64url encoded
      if (!/^[A-Za-z0-9_-]+$/g.test(part)) {
        throw new Error('Invalid token part');
      }
    });
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} Whether token is expired
 */
export const isTokenExpired = (token) => {
  if (!isValidJwtFormat(token)) return true;
  
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    const { exp } = JSON.parse(jsonPayload);
    
    // Token is expired if current time is after expiration
    return exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error parsing token:', error);
    return true;
  }
};

/**
 * Safely store sensitive data in session/local storage with encryption
 * Note: This is still not 100% secure but adds a layer of obfuscation
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {boolean} useSessionStorage - Whether to use session storage instead of local storage
 */
export const secureStore = (key, value, useSessionStorage = false) => {
  if (!key) return;
  
  try {
    // Convert value to string if it's not already
    const valueStr = typeof value === 'string' ? value : JSON.stringify(value);
    
    // Simple obfuscation (not true encryption, just to prevent casual inspection)
    const obfuscated = btoa(encodeURIComponent(valueStr));
    
    // Store in selected storage
    const storage = useSessionStorage ? sessionStorage : localStorage;
    storage.setItem(key, obfuscated);
  } catch (error) {
    console.error('Error storing data securely:', error);
  }
};

/**
 * Retrieve data stored with secureStore
 * @param {string} key - Storage key
 * @param {boolean} useSessionStorage - Whether to use session storage instead of local storage
 * @returns {any} Retrieved value
 */
export const secureRetrieve = (key, useSessionStorage = false) => {
  if (!key) return null;
  
  try {
    const storage = useSessionStorage ? sessionStorage : localStorage;
    const obfuscated = storage.getItem(key);
    
    if (!obfuscated) return null;
    
    // Deobfuscate
    const deobfuscated = decodeURIComponent(atob(obfuscated));
    
    // Try to parse as JSON, but return as string if not valid JSON
    try {
      return JSON.parse(deobfuscated);
    } catch {
      return deobfuscated;
    }
  } catch (error) {
    console.error('Error retrieving secure data:', error);
    return null;
  }
};

/**
 * Generate a Content Security Policy header value
 * @returns {string} CSP header value
 */
export const generateCSP = () => {
  return `
    default-src 'self';
    script-src 'self' https://cdn.jsdelivr.net https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: https:;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://api.example.com wss://ws.example.com;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s+/g, ' ').trim();
};

/**
 * Create security headers for meta tags
 * @returns {Object} Security headers object
 */
export const getSecurityHeaders = () => {
  return {
    'Content-Security-Policy': generateCSP(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), interest-cohort=()'
  };
};