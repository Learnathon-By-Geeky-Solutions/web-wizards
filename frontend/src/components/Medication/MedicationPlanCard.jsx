import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { FaClock, FaCalendarAlt, FaPills, FaNotesMedical } from 'react-icons/fa';

const MedicationPlanCard = ({ plan, onEdit, onDelete }) => {
  const formatSchedule = (plan) => {
    switch (plan.schedule_type) {
      case 'when_needed':
        return 'When needed';
      case 'daily':
        return 'Daily';
      case 'every_x_days':
        return `Every ${plan.frequency_days} days`;
      case 'specific_days':
        return `On ${plan.specific_days}`;
      case 'cycle':
        return `${plan.cycle_active_days} days on, ${plan.cycle_rest_days} days off`;
      default:
        return 'Unknown schedule';
    }
  };

  // Get medication name from either the medication relation or custom name
  const medicationName = plan.medication_data ? plan.medication_data.name : plan.custom_medication_name;
  
  // Format the effective date
  const formattedDate = new Date(plan.effective_date).toLocaleDateString();
  
  // Determine if there's a medication link available
  const hasMedicationLink = plan.medication_data && plan.medication_data.details_url;

  return (
    <div className={`bg-white p-4 rounded-lg shadow-md border-l-4 ${plan.status === 'Active' ? 'border-teal-500' : 'border-gray-400'}`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-lg text-gray-800">
            {medicationName}
            {plan.status === 'Inactive' && (
              <span className="ml-2 text-xs uppercase bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                Inactive
              </span>
            )}
          </h3>
          <p className="text-gray-600 text-sm">{plan.dose_amount}, {plan.times_per_day} times/day</p>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => onEdit(plan)} 
            className="text-blue-500 hover:text-blue-700"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(plan.id)} 
            className="text-red-500 hover:text-red-700"
          >
            Delete
          </button>
        </div>
      </div>
      
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <FaClock className="text-teal-500" />
          <span>{formatSchedule(plan)}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <FaCalendarAlt className="text-teal-500" />
          <span>Since {formattedDate}</span>
        </div>
      </div>
      
      {/* Only show health issue if it exists */}
      {plan.health_issue_data && (
        <div className="mt-2 flex items-center space-x-1 text-sm text-gray-600">
          <FaNotesMedical className="text-teal-500" />
          <span>For: {plan.health_issue_data.title}</span>
        </div>
      )}
      
      {/* Only show medication link if it exists */}
      {hasMedicationLink && (
        <div className="mt-2">
          <a 
            href={plan.medication_data.details_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-teal-500 hover:text-teal-700 text-sm flex items-center"
          >
            <FaPills className="mr-1" />
            View medication details
          </a>
        </div>  
      )}
      
      {/* Show notes if they exist */}
      {plan.notes && (
        <div className="mt-2 text-sm text-gray-600">
          <p className="font-medium">Notes:</p>
          <p className="italic">{plan.notes}</p>
        </div>
      )}
    </div>
  );
};

MedicationPlanCard.propTypes = {
  plan: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default MedicationPlanCard;