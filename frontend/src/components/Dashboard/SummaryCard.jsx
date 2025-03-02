import React from 'react';

const SummaryCard = ({ title, content }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {typeof content === 'string' ? (
        <p className="text-gray-600">{content}</p>
      ) : (
        content
      )}
    </div>
  );
};

export default SummaryCard;