import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-hot-toast';
import { useGetHealthIssuesQuery } from '../../../store/api/healthIssuesApi';
import { useUploadAndProcessDocumentMutation } from '../../../store/api/documentApi';

const AddDocumentForm = ({ setShowAddForm, handleFileChange, selectedFile, onDocumentAdded }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('12:00');
  const [documentType, setDocumentType] = useState('LAB_REPORT');
  const [selectedHealthIssue, setSelectedHealthIssue] = useState('');
  const [notes, setNotes] = useState('');
  const [ocrResults, setOcrResults] = useState(null);
  
  // RTK Query hooks
  const { data: healthIssues = [], isLoading } = useGetHealthIssuesQuery();
  const [uploadAndProcessDocument, { isLoading: isSubmitting }] = useUploadAndProcessDocumentMutation();

  // Set the first health issue as selected when data is loaded
  useEffect(() => {
    if (healthIssues?.length > 0) {
      setSelectedHealthIssue(healthIssues[0].id.toString());
    }
  }, [healthIssues]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      // Create FormData object for the upload
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('title', selectedFile.name);
      formData.append('description', notes);
      formData.append('document_type', documentType);
      if (selectedHealthIssue) {
        formData.append('health_issue', selectedHealthIssue);
      }
      formData.append('document_date', date); // Send only the date in YYYY-MM-DD format
      formData.append('document_time', time); // Send time separately if needed by the backend
      
      // Use RTK Query mutation to upload document
      const responseData = await uploadAndProcessDocument(formData).unwrap();

      // Check if OCR was successful for lab reports
      if (documentType === 'LAB_REPORT' && responseData.test_results) {
        setOcrResults(responseData.test_results);
        toast.success('Lab report processed successfully with OCR!');
      } else {
        toast.success('Document uploaded successfully!');
        if (onDocumentAdded) {
          onDocumentAdded();
        } else {
          setShowAddForm(false);
        }
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document. Please try again.');
    }
  };

  const handleDone = () => {
    if (onDocumentAdded) {
      onDocumentAdded();
    } else {
      setShowAddForm(false);
    }
  };

  // Ensure healthIssues is always an array
  const safeHealthIssues = Array.isArray(healthIssues) ? healthIssues : [];

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Upload Medical Document</h2>

      {ocrResults ? (
        // Show OCR results if available
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">OCR Results</h3>
          <div className="p-4 border rounded-md bg-green-50">
            <p className="font-medium text-green-700">
              Successfully extracted test results from your document!
            </p>
            {ocrResults.map((testResult, index) => (
              <div key={index} className="mt-3 p-3 bg-white rounded border">
                <h4 className="font-medium">{testResult.test_type_name}</h4>
                <p className="text-sm text-gray-500">
                  {new Date(testResult.performed_at).toLocaleString()}
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {Object.values(testResult.parameters).map((param, i) => (
                    <div key={i} className={`text-sm ${param.is_abnormal ? 'text-red-600 font-medium' : ''}`}>
                      {param.name}: {param.value} {param.unit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleDone}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        // Show the form if no OCR results yet
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date*
              </label>
              <input
                id="date"
                type="date"
                className="w-full p-2 border rounded-md"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                Time*
              </label>
              <input
                id="time"
                type="time"
                className="w-full p-2 border rounded-md"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
              Document type
            </label>
            <select 
              id="documentType" 
              className="w-full p-2 border rounded-md"
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
            >
              <option value="LAB_REPORT">Laboratory results</option>
              <option value="MEDICAL_REPORT">Medical reports</option>
              <option value="PRESCRIPTION">Prescriptions</option>
              <option value="IMAGING">Imaging</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="healthIssues" className="block text-sm font-medium text-gray-700 mb-1">
              Health Issues
            </label>
            <select 
              id="healthIssues" 
              className="w-full p-2 border rounded-md"
              value={selectedHealthIssue}
              onChange={(e) => setSelectedHealthIssue(e.target.value)}
              disabled={isLoading}
            >
              <option value="">None</option>
              {safeHealthIssues.map(issue => (
                <option key={issue.id} value={issue.id}>{issue.title}</option>
              ))}
            </select>
            {isLoading && <p className="text-sm text-gray-500 mt-1">Loading health issues...</p>}
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              className="w-full p-2 border rounded-md"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-1">
              Upload Document
            </label>
            <div className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-blue-500"
              >
                {selectedFile
                  ? selectedFile.name
                  : 'Choose file to upload'}
              </label>
              <p className="text-gray-500 text-sm mt-1">
                {!selectedFile && 'No File Chosen'}
              </p>
              {documentType === 'LAB_REPORT' && (
                <p className="text-sm text-blue-600 mt-2">
                  Lab reports will be automatically processed with OCR to extract test results
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Save'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

AddDocumentForm.propTypes = {
  setShowAddForm: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  selectedFile: PropTypes.object,
  onDocumentAdded: PropTypes.func,
};

export default AddDocumentForm;