import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGetHealthIssueQuery, useUpdateHealthIssueMutation } from '../../store/api/healthIssuesApi';
import DateTimeInput from '../common/DateTimeInput';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const HealthIssueEditForm = ({ healthIssueId }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: ''
  });

  const { data, error } = useGetHealthIssueQuery(healthIssueId);

  const [updateHealthIssue] = useUpdateHealthIssueMutation();

  useEffect(() => {
    if (data) {
      setFormData({
        title: data.title || '',
        description: data.description || '',
        status: data.status || 'active',
        start_date: data.start_date || '',
        start_time: data.start_time || '',
        end_date: data.end_date || '',
        end_time: data.end_time || ''
      });
      setIsLoading(false);
    }

    if (error) {
      console.error('Failed to load health issue:', error);
      toast.error('Failed to load health issue details');
      navigate(`/health-issues/${healthIssueId}`);
    }
  }, [data, error, healthIssueId, navigate]);

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
      toast.error('Health issue title is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateHealthIssue({ id: healthIssueId, ...formData }).unwrap();
      toast.success('Health issue updated successfully');
      navigate(`/health-issues/${healthIssueId}`);
    } catch (error) {
      console.error('Failed to update health issue:', error);
      toast.error('Failed to update health issue. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/health-issues/${healthIssueId}`);
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Health Issue Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateTimeInput
            date={formData.start_date}
            time={formData.start_time}
            label="Start Date & Time"
            onDateChange={(value) => handleChange({ target: { name: 'start_date', value } })}
            onTimeChange={(value) => handleChange({ target: { name: 'start_time', value } })}
          />

          {formData.status === 'resolved' && (
            <DateTimeInput
              date={formData.end_date || ''}
              time={formData.end_time || ''}
              label="End Date & Time"
              onDateChange={(value) => handleChange({ target: { name: 'end_date', value } })}
              onTimeChange={(value) => handleChange({ target: { name: 'end_time', value } })}
            />
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="active">Active</option>
            <option value="monitoring">Monitoring</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows="5"
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
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

HealthIssueEditForm.propTypes = {
  healthIssueId: PropTypes.string.isRequired
};

export default HealthIssueEditForm;