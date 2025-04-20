import React from 'react';
import PropTypes from 'prop-types';

const AddDocumentForm = ({ setShowAddForm, handleFileChange, selectedFile }) => {
  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6">Document Title</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date*
            </label>
            <input
              id="date"
              type="date"
              className="w-full p-2 border rounded-md"
              defaultValue="2025-02-15"
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
              defaultValue="17:21"
            />
          </div>
        </div>

        <div>
          <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1">
            Document type
          </label>
          <select id="documentType" className="w-full p-2 border rounded-md">
            <option>Laboratory results</option>
            <option>Medical reports</option>
            <option>Prescriptions</option>
          </select>
        </div>

        <div>
          <label htmlFor="healthIssues" className="block text-sm font-medium text-gray-700 mb-1">
            Health Issues
          </label>
          <select id="healthIssues" className="w-full p-2 border rounded-md">
            <option>Select Health Issue</option>
            <option>Blood Pressure</option>
            <option>Diabetes</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            id="notes"
            className="w-full p-2 border rounded-md"
            rows="3"
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
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-md"
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

AddDocumentForm.propTypes = {
  setShowAddForm: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
  selectedFile: PropTypes.object,
};

export default AddDocumentForm;