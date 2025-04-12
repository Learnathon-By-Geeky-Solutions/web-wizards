import React from 'react';
import PropTypes from 'prop-types';

const SymptomCard = ({ symptom }) => {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{symptom.name}</h3>
        <span className={`px-2 py-1 rounded-full text-sm font-medium ${getSeverityColor(symptom.severity)}`}>
          {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
        </span>
      </div>
      {symptom.description && (
        <p className="text-gray-600 mb-2">{symptom.description}</p>
      )}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <div>
          <span>{new Date(symptom.recorded_date).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{new Date(`2000-01-01T${symptom.recorded_time}`).toLocaleTimeString([], { timeStyle: 'short' })}</span>
        </div>
        {symptom.duration && (
          <span className="text-gray-500">Duration: {symptom.duration}</span>
        )}
      </div>
    </div>
  );
};

SymptomCard.propTypes = {
  symptom: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    severity: PropTypes.oneOf(['mild', 'moderate', 'severe']).isRequired,
    recorded_date: PropTypes.string.isRequired,
    recorded_time: PropTypes.string.isRequired,
    duration: PropTypes.string
  }).isRequired
};

export default SymptomCard;
