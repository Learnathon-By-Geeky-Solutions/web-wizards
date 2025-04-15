import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useGetHealthIssuesQuery } from '../../../store/api/healthIssuesApi';
import { useCreateSymptomForHealthIssueMutation } from '../../../store/api/healthIssuesApi';
import { toast } from 'react-toastify';

const LogSymptoms = ({ closeLogSymptoms, initialHealthIssue }) => {
  const { data: healthIssues = [], isLoading } = useGetHealthIssuesQuery();
  const [createSymptom, { isLoading: isSubmitting }] = useCreateSymptomForHealthIssueMutation();

  const [formData, setFormData] = useState({
    healthIssue: initialHealthIssue || '',
    symptomName: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    severity: 'mild',
    noSymptoms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.healthIssue) {
      toast.error('Please select a health issue');
      return;
    }

    if (!formData.noSymptoms && !formData.symptomName.trim()) {
      toast.error('Please enter a symptom name');
      return;
    }
    
    try {
      const healthIssueId = parseInt(formData.healthIssue);
      const symptomData = {
        healthIssueId: healthIssueId,
        symptomData: {
          name: formData.noSymptoms ? 'No symptoms' : formData.symptomName,
          recorded_date: formData.date,
          recorded_time: formData.time,
          severity: formData.severity,
          description: formData.noSymptoms ? 'Patient reported no symptoms' : '',
          duration: ''
        }
      };

      await createSymptom(symptomData).unwrap();

      toast.success('Symptom logged successfully');
      closeLogSymptoms();
    } catch (error) {
      console.error('Failed to log symptom:', error);
      toast.error(error.data?.detail || 'Failed to log symptom');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
          <p className="text-center mt-2">Loading health issues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">Log symptoms</h2>

        <form onSubmit={handleSubmit}>
          {/* Health Issue Selection */}
          <div className="mb-4">
            <label htmlFor="healthIssue" className="block font-medium mb-1">Health Issue</label>
            <select
              id="healthIssue"
              name="healthIssue"
              value={formData.healthIssue}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="">Select a health issue</option>
              {healthIssues.map(issue => (
                <option key={issue.id} value={issue.id}>
                  {issue.title}
                </option>
              ))}
            </select>
          </div>

          {/* Symptom Name */}
          <div className="mb-4">
            <label htmlFor="symptomName" className="block font-medium mb-1">Symptom Name</label>
            <input
              id="symptomName"
              name="symptomName"
              type="text"
              value={formData.symptomName}
              onChange={handleChange}
              placeholder="Enter symptom name"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required={!formData.noSymptoms}
              disabled={formData.noSymptoms}
            />
          </div>

          {/* No Symptoms Checkbox */}
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="noSymptoms"
                checked={formData.noSymptoms}
                onChange={handleChange}
                className="form-checkbox"
              />
              <span>No Symptoms</span>
            </label>
          </div>

          {/* Date & Time */}
          <div className="flex space-x-4 mb-4">
            <div>
              <label htmlFor="date" className="block font-medium mb-1">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block font-medium mb-1">Time</label>
              <input
                id="time"
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>
          </div>

          {/* Severity */}
          <div className="mb-4">
            <label htmlFor="severity" className="block font-medium mb-1">Severity</label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            >
              <option value="mild">Mild</option>
              <option value="moderate">Moderate</option>
              <option value="severe">Severe</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={closeLogSymptoms}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
              disabled={isSubmitting}
            >
              Close
            </button>
            <button 
              type="submit"
              className={`bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

LogSymptoms.propTypes = {
  closeLogSymptoms: PropTypes.func.isRequired,
  initialHealthIssue: PropTypes.string
};

export default LogSymptoms;