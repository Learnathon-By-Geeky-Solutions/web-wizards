import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { fetchDocuments } from '../../../api/documentApi';
import DocumentCard from './DocumentCard';
import LoadingSpinner from '../../common/LoadingSpinner';

const DocumentsList = ({ refreshTrigger, setShowAddForm, onDocumentDeleted, documents }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [localDocuments, setLocalDocuments] = useState([]);

  useEffect(() => {
    // If documents are provided from props, use those
    if (documents) {
      setLocalDocuments(documents);
      setLoading(false);
      return;
    }

    // Otherwise, fetch documents directly (fallback behavior)
    const loadDocuments = async () => {
      setLoading(true);
      try {
        const documentsData = await fetchDocuments();
        setLocalDocuments(documentsData);
        setError(null);
      } catch (err) {
        console.error('Error loading documents:', err);
        setError('Failed to load documents. Please try again later.');
        toast.error('Error loading documents');
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [refreshTrigger, documents]);

  if (loading) {
    return <LoadingSpinner text="Loading documents..." />;
  }

  if (error) {
    return <div className="text-red-500 p-4 text-center">{error}</div>;
  }

  // Common layout with add document button
  const renderAddDocumentButton = () => (
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-2xl font-semibold text-gray-800">Documents</h2>
      <button
        onClick={() => setShowAddForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Document
      </button>
    </div>
  );

  // Use documents from props if available, otherwise use locally fetched documents
  const displayDocuments = localDocuments;

  if (displayDocuments.length === 0) {
    return (
      <div>
        {renderAddDocumentButton()}
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No documents found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {renderAddDocumentButton()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayDocuments.map((document) => (
          <DocumentCard 
            key={document.id} 
            document={document} 
            onDeleted={onDocumentDeleted}
          />
        ))}
      </div>
    </div>
  );
};

export default DocumentsList;