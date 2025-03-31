import { Sentry } from './sentry';

/**
 * Utility for tracking performance metrics with Sentry
 */
class PerformanceMonitoring {
  /**
   * Start a performance transaction
   * @param {string} name - Name of the transaction
   * @param {string} op - Operation type (e.g., 'navigation', 'http.request')
   * @param {Object} data - Additional data to include with the transaction
   * @returns {Object} - Transaction object
   */
  static startTransaction(name, op, data = {}) {
    const transaction = Sentry.startTransaction({
      name,
      op,
      data
    });

    // Store as active transaction
    Sentry.getCurrentHub().configureScope(scope => {
      scope.setSpan(transaction);
    });

    return transaction;
  }

  /**
   * Start a child span within a transaction
   * @param {string} name - Name of the span
   * @param {string} op - Operation type
   * @param {Object} parentTransaction - Parent transaction
   * @returns {Object} - Span object
   */
  static startSpan(name, op, parentTransaction) {
    if (!parentTransaction) {
      const activeTransaction = Sentry.getCurrentHub().getScope().getSpan();
      if (!activeTransaction) {
        return null;
      }
      parentTransaction = activeTransaction;
    }

    return parentTransaction.startChild({ op, description: name });
  }

  /**
   * Track React component render performance
   * @param {string} componentName - Name of the component
   * @returns {Function} - Function to finish the span
   */
  static trackComponentRender(componentName) {
    const span = this.startSpan(
      `Render: ${componentName}`,
      'ui.render'
    );

    return () => {
      if (span) {
        span.finish();
      }
    };
  }

  /**
   * Track API request performance
   * @param {string} url - The URL being requested
   * @param {string} method - HTTP method
   * @returns {Object} - The span object with a finish method
   */
  static trackApiRequest(url, method = 'GET') {
    return this.startSpan(
      `${method} ${url}`,
      'http.request'
    );
  }

  /**
   * Track a specific operation performance
   * @param {string} name - Name of the operation
   * @param {Function} operation - Function to execute and measure
   * @param {string} category - Category of operation
   * @returns {any} - Result of the operation
   */
  static async trackOperation(name, operation, category = 'function') {
    const span = this.startSpan(name, category);
    
    try {
      const result = await operation();
      return result;
    } finally {
      if (span) {
        span.finish();
      }
    }
  }
}

export default PerformanceMonitoring;