import React, { useState } from 'react';
const Documents = () => {
  const [isLoading] = useState(false); // Removed unused setIsLoading
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {!showAddForm ? (
        // Documents List Page
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Documents</h1>
          </div>

          {/* Dropdowns for filtering */}
          <div className="flex gap-4 mb-6">
            <select className="border rounded px-3 py-2">
              <option>All Health Issues</option>
              <option>Cardiology</option>
            </select>
            <select className="border rounded px-3 py-2">
              <option>All Documents</option>
              <option>Epicrisis</option>
              <option>Prescription</option>
              <option>Laboratory results</option>
              <option>Medical report</option>
              <option>Referral</option>
              <option>Other</option>
            </select>
          </div>

          {/* Search Bar with icon on right */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search..."
              className="border rounded pr-10 pl-3 py-2 focus:outline-none w-full"
            />
            <svg
              className="w-6 h-6 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4-4m0 0A7 7 0 119.5 9.5a7 7 0 017 7z"
              />
            </svg>
          </div>

          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">
              This user has not uploaded any documents yet.
            </p>
          </div>
        </div>
      ) : (
        // Add Document Form Page
        <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Document Title</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date*
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded-md"
                  defaultValue="2025-02-15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time*
                </label>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md"
                  defaultValue="17:21"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document type
              </label>
              <select className="w-full p-2 border rounded-md">
                <option>Laboratory results</option>
                <option>Medical reports</option>
                <option>Prescriptions</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Health Issues
              </label>
              <select className="w-full p-2 border rounded-md">
                <option>Select Health Issue</option>
                <option>Blood Pressure</option>
                <option>Diabetes</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
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
      )}

      {/* Floating Plus Button (only on list view) */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="fixed right-6 bottom-6 p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Documents;
