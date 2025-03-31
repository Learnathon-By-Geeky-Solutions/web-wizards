import { captureException, addBreadcrumb } from './sentry';
import PerformanceMonitoring from './performanceMonitoring';

/**
 * API client with Sentry error tracking built-in
 */
class SentryApiClient {
  /**
   * Make an API request with Sentry tracking
   * @param {string} url - The URL to fetch
   * @param {Object} options - Fetch options
   * @returns {Promise} - The API response
   */
  static async request(url, options = {}) {
    // Create a performance span for this request
    const span = PerformanceMonitoring.trackApiRequest(url, options.method || 'GET');
    
    // Add a breadcrumb for the API call
    addBreadcrumb({
      category: 'xhr',
      message: `API request: ${options.method || 'GET'} ${url}`,
      level: 'info',
      data: {
        url,
        method: options.method || 'GET',
        ...(options.body ? { bodySize: JSON.stringify(options.body).length } : {})
      }
    });
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {})
        },
        ...options
      });
      
      // Add response info to breadcrumb
      addBreadcrumb({
        category: 'xhr',
        message: `API response: ${response.status} for ${options.method || 'GET'} ${url}`,
        level: response.ok ? 'info' : 'warning',
        data: {
          status: response.status,
          statusText: response.statusText,
          url
        }
      });
      
      // If response is not OK, throw an error to be caught below
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = await response.text();
        }
        
        const error = new Error(`API Error ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.response = response;
        error.data = errorData;
        throw error;
      }
      
      // Parse the response
      const data = await response.json();
      
      // Finish the performance span
      if (span) span.finish();
      
      return data;
    } catch (error) {
      // Capture the exception in Sentry
      captureException(error, {
        tags: {
          api_url: url,
          api_method: options.method || 'GET'
        },
        extra: {
          requestOptions: {
            ...options,
            headers: options.headers ? { ...options.headers } : {},
            // Don't include auth headers or sensitive data
            body: options.body ? 
              (typeof options.body === 'string' ? 'REDACTED' : { ...options.body }) 
              : undefined
          }
        }
      });
      
      // Finish the performance span with error status
      if (span) {
        span.setStatus('internal_error');
        span.finish();
      }
      
      // Re-throw the error
      throw error;
    }
  }
  
  /**
   * Make a GET request
   * @param {string} url - The URL to fetch
   * @param {Object} options - Additional options
   * @returns {Promise} - The API response
   */
  static get(url, options = {}) {
    return this.request(url, { ...options, method: 'GET' });
  }
  
  /**
   * Make a POST request
   * @param {string} url - The URL to fetch
   * @param {Object} data - The data to send
   * @param {Object} options - Additional options
   * @returns {Promise} - The API response
   */
  static post(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
  
  /**
   * Make a PUT request
   * @param {string} url - The URL to fetch
   * @param {Object} data - The data to send
   * @param {Object} options - Additional options
   * @returns {Promise} - The API response
   */
  static put(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  
  /**
   * Make a PATCH request
   * @param {string} url - The URL to fetch
   * @param {Object} data - The data to send
   * @param {Object} options - Additional options
   * @returns {Promise} - The API response
   */
  static patch(url, data, options = {}) {
    return this.request(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
  
  /**
   * Make a DELETE request
   * @param {string} url - The URL to fetch
   * @param {Object} options - Additional options
   * @returns {Promise} - The API response
   */
  static delete(url, options = {}) {
    return this.request(url, {
      ...options,
      method: 'DELETE'
    });
  }
}

export default SentryApiClient;