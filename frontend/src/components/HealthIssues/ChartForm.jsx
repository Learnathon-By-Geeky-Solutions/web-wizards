import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { createChart } from '../../api/healthIssuesApi';
import DateTimeInput from '../common/DateTimeInput';
import { toast } from 'react-toastify';

const ChartForm = ({ healthIssueId, onSuccess }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    chart_type: 'blood_pressure',
    value: '',
    unit: '',
    notes: '',
    measurement_date: new Date().toISOString().split('T')[0],
    measurement_time: new Date().toTimeString().slice(0, 5),
    health_issue: healthIssueId
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Set default unit when chart type changes
  const handleChartTypeChange = (e) => {
    const chartType = e.target.value;
    let defaultUnit = '';
    
    switch (chartType) {
      case 'blood_pressure':
        defaultUnit = 'mmHg';
        break;
      case 'blood_sugar':
        defaultUnit = 'mg/dL';
        break;
      case 'weight':
        defaultUnit = 'kg';
        break;
      case 'temperature':
        defaultUnit = '°C';
        break;
      case 'heart_rate':
        defaultUnit = 'bpm';
        break;
      default:
        defaultUnit = '';
    }
    
    setFormData(prev => ({
      ...prev,
      chart_type: chartType,
      unit: defaultUnit
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.value) {
      toast.error('Title and value are required');
      return;
    }

    setIsSubmitting(true);
    try {
      await createChart({
        ...formData,
        value: parseFloat(formData.value)
      });
      toast.success('Chart data recorded successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/health-issues/${healthIssueId}`);
      }
    } catch (error) {
      console.error('Failed to record chart data:', error);
      toast.error('Failed to record chart data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/health-issues/${healthIssueId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Record Chart Data</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title*
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Morning Blood Pressure"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="chart_type" className="block text-sm font-medium text-gray-700 mb-1">
              Measurement Type*
            </label>
            <select
              id="chart_type"
              name="chart_type"
              value={formData.chart_type}
              onChange={handleChartTypeChange}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="blood_pressure">Blood Pressure</option>
              <option value="blood_sugar">Blood Sugar</option>
              <option value="weight">Weight</option>
              <option value="temperature">Temperature</option>
              <option value="heart_rate">Heart Rate</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex space-x-2">
            <div className="flex-grow">
              <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
                Value*
              </label>
              <input
                id="value"
                name="value"
                type="number"
                step="0.01"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 120"
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
            <div className="w-1/3">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                Unit
              </label>
              <input
                id="unit"
                name="unit"
                type="text"
                value={formData.unit}
                onChange={handleChange}
                placeholder="e.g., mmHg"
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          <DateTimeInput
            date={formData.measurement_date}
            time={formData.measurement_time}
            label="Measurement Date & Time"
            onDateChange={(value) => handleChange({ target: { name: 'measurement_date', value } })}
            onTimeChange={(value) => handleChange({ target: { name: 'measurement_time', value } })}
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            placeholder="Add any context or observations about this measurement"
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
            {isSubmitting ? 'Saving...' : 'Save Chart Data'}
          </button>
        </div>
      </form>
    </div>
  );
};

ChartForm.propTypes = {
  healthIssueId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default ChartForm;