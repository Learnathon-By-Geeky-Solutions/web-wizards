import React from 'react';
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

export default HealthIssueList;