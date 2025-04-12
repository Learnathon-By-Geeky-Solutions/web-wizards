import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchSymptomsByHealthIssue } from '../../api/healthIssuesApi';

const SymptomsList = ({ healthIssueId, onRefresh }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSymptoms = async () => {
    try {
      setLoading(true);
      const data = await fetchSymptomsByHealthIssue(healthIssueId);
      setSymptoms(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load symptoms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSymptoms();
  }, [healthIssueId]);

  // Allow parent components to trigger a refresh
  useEffect(() => {
    if (onRefresh) {
      loadSymptoms();
    }
  }, [onRefresh]);

  if (loading) {
    return <div className="text-center py-4">Loading symptoms...</div>;
  }

  if (symptoms.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">No symptoms recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {symptoms.map((symptom) => (
        <div
          key={symptom.id}
          className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg">{symptom.name}</h3>
              <p className="text-sm text-gray-600">
                Recorded on: {new Date(symptom.recorded_date).toLocaleDateString()}
                {symptom.recorded_time && ` at ${symptom.recorded_time}`}
              </p>
              {symptom.duration && (
                <p className="text-sm text-gray-600">Duration: {symptom.duration}</p>
              )}
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                symptom.severity === 'severe'
                  ? 'bg-red-100 text-red-800'
                  : symptom.severity === 'moderate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {symptom.severity.charAt(0).toUpperCase() + symptom.severity.slice(1)}
            </span>
          </div>
          {symptom.description && (
            <p className="mt-2 text-gray-700">{symptom.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};

SymptomsList.propTypes = {
  healthIssueId: PropTypes.string.isRequired,
  onRefresh: PropTypes.bool
};

export default SymptomsList;
