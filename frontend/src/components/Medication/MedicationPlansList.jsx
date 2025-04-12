import React from 'react';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { PencilSquareIcon, TrashIcon, BellIcon, BellSlashIcon } from '@heroicons/react/24/outline';

const MedicationPlansList = ({ plans, onEdit, onDelete, onToggleNotifications }) => {
  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  const formatTime = (timeStr) => {
    try {
      // Format time from "09:00:00" to "9:00 AM"
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return timeStr;
    }
  };

  const getNextDose = (plan) => {
    if (!plan.medication_times?.length) {
      // If no medication_times, use effective_time as the daily dose time
      if (plan.effective_time) {
        return `Daily at ${formatTime(plan.effective_time)}`;
      }
      return 'No scheduled doses';
    }
    
    const now = new Date();
    const today = now.getDay();
    const currentTime = now.toTimeString().slice(0, 5);
    
    // Find the next dose time
    const nextDose = plan.medication_times
      .filter(time => 
        time.is_daily || time.day_of_week === today || time.day_of_week === (today + 1) % 7
      )
      .find(time => {
        if (time.day_of_week === today) {
          return time.time > currentTime;
        }
        return true;
      });
    
    if (nextDose) {
      return nextDose.is_daily 
        ? `Next dose today at ${nextDose.time}`
        : `Next dose ${nextDose.day_of_week === today ? 'today' : 'tomorrow'} at ${nextDose.time}`;
    }
    
    return 'No upcoming doses';
  };

  // Helper to safely display instructions
  const displayInstructions = (plan) => {
    return plan.instructions || 'No specific instructions';
  };

  return (
    <div className="space-y-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-semibold text-gray-800">
                  {plan.medication_name || plan.custom_medication_name}
                </h3>
                <span className={`px-2 py-1 text-sm rounded-full ${
                  plan.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                </span>
              </div>

              <p className="text-gray-600 mt-1">{plan.description || 'No additional description'}</p>
              
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>Dose: {plan.dose_amount}</p>
                <p>Schedule Type: {plan.schedule_type}</p>
                <p>Started: {formatDate(plan.effective_date)}</p>
                {plan.effective_time && <p>Time: {formatTime(plan.effective_time)}</p>}
                {plan.end_date && <p>Ends: {formatDate(plan.end_date)}</p>}
                <p>Instructions: {displayInstructions(plan)}</p>
                {plan.medication_times?.length === 0 && plan.effective_time && (
                  <p className="text-teal-600 font-medium">Daily at {formatTime(plan.effective_time)}</p>
                )}
                {plan.medication_times?.length > 0 && (
                  <p className="text-teal-600 font-medium">{getNextDose(plan)}</p>
                )}
              </div>

              {plan.health_issue_data && (
                <div className="mt-2">
                  <span className="text-sm text-gray-500">
                    Related to: {plan.health_issue_data.title}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-start space-x-2">
              <button
                type="button"
                onClick={() => onToggleNotifications(plan.id, !plan.notifications_enabled)}
                className={`p-2 rounded hover:bg-gray-100 ${
                  plan.notifications_enabled ? 'text-teal-600' : 'text-gray-400'
                }`}
                title={`${plan.notifications_enabled ? 'Disable' : 'Enable'} notifications`}
              >
                {plan.notifications_enabled ? (
                  <BellIcon className="w-5 h-5" />
                ) : (
                  <BellSlashIcon className="w-5 h-5" />
                )}
              </button>
              
              <button
                type="button"
                onClick={() => onEdit(plan)}
                className="p-2 rounded hover:bg-gray-100 text-blue-600"
                title="Edit plan"
              >
                <PencilSquareIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={() => onDelete(plan.id)}
                className="p-2 rounded hover:bg-gray-100 text-red-600"
                title="Delete plan"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {plan.medication_times?.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Scheduled Times:</h4>
              <div className="flex flex-wrap gap-2">
                {plan.medication_times.map((time, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 px-3 py-1 rounded-full text-sm text-gray-600"
                  >
                    {time.time}
                    {time.is_daily ? (
                      <span className="ml-1">daily</span>
                    ) : (
                      <span className="ml-1">
                        on {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][time.day_of_week]}
                      </span>
                    )}
                    {time.dose_override && (
                      <span className="ml-1">({time.dose_override})</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {(!plan.medication_times || plan.medication_times.length === 0) && (
            <div className="mt-4 border-t pt-4">
              <p className="text-sm text-gray-500 italic">
                {plan.effective_time 
                  ? `This medication is taken daily at ${formatTime(plan.effective_time)}.` 
                  : 'This medication has no scheduled times.'}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

MedicationPlansList.propTypes = {
  plans: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      medication_name: PropTypes.string,
      custom_medication_name: PropTypes.string,
      status: PropTypes.string.isRequired,
      description: PropTypes.string,
      dose_amount: PropTypes.string.isRequired,
      schedule_type: PropTypes.string.isRequired,
      effective_date: PropTypes.string.isRequired,
      effective_time: PropTypes.string,
      end_date: PropTypes.string,
      instructions: PropTypes.string,
      notifications_enabled: PropTypes.bool,
      health_issue_data: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        title: PropTypes.string.isRequired,
      }),
      medication_times: PropTypes.arrayOf(
        PropTypes.shape({
          time: PropTypes.string.isRequired,
          is_daily: PropTypes.bool.isRequired,
          day_of_week: PropTypes.number,
          dose_override: PropTypes.string,
        })
      ),
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleNotifications: PropTypes.func.isRequired,
};

export default MedicationPlansList;