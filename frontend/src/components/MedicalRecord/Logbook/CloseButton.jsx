import React from 'react';
import PropTypes from 'prop-types';
import { XMarkIcon } from '@heroicons/react/24/outline';

const CloseButton = ({ setCurrentPage }) => (
  <button
    onClick={() => setCurrentPage('LOGBOOK')}
    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
  >
    <XMarkIcon className="w-6 h-6" />
  </button>
);

CloseButton.propTypes = {
  setCurrentPage: PropTypes.func.isRequired,
};

export default CloseButton;