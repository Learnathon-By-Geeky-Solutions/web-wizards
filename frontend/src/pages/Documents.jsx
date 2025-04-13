import React, { useState } from 'react';
import DocumentsList from '../components/MedicalRecord/Documents/DocumentsList';
import AddDocumentForm from '../components/MedicalRecord/Documents/AddDocumentForm';

const Documents = () => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleDocumentAdded = () => {
    // Refresh document list after new document is added
    setRefreshTrigger(prev => prev + 1);
    setShowAddForm(false);
  };

  return (
    <div className="h-full bg-gray-50">
      <div className="p-6 h-full">
        {!showAddForm ? (
          <DocumentsList 
            setShowAddForm={setShowAddForm}
            refreshTrigger={refreshTrigger}
            onDocumentDeleted={() => setRefreshTrigger(prev => prev + 1)}
          />
        ) : (
          <AddDocumentForm
            setShowAddForm={setShowAddForm}
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
            onDocumentAdded={handleDocumentAdded}
          />
        )}
      </div>
    </div>
  );
};

export default Documents;