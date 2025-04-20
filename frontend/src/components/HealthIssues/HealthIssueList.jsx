import React from 'react';
import PropTypes from 'prop-types';
import HealthIssueCard from './HealthIssueCard';

const HealthIssueList = ({ issues }) => {
  return (
    <div className="grid grid-cols-1 gap-4 mt-6">
      {issues.map((issue) => (
        <HealthIssueCard key={issue.id} issue={issue} />
      ))}
    </div>
  );
};
HealthIssueList.propTypes = {
  issues: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      // add other properties of issue here
    })
  ).isRequired,
};

export default HealthIssueList;