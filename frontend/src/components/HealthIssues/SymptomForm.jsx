import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCreateSymptomForHealthIssueMutation } from '../../store/api/healthIssuesApi';
import DateTimeInput from '../common/DateTimeInput';
import { toast } from 'react-toastify';

const SymptomForm = ({ healthIssueId, onSuccess }) => {
  const [createSymptomForHealthIssue] = useCreateSymptomForHealthIssueMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    severity: 'mild',
    recorded_date: new Date().toISOString().split('T')[0],
    recorded_time: new Date().toTimeString().slice(0, 5),
    duration: '',
    health_issue: healthIssueId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Symptom name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await createSymptomForHealthIssue(formData).unwrap();
      toast.success('Symptom recorded successfully');
      // First call onSuccess if provided to trigger any parent updates
      if (onSuccess) {
        await onSuccess();
      }
      // Then navigate back
      navigate(`/health-issues/${healthIssueId}`);
    } catch (error) {
      console.error('Failed to record symptom:', error);
      toast.error('Failed to record symptom. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/health-issues/${healthIssueId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Record a Symptom</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Symptom Name*
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Headache, Fever, Nausea"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateTimeInput
            date={formData.recorded_date}
            time={formData.recorded_time}
            label="When did you notice this symptom?"
            onDateChange={(value) => handleChange({ target: { name: 'recorded_date', value } })}
            onTimeChange={(value) => handleChange({ target: { name: 'recorded_time', value } })}
          />

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration (Optional)
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              value={formData.duration}
              onChange={handleChange}
              placeholder="e.g., 2 hours, 3 days"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
            Severity
          </label>
          <select
            id="severity"
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="mild">Mild - Noticeable but not interfering with daily activities</option>
            <option value="moderate">Moderate - Somewhat interfering with daily activities</option>
            <option value="severe">Severe - Significantly interfering with daily activities</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Describe the symptom in more detail"
            className="w-full p-2 border rounded-md"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              isSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-500 hover:bg-teal-600'
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Symptom'}
          </button>
        </div>
      </form>
    </div>
  );
};

SymptomForm.propTypes = {
  healthIssueId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default SymptomForm;