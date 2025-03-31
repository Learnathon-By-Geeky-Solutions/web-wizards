import { useEffect, useRef } from 'react';
import { captureMessage, addBreadcrumb } from '../utils/sentry';

/**
 * Custom hook for Sentry page/component tracking
 * 
 * @param {string} componentName - The name of the component being tracked
 * @param {Object} options - Additional options for tracking
 * @param {Object} options.metadata - Additional metadata to include with events
 * @param {boolean} options.trackPageView - Whether to track this as a page view
 * @returns {Object} - Utility functions for tracking
 */
const useSentryTracking = (componentName, options = {}) => {
  const {
    metadata = {},
    trackPageView = true
  } = options;

  const isInitialized = useRef(false);

  // Track component mount and unmount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    
    // Add breadcrumb for component mount
    addBreadcrumb({
      category: 'lifecycle',
      message: `${componentName} mounted`,
      level: 'info',
      data: metadata
    });
    
    // Track as page view if requested
    if (trackPageView) {
      captureMessage(`Viewed ${componentName}`, {
        level: 'info',
        extra: metadata
      });
    }
    
    // Cleanup function to run on unmount
    return () => {
      addBreadcrumb({
        category: 'lifecycle',
        message: `${componentName} unmounted`,
        level: 'info'
      });
    };
  }, [componentName, trackPageView, metadata]);
  
  // Return tracking utility functions
  return {
    /**
     * Track a user action
     * @param {string} action - The action being performed
     * @param {Object} data - Additional data about the action
     */
    trackAction: (action, data = {}) => {
      addBreadcrumb({
        category: 'ui.action',
        message: `${action} in ${componentName}`,
        level: 'info',
        data
      });
    },
    
    /**
     * Track an API request
     * @param {string} endpoint - The API endpoint being called
     * @param {Object} details - Additional details about the request
     */
    trackApiRequest: (endpoint, details = {}) => {
      addBreadcrumb({
        category: 'xhr',
        message: `API request to ${endpoint}`,
        level: 'info',
        data: {
          component: componentName,
          endpoint,
          ...details
        }
      });
    },
    
    /**
     * Track a success event 
     * @param {string} event - The success event
     * @param {Object} data - Additional data about the event
     */
    trackSuccess: (event, data = {}) => {
      captureMessage(`${event} in ${componentName}`, {
        level: 'info',
        extra: {
          ...metadata,
          ...data
        }
      });
    },
    
    /**
     * Track a warning event
     * @param {string} event - The warning event
     * @param {Object} data - Additional data about the event
     */
    trackWarning: (event, data = {}) => {
      captureMessage(`${event} in ${componentName}`, {
        level: 'warning',
        extra: {
          ...metadata,
          ...data
        }
      });
    }
  };
};

export default useSentryTracking;