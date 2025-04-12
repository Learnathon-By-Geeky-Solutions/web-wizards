import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { fetchHealthIssues } from '../../api/healthIssuesApi';
import { toast } from 'react-toastify';
import MedicationSearch from './MedicationSearch';
import MedicationTimeManager from './MedicationTimeManager';

const AddPlanModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [formData, setFormData] = useState({
    name: '',
    dose_amount: '',
    schedule_type: 'daily',
    instructions: '',
    description: '',
    effective_date: '',
    effective_time: '09:00',
    end_date: '',
    health_issue: '',
    status: 'Active'
  });
  
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [healthIssues, setHealthIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [times, setTimes] = useState([]);

  useEffect(() => {
    if (isOpen) {
      loadHealthIssues();
      if (initialData) {
        // Convert status to proper case if needed (backend expects "Active" or "Inactive")
        let status = initialData.status || 'Active';
        if (status === 'active') status = 'Active';
        if (status === 'inactive') status = 'Inactive';
        
        setFormData({
          name: initialData.name || '',
          dose_amount: initialData.dose_amount || '',
          schedule_type: initialData.schedule_type || 'daily',
          instructions: initialData.instructions || '',
          description: initialData.description || '',
          effective_date: initialData.effective_date || '',
          effective_time: initialData.effective_time || '09:00',
          end_date: initialData.end_date || '',
          health_issue: initialData.health_issue || '',
          status: status
        });
        setSelectedMedication(initialData.medication_data || null);
        setTimes(initialData.medication_times || []);
      }
    }
  }, [isOpen, initialData]);

  const loadHealthIssues = async () => {
    try {
      setLoading(true);
      const data = await fetchHealthIssues();
      setHealthIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load health issues:', error);
      toast.error('Failed to load health issues. Please try again.');
      setHealthIssues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      instructions: formData.instructions || '',
      description: formData.description || '',
      effective_date: formData.effective_date,
      effective_time: formData.effective_time,
      end_date: formData.end_date || null,
      health_issue: formData.health_issue || null,
      status: formData.status,
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
      instructions: '',
      description: '',
      effective_date: '',
      effective_time: '09:00',
      end_date: '',
      health_issue: '',
      status: 'Active'
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
              <option value="specific_days">Specific Days</option>
              <option value="cycle">Take X Days, Rest Y Days</option>
            </select>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="effective_time"
                value={formData.effective_time}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date (Optional)
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
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
                healthIssues.map(issue => (
                  <option key={issue.id} value={issue.id}>
                    {issue.title}
                  </option>
                ))
              )}
            </select>
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

          <MedicationTimeManager onTimesSave={handleTimesSave} />

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