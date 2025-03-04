import React, { useState } from "react";
import PropTypes from 'prop-types';
import { useNavigate } from "react-router-dom";

const HealthIssueCard = ({ issue }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Format date and time for display
  const formatDateTime = (date, time) => {
    if (!date) return "No date provided";
    try {
      const dateObj = time ? new Date(`${date}T${time}`) : new Date(date);
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return date;
    }
  };

  // Navigate to different sections with current health issue context
  const handleTabClick = (tabName, event) => {
    event.stopPropagation(); // Prevent card expansion when clicking tabs
    
    switch(tabName) {
      case "Symptoms":
        navigate(`/medicalrecord/symptoms?issueId=${issue.id}`, { state: { currentIssue: issue } });
        break;
      case "Vitals":
        navigate(`/medicalrecord/logbook?issueId=${issue.id}`, { state: { currentIssue: issue } });
        break;
      case "Documents":
        navigate(`/medicalrecord/documents?issueId=${issue.id}`, { state: { currentIssue: issue } });
        break;
      case "Labs":
        navigate(`/medicalrecord/labresult?issueId=${issue.id}`, { state: { currentIssue: issue } });
        break;
      case "Medications":
        navigate(`/medication?issueId=${issue.id}`, { state: { currentIssue: issue } });
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className="bg-white shadow-md rounded-lg p-6 border-l-4 border-teal-500 w-full mb-4 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
        {/* Title and date */}
        <div className="mb-3 md:mb-0">
          <h2 className="text-lg font-semibold text-gray-800">{issue.title}</h2>
          <p className="text-gray-500 text-sm">
            📅 {formatDateTime(issue.date, issue.time)}
          </p>
        </div>
        
        {/* Tabs and actions in the same row */}
        <div className="flex flex-col md:flex-row md:items-center">
          <div className="flex flex-wrap gap-2 mb-2 md:mb-0 md:mr-4">
            {["Symptoms", "Vitals", "Medications", "Documents", "Labs"].map((tab) => (
              <button 
                key={tab} 
                onClick={(e) => handleTabClick(tab, e)}
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-md text-sm hover:bg-teal-100 transition-colors"
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            <button 
              className="text-blue-500 hover:text-blue-700"
              onClick={(e) => { e.stopPropagation(); /* Edit logic */ }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button 
              className="text-red-500 hover:text-red-700"
              onClick={(e) => { e.stopPropagation(); /* Delete logic */ }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Description (shown when expanded) */}
      {expanded && (
        <div className="mt-4 text-gray-700 bg-gray-50 p-3 rounded-md">
          {issue.notes || "No additional notes provided for this health issue."}
        </div>
      )}
    </div>
  );
};
HealthIssueCard.propTypes = {
  issue: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string,
    time: PropTypes.string,
    notes: PropTypes.string,
  }).isRequired,
};

export default HealthIssueCard;