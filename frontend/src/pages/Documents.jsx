import React, { useState } from 'react';
import DocumentsList from '../components/MedicalRecord/Documents/DocumentsList';
import AddDocumentForm from '../components/MedicalRecord/Documents/AddDocumentForm';

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
        <DocumentsList setShowAddForm={setShowAddForm} />
      ) : (
        <AddDocumentForm
          setShowAddForm={setShowAddForm}
          handleFileChange={handleFileChange}
          selectedFile={selectedFile}
        />
      )}
    </div>
  );
};

export default Documents;