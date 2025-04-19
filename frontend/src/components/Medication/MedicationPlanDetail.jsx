import React from 'react';
import PropTypes from 'prop-types';
import { formatDate, formatTime } from '../../utils/dateUtils';

const MedicationPlanDetail = ({ plan }) => {
  if (!plan) return null;

  const renderScheduleTypeInfo = () => {
    switch (plan.schedule_type) {
      case 'daily':
        return <span>Daily</span>;
      case 'when_needed':
        return <span>When Needed</span>;
      case 'every_x_days':
        return <span>Every {plan.every_x_days} days</span>;
      case 'specific_days':
        const daysOfWeek = {
          'mon': 'Monday',
          'tue': 'Tuesday',
          'wed': 'Wednesday',
          'thu': 'Thursday',
          'fri': 'Friday',
          'sat': 'Saturday',
          'sun': 'Sunday'
        };
        const days = plan.specific_days_of_week?.map(day => daysOfWeek[day]).join(', ');
        return <span>Specific days: {days || 'None selected'}</span>;
      case 'cycle':
        return (
          <span>
            Take for {plan.cycle_active_days} days, 
            rest for {plan.cycle_rest_days} days
          </span>
        );
      default:
        return <span>Unknown schedule type</span>;
    }
  };

  const renderFrequencyInfo = () => {
    if (plan.schedule_type === 'when_needed') {
      return <span>As needed</span>;
    }

    switch (plan.frequency_type) {
      case 'times_per_day':
        return <span>{plan.times_per_day} times per day</span>;
      case 'every_x_hours':
        return <span>Every {plan.every_x_hours} hours</span>;
      default:
        return <span>Unknown frequency</span>;
    }
  };

  const renderDurationInfo = () => {
    switch (plan.duration_type) {
      case 'ongoing':
        return <span>Ongoing</span>;
      case 'for_x_days':
        return <span>For {plan.number_of_days} days</span>;
      case 'until_date':
        return <span>Until {formatDate(plan.end_date)}</span>;
      default:
        return <span>Unknown duration</span>;
    }
  };

  const getMedicationName = () => {
    if (plan.medication_data) return plan.medication_data.full_name;
    return plan.custom_medication_name || 'Unnamed medication';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{getMedicationName()}</h2>
      
      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`px-3 py-1 rounded-full text-sm ${
            plan.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {plan.status}
        </span>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Dose Information</h3>
          <div className="text-gray-600">{plan.dose_amount}</div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Health Issue</h3>
          <div className="text-gray-600">
            {plan.health_issue_data?.title || 'None specified'}
          </div>
        </div>
      </div>

      {/* Schedule Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Schedule</h3>
          <div className="text-gray-600">{renderScheduleTypeInfo()}</div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Frequency</h3>
          <div className="text-gray-600">{renderFrequencyInfo()}</div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Duration</h3>
          <div className="text-gray-600">{renderDurationInfo()}</div>
        </div>
      </div>

      {/* Effective Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Start Date</h3>
          <div className="text-gray-600">{formatDate(plan.effective_date)}</div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Start Time</h3>
          <div className="text-gray-600">{formatTime(plan.effective_time)}</div>
        </div>
      </div>

      {/* Instructions and Notes */}
      {(plan.instructions || plan.notes) && (
        <div className="mb-6">
          {plan.instructions && (
            <div className="mb-4">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Instructions</h3>
              <div className="text-gray-600 whitespace-pre-line">{plan.instructions}</div>
            </div>
          )}
          
          {plan.notes && (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">Notes</h3>
              <div className="text-gray-600 whitespace-pre-line">{plan.notes}</div>
            </div>
          )}
        </div>
      )}

      {/* Medication Times */}
      {plan.medication_times?.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Scheduled Times</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day/Cycle
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dose Override
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {plan.medication_times.map((time, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {formatTime(time.time)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {time.is_daily ? (
                        'Daily'
                      ) : time.day_of_week_name ? (
                        time.day_of_week_name
                      ) : time.is_active_cycle_day !== undefined ? (
                        time.is_active_cycle_day ? 'Active days' : 'Rest days'
                      ) : time.day_in_cycle ? (
                        `Day ${time.day_in_cycle} in cycle`
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                      {time.dose_override || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {time.notes || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

MedicationPlanDetail.propTypes = {
  plan: PropTypes.object
};

export default MedicationPlanDetail;