import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';

const LoadingSpinner = ({ size = 'medium', text = 'Loading...', className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Spinner size={size} />
      {text && <p className="mt-2 text-gray-600">{text}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string,
  className: PropTypes.string
};

export default LoadingSpinner;