import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useCreateLabResultMutation } from '../../store/api/healthIssuesApi';
import { toast } from 'react-toastify';

const LabResultForm = ({ healthIssueId, onSuccess }) => {
  const [createLabResult] = useCreateLabResultMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    test_name: '',
    test_date: new Date().toISOString().split('T')[0],
    result: '',
    reference_range: '',
    lab_name: '',
    notes: '',
    health_issue: healthIssueId
  });
  
  const [selectedFile, setSelectedFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.test_name.trim() || !formData.result.trim()) {
      toast.error('Test name and result are required');
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData for file upload
      const data = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Add the image file if selected
      if (selectedFile) {
        data.append('image', selectedFile);
      }
      
      await createLabResult(data).unwrap();
      toast.success('Lab result added successfully');
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Failed to add lab result:', error);
      toast.error('Failed to add lab result. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Add Lab Result</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="test_name" className="block text-sm font-medium text-gray-700 mb-1">
              Test Name*
            </label>
            <input
              id="test_name"
              name="test_name"
              type="text"
              value={formData.test_name}
              onChange={handleChange}
              placeholder="e.g., Complete Blood Count, A1C"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="test_date" className="block text-sm font-medium text-gray-700 mb-1">
              Test Date
            </label>
            <input
              id="test_date"
              name="test_date"
              type="date"
              value={formData.test_date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="result" className="block text-sm font-medium text-gray-700 mb-1">
              Result*
            </label>
            <input
              id="result"
              name="result"
              type="text"
              value={formData.result}
              onChange={handleChange}
              placeholder="e.g., 120 mg/dL"
              className="w-full p-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="reference_range" className="block text-sm font-medium text-gray-700 mb-1">
              Reference Range
            </label>
            <input
              id="reference_range"
              name="reference_range"
              type="text"
              value={formData.reference_range}
              onChange={handleChange}
              placeholder="e.g., 70-99 mg/dL"
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lab_name" className="block text-sm font-medium text-gray-700 mb-1">
            Laboratory Name
          </label>
          <input
            id="lab_name"
            name="lab_name"
            type="text"
            value={formData.lab_name}
            onChange={handleChange}
            placeholder="e.g., City Medical Laboratory"
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Lab Report Image (Optional)
          </label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a clear image of your lab report (JPG, PNG, PDF)
          </p>
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
            placeholder="Add any additional information about this lab result"
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
            {isSubmitting ? 'Saving...' : 'Save Lab Result'}
          </button>
        </div>
      </form>
    </div>
  );
};

LabResultForm.propTypes = {
  healthIssueId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default LabResultForm;