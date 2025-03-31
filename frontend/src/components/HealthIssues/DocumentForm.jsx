import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { createDocument } from '../../api/healthIssuesApi';
import { toast } from 'react-toastify';

const DocumentForm = ({ healthIssueId, onSuccess }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    document_type: 'medical_report',
    document_date: new Date().toISOString().split('T')[0],
    description: '',
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
    if (!formData.title.trim()) {
      toast.error('Document title is required');
      return;
    }

    if (!selectedFile) {
      toast.error('Please select a file to upload');
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
      
      // Add the document file
      data.append('file', selectedFile);
      
      await createDocument(data);
      toast.success('Document uploaded successfully');
      if (onSuccess) {
        onSuccess();
      } else {
        navigate(`/health-issues/${healthIssueId}`);
      }
    } catch (error) {
      console.error('Failed to upload document:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(`/health-issues/${healthIssueId}`);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Upload Medical Document</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Document Title*
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Hospital Discharge Summary"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="document_type" className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              id="document_type"
              name="document_type"
              value={formData.document_type}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="medical_report">Medical Report</option>
              <option value="prescription">Prescription</option>
              <option value="imaging">Imaging Results</option>
              <option value="discharge_summary">Discharge Summary</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="document_date" className="block text-sm font-medium text-gray-700 mb-1">
              Document Date
            </label>
            <input
              id="document_date"
              name="document_date"
              type="date"
              value={formData.document_date}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </div>
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Document*
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepted formats: PDF, Word documents, images (.pdf, .doc, .docx, .jpg, .png)
          </p>
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
            placeholder="Add a brief description of this document"
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
            {isSubmitting ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
};

DocumentForm.propTypes = {
  healthIssueId: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default DocumentForm;