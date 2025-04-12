import React from 'react';
import Spinner from './Spinner';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="large" className="mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">Loading AmarHealth</h2>
        <p className="text-gray-500">Please wait...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;