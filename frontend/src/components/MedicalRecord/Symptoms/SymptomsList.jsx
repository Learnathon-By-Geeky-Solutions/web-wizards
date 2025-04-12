import React from 'react';
import PropTypes from 'prop-types';
import SymptomCard from './SymptomCard';
import { useGetHealthIssueSymptomsQuery } from '../../../api/healthIssuesApi';

const SymptomsList = ({ healthIssueId, searchQuery }) => {
  const { data: symptoms = [], isLoading, error } = useGetHealthIssueSymptomsQuery(
    healthIssueId === 'all' ? null : healthIssueId
  );

  // Filter symptoms based on search query
  const filteredSymptoms = searchQuery
    ? symptoms.filter(symptom => 
        symptom.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        symptom.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : symptoms;

  if (isLoading) {
    return (
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <p>Loading symptoms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Error loading symptoms. Please try again later.</p>
      </div>
    );
  }

  if (filteredSymptoms.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>{searchQuery ? 'No symptoms match your search.' : 'No symptoms recorded yet.'}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredSymptoms.map(symptom => (
        <SymptomCard key={symptom.id} symptom={symptom} />
      ))}
    </div>
  );
};

SymptomsList.propTypes = {
  healthIssueId: PropTypes.string,
  searchQuery: PropTypes.string
};

SymptomsList.defaultProps = {
  healthIssueId: null,
  searchQuery: ''
};

export default SymptomsList;
