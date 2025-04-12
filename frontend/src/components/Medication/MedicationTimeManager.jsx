import React, { useState } from 'react';
import PropTypes from 'prop-types';

const MedicationTimeManager = ({ onTimesSave }) => {
  const [times, setTimes] = useState([]);
  const [time, setTime] = useState('');
  const [isDaily, setIsDaily] = useState(false);
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [doseOverride, setDoseOverride] = useState('');

  const daysOfWeek = [
    { value: 0, label: 'Monday' },
    { value: 1, label: 'Tuesday' },
    { value: 2, label: 'Wednesday' },
    { value: 3, label: 'Thursday' },
    { value: 4, label: 'Friday' },
    { value: 5, label: 'Saturday' },
    { value: 6, label: 'Sunday' }
  ];

  const handleAddTime = () => {
    if (!time) return;

    const newTime = {
      time,
      is_daily: isDaily,
      day_of_week: isDaily ? null : parseInt(dayOfWeek),
      dose_override: doseOverride || null
    };

    setTimes([...times, newTime]);
    // Reset form
    setTime('');
    setDoseOverride('');
  };

  const handleRemoveTime = (index) => {
    setTimes(times.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onTimesSave(times);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Medication Times</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dose Override (Optional)
          </label>
          <input
            type="text"
            value={doseOverride}
            onChange={(e) => setDoseOverride(e.target.value)}
            placeholder="e.g., 1 tablet"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDaily"
            checked={isDaily}
            onChange={(e) => setIsDaily(e.target.checked)}
            className="rounded text-teal-600"
          />
          <label htmlFor="isDaily" className="text-sm font-medium text-gray-700">
            Take daily
          </label>
        </div>

        {!isDaily && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Day of Week
            </label>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required={!isDaily}
            >
              <option value="">Select a day</option>
              {daysOfWeek.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={handleAddTime}
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          Add Time
        </button>
      </div>

      {times.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium mb-2">Scheduled Times:</h4>
          <div className="space-y-2">
            {times.map((t, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 p-2 rounded"
              >
                <div>
                  <span className="font-medium">{t.time}</span>
                  {t.is_daily ? (
                    <span className="ml-2 text-sm text-gray-600">Daily</span>
                  ) : (
                    <span className="ml-2 text-sm text-gray-600">
                      {daysOfWeek.find(d => d.value === t.day_of_week)?.label}
                    </span>
                  )}
                  {t.dose_override && (
                    <span className="ml-2 text-sm text-gray-600">
                      ({t.dose_override})
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveTime(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {times.length > 0 && (
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Schedule
          </button>
        </div>
      )}
    </div>
  );
};

MedicationTimeManager.propTypes = {
  onTimesSave: PropTypes.func.isRequired,
};

export default MedicationTimeManager;