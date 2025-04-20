import React from 'react';
import PropTypes from 'prop-types';

const Spinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className={`animate-spin rounded-full border-t-2 border-b-2 border-teal-500 ${sizeClasses[size]} ${className}`} />
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  className: PropTypes.string
};

export default Spinner;