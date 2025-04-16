import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FiClock } from 'react-icons/fi';

const MedicationTimeManager = ({ 
  onTimesSave, 
  scheduleType, 
  frequencyType, 
  cycleActivedays, 
  cycleRestDays, 
  specificDaysOfWeek 
}) => {
  const [times, setTimes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  // Reset times when schedule type or frequency type changes
  useEffect(() => {
    generateDefaultTimes();
  }, [scheduleType, frequencyType]);

  // Listen for changes in "times_per_day" and "every_x_hours" inputs
  useEffect(() => {
    const timesPerDayInput = document.querySelector('input[name="times_per_day"]');
    const everyXHoursInput = document.querySelector('input[name="every_x_hours"]');
    
    const handleInputChange = () => {
      generateDefaultTimes();
    };
    
    if (timesPerDayInput) {
      timesPerDayInput.addEventListener('change', handleInputChange);
    }
    
    if (everyXHoursInput) {
      everyXHoursInput.addEventListener('change', handleInputChange);
    }
    
    return () => {
      if (timesPerDayInput) {
        timesPerDayInput.removeEventListener('change', handleInputChange);
      }
      if (everyXHoursInput) {
        everyXHoursInput.removeEventListener('change', handleInputChange);
      }
    };
  }, [frequencyType]);

  // Notify parent component when times change
  useEffect(() => {
    onTimesSave(times);
  }, [times, onTimesSave]);

  const generateDefaultTimes = () => {
    if (scheduleType === 'when_needed') {
      setTimes([]);
      return;
    }

    let newTimes = [];
    
    if (frequencyType === 'times_per_day') {
      const timesPerDay = parseInt(document.querySelector('input[name="times_per_day"]')?.value || '1', 10);
      
      if (timesPerDay > 0) {
        // Distribute times throughout the day
        for (let i = 0; i < timesPerDay; i++) {
          const baseHour = 8; // Start at 8 AM
          const hourInterval = Math.floor(14 / timesPerDay); // Spread across 14 hours (8 AM to 10 PM)
          
          const hour = (baseHour + i * hourInterval) % 24;
          const timeString = `${hour.toString().padStart(2, '0')}:00`;
          
          newTimes.push({
            time: timeString,
            is_daily: true
          });
        }
      }
    } else if (frequencyType === 'every_x_hours') {
      const hoursInterval = parseInt(document.querySelector('input[name="every_x_hours"]')?.value || '6', 10);
      
      if (hoursInterval > 0 && hoursInterval <= 24) {
        const timesCount = Math.floor(24 / hoursInterval);
        const baseTime = new Date();
        baseTime.setHours(8, 0, 0); // Start at 8:00 AM
        
        for (let i = 0; i < timesCount; i++) {
          const timeObj = new Date(baseTime);
          timeObj.setHours(baseTime.getHours() + (i * hoursInterval));
          
          const hours = timeObj.getHours().toString().padStart(2, '0');
          const minutes = timeObj.getMinutes().toString().padStart(2, '0');
          const timeString = `${hours}:${minutes}`;
          
          newTimes.push({
            time: timeString,
            is_daily: true
          });
        }
      }
    }
    
    setTimes(newTimes);
  };

  const handleTimeClick = (index) => {
    setEditingIndex(index);
  };

  const handleTimeChange = (e, index) => {
    const newTimes = [...times];
    newTimes[index].time = e.target.value;
    setTimes(newTimes);
    setEditingIndex(null);
  };

  const handleTimeInputBlur = () => {
    setEditingIndex(null);
  };

  return (
    <div className="mt-4 border p-4 rounded-md bg-gray-50">
      <h3 className="text-lg font-medium mb-3">Medication Times</h3>
      
      {times.length > 0 ? (
        <div className="flex flex-wrap gap-4 justify-center">
          {times.map((time, index) => (
            <div key={index} className="flex flex-col items-center">
              <div 
                className="flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 hover:bg-teal-200 transition cursor-pointer mb-2"
                onClick={() => handleTimeClick(index)}
              >
                <FiClock className="text-teal-600 text-xl" />
              </div>
              
              {editingIndex === index ? (
                <input
                  type="time"
                  value={time.time}
                  onChange={(e) => handleTimeChange(e, index)}
                  onBlur={handleTimeInputBlur}
                  className="w-20 text-center border border-teal-500 rounded"
                  autoFocus
                />
              ) : (
                <span className="font-medium">{time.time}</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 italic">
          {scheduleType === 'when_needed' ? 
            "No scheduled times for 'When Needed' medications" : 
            "No medication times configured"}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600 text-center">
        {frequencyType === 'times_per_day' && times.length > 0 && (
          <p>Click on a clock to change the medication time</p>
        )}
        {frequencyType === 'every_x_hours' && times.length > 0 && (
          <p>Medication times are spaced every {document.querySelector('input[name="every_x_hours"]')?.value || '6'} hours</p>
        )}
      </div>
    </div>
  );
};

MedicationTimeManager.propTypes = {
  onTimesSave: PropTypes.func.isRequired,
  scheduleType: PropTypes.string.isRequired,
  frequencyType: PropTypes.string.isRequired,
  cycleActivedays: PropTypes.number,
  cycleRestDays: PropTypes.number,
  specificDaysOfWeek: PropTypes.array
};

export default MedicationTimeManager;