import React from 'react';

const EmptyState = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mb-4">
        <svg
          className="w-12 h-12 text-teal-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 4v16M4 12h16" />
        </svg>
      </div>
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
};

export default EmptyState;