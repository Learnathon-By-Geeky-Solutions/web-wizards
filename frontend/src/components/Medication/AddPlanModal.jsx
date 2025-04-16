import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetHealthIssuesQuery } from '../../store/api/healthIssuesApi';
import { toast } from 'react-toastify';
import MedicationSearch from './MedicationSearch';
import MedicationTimeManager from './MedicationTimeManager';

const AddPlanModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  // Get current date in YYYY-MM-DD format for default value
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: '',
    dose_amount: '',
    schedule_type: 'daily',
    frequency_type: 'times_per_day',
    times_per_day: 1,
    every_x_hours: 6,
    every_x_days: 2,
    specific_days_of_week: [],
    cycle_active_days: 5,
    cycle_rest_days: 2,
    duration_type: 'ongoing',
    number_of_days: 30,
    instructions: '',
    description: '',
    effective_date: getCurrentDate(), // Set default to current date
    effective_time: '09:00',
    end_date: '',
    health_issue: '',
    status: 'Active',
    notes: ''
  });
  
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [times, setTimes] = useState([]);
  
  // Use RTK Query hook for health issues
  const { data: healthIssuesData, isLoading: loading } = useGetHealthIssuesQuery();

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Convert status to proper case if needed (backend expects "Active" or "Inactive")
        let status = initialData.status || 'Active';
        if (status === 'active') status = 'Active';
        if (status === 'inactive') status = 'Inactive';
        
        setFormData({
          name: initialData.name || '',
          dose_amount: initialData.dose_amount || '',
          schedule_type: initialData.schedule_type || 'daily',
          frequency_type: initialData.frequency_type || 'times_per_day',
          times_per_day: initialData.times_per_day || 1,
          every_x_hours: initialData.every_x_hours || 6,
          every_x_days: initialData.every_x_days || 2,
          specific_days_of_week: initialData.specific_days_of_week || [],
          cycle_active_days: initialData.cycle_active_days || 5,
          cycle_rest_days: initialData.cycle_rest_days || 2,
          duration_type: initialData.duration_type || 'ongoing',
          number_of_days: initialData.number_of_days || 30,
          instructions: initialData.instructions || '',
          description: initialData.description || '',
          effective_date: initialData.effective_date || getCurrentDate(),
          effective_time: initialData.effective_time || '09:00',
          end_date: initialData.end_date || '',
          health_issue: initialData.health_issue || '',
          status: status,
          notes: initialData.notes || ''
        });
        setSelectedMedication(initialData.medication_data || null);
        setTimes(initialData.medication_times || []);
      } else {
        // Reset the form with current date for new entries
        setFormData(prev => ({
          ...prev,
          effective_date: getCurrentDate()
        }));
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDaysOfWeekChange = (day) => {
    setFormData(prev => {
      const currentDays = prev.specific_days_of_week || [];
      const updatedDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      
      return {
        ...prev,
        specific_days_of_week: updatedDays
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedMedication && !formData.name) {
      toast.error('Please select a medication or enter a custom medication name');
      return;
    }

    if (!formData.effective_date || !formData.effective_time) {
      toast.error('Start date and time are required');
      return;
    }

    const planData = {
      medication: selectedMedication?.id,
      custom_medication_name: !selectedMedication ? formData.name : undefined,
      dose_amount: formData.dose_amount,
      schedule_type: formData.schedule_type,
      frequency_type: formData.frequency_type,
      times_per_day: parseInt(formData.times_per_day, 10),
      every_x_hours: parseInt(formData.every_x_hours, 10),
      every_x_days: parseInt(formData.every_x_days, 10),
      specific_days_of_week: formData.specific_days_of_week,
      cycle_active_days: parseInt(formData.cycle_active_days, 10),
      cycle_rest_days: parseInt(formData.cycle_rest_days, 10),
      duration_type: formData.duration_type,
      number_of_days: parseInt(formData.number_of_days, 10),
      instructions: formData.instructions || '',
      description: formData.description || '',
      effective_date: formData.effective_date,
      effective_time: formData.effective_time,
      end_date: formData.duration_type === 'until_date' ? formData.end_date : null,
      health_issue: formData.health_issue || null,
      status: formData.status,
      notes: formData.notes || '',
      notification_time: 30, // Default to 30 minutes before
      notifications_enabled: true,
      medication_times: times
    };

    onSave(planData);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dose_amount: '',
      schedule_type: 'daily',
      frequency_type: 'times_per_day',
      times_per_day: 1,
      every_x_hours: 6,
      every_x_days: 2,
      specific_days_of_week: [],
      cycle_active_days: 5,
      cycle_rest_days: 2,
      duration_type: 'ongoing',
      number_of_days: 30,
      instructions: '',
      description: '',
      effective_date: getCurrentDate(),
      effective_time: '09:00',
      end_date: '',
      health_issue: '',
      status: 'Active',
      notes: ''
    });
    setSelectedMedication(null);
    setTimes([]);
    onClose();
  };

  const handleMedicationSelect = (medication) => {
    setSelectedMedication(medication);
    if (medication) {
      setFormData(prev => ({
        ...prev,
        name: medication.full_name
      }));
    }
  };

  const handleTimesSave = (medicationTimes) => {
    setTimes(medicationTimes);
  };

  if (!isOpen) return null;

  const daysOfWeek = [
    { value: 'mon', label: 'Monday' },
    { value: 'tue', label: 'Tuesday' },
    { value: 'wed', label: 'Wednesday' },
    { value: 'thu', label: 'Thursday' },
    { value: 'fri', label: 'Friday' },
    { value: 'sat', label: 'Saturday' },
    { value: 'sun', label: 'Sunday' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {initialData ? 'Edit Medication Plan' : 'Add Medication Plan'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Medication
            </label>
            <MedicationSearch
              onSelect={handleMedicationSelect}
              selectedMedication={selectedMedication}
            />
          </div>

          {!selectedMedication && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Medication Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter medication name"
              />
            </div>
          )}

          {/* Start Date - moved here right after medication name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="effective_date"
              value={formData.effective_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
            {/* Time field is hidden but still tracked in the state */}
            <input
              type="hidden"
              name="effective_time"
              value={formData.effective_time}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dose Amount
            </label>
            <input
              type="text"
              name="dose_amount"
              value={formData.dose_amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., 1 tablet, 10ml"
              required
            />
          </div>

          {/* Schedule Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Schedule Type
            </label>
            <select
              name="schedule_type"
              value={formData.schedule_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="daily">Daily</option>
              <option value="when_needed">When Needed</option>
              <option value="every_x_days">Every X Days</option>
              <option value="specific_days">Specific Days of Week</option>
              <option value="cycle">Take X Days, Rest Y Days</option>
            </select>
          </div>

          {/* Conditional fields based on schedule type */}
          {formData.schedule_type === 'every_x_days' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Every
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  name="every_x_days"
                  value={formData.every_x_days}
                  onChange={handleChange}
                  min="1"
                  className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <span>days</span>
              </div>
            </div>
          )}

          {formData.schedule_type === 'specific_days' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Days of Week
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map(day => (
                  <div
                    key={day.value}
                    onClick={() => handleDaysOfWeekChange(day.value)}
                    className={`px-4 py-2 rounded-full cursor-pointer text-sm ${
                      formData.specific_days_of_week.includes(day.value)
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {day.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.schedule_type === 'cycle' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Take
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="cycle_active_days"
                    value={formData.cycle_active_days}
                    onChange={handleChange}
                    min="1"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <span>days</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rest
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="cycle_rest_days"
                    value={formData.cycle_rest_days}
                    onChange={handleChange}
                    min="0"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <span>days</span>
                </div>
              </div>
            </div>
          )}

          {/* Frequency Type (except for when_needed) */}
          {formData.schedule_type !== 'when_needed' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <div className="d-flex flex items-center space-x-4">
                  <div className="flex-1">
                    <select
                      name="frequency_type"
                      value={formData.frequency_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      required
                    >
                      <option value="times_per_day">X Times a Day</option>
                      <option value="every_x_hours">Every X Hours</option>
                    </select>
                  </div>

                  {/* Conditional fields based on frequency type */}
                  {formData.frequency_type === 'times_per_day' && (
                    <div className="flex-1">
                      <input
                        type="number"
                        name="times_per_day"
                        value={formData.times_per_day}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Times per day"
                        required
                      />
                    </div>
                  )}

                  {formData.frequency_type === 'every_x_hours' && (
                    <div className="flex-1">
                      <input
                        type="number"
                        name="every_x_hours"
                        value={formData.every_x_hours}
                        onChange={handleChange}
                        min="1"
                        max="24"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Hours"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* MedicationTimeManager moved here to appear right after frequency */}
              <MedicationTimeManager 
                onTimesSave={handleTimesSave} 
                scheduleType={formData.schedule_type}
                frequencyType={formData.frequency_type}
                cycleActivedays={formData.cycle_active_days}
                cycleRestDays={formData.cycle_rest_days}
                specificDaysOfWeek={formData.specific_days_of_week}
              />
            </>
          )}

          {/* Duration Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration
            </label>
            <div className="d-flex flex items-center space-x-4">
              <div className="flex-1">
                <select
                  name="duration_type"
                  value={formData.duration_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="ongoing">Ongoing</option>
                  <option value="for_x_days">For X Days</option>
                  <option value="until_date">Until Date</option>
                </select>
              </div>

              {/* Conditional fields based on duration type */}
              {formData.duration_type === 'for_x_days' && (
                <div className="flex-1">
                  <input
                    type="number"
                    name="number_of_days"
                    value={formData.number_of_days}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Number of days"
                    required
                  />
                </div>
              )}

              {formData.duration_type === 'until_date' && (
                <div className="flex-1">
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g., Take with food"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Health Issue
            </label>
            <select
              name="health_issue"
              value={formData.health_issue}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a health issue</option>
              {loading ? (
                <option disabled>Loading health issues...</option>
              ) : (
                healthIssuesData?.map(issue => (
                  <option key={issue.id} value={issue.id}>
                    {issue.title}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Any additional notes"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
            >
              {initialData ? 'Save Changes' : 'Add Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

AddPlanModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  initialData: PropTypes.object,
};

export default AddPlanModal;