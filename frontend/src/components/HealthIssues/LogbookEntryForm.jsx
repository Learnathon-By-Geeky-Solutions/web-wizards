import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { createLogbookEntry } from '../../api/healthIssuesApi';
import DateTimeInput from '../common/DateTimeInput';
import { toast } from 'react-toastify';

const LogbookEntryForm = ({ healthIssueId, onSuccess }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    entry_date: new Date().toISOString().split('T')[0],
    entry_time: new Date().toTimeString().slice(0, 5),
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
    if (!formData.title.trim()) {
      toast.error('Entry title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await createLogbookEntry(formData);
      toast.success('Logbook entry created successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/health-issues/${healthIssueId}`);
      }
    } catch (error) {
      console.error('Failed to create logbook entry:', error);
      toast.error('Failed to create logbook entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/health-issues/${healthIssueId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Add Logbook Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Entry Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Doctor Visit, Medication Change, Progress Note"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <DateTimeInput
          date={formData.entry_date}
          time={formData.entry_time}
          label="Entry Date & Time"
          onDateChange={(value) => handleChange({ target: { name: 'entry_date', value } })}
          onTimeChange={(value) => handleChange({ target: { name: 'entry_time', value } })}
        />

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="5"
            placeholder="Enter details about your health, treatments, or observations"
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
            {isSubmitting ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </form>
    </div>
  );
};

LogbookEntryForm.propTypes = {
  healthIssueId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default LogbookEntryForm;