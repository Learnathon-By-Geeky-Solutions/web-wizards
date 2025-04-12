import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaArrowLeft, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { fetchHealthIssueById, deleteHealthIssue } from '../api/healthIssuesApi';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LogbookEntriesList from '../components/HealthIssues/LogbookEntriesList';
import SymptomsList from '../components/HealthIssues/SymptomsList';
import ChartsList from '../components/HealthIssues/ChartsList';
import LabResultsList from '../components/HealthIssues/LabResultsList';
import DocumentsList from '../components/HealthIssues/DocumentsList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HealthIssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [healthIssue, setHealthIssue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [shouldRefreshSymptoms, setShouldRefreshSymptoms] = useState(false);

  useEffect(() => {
    loadHealthIssue();
  }, [id]);

  const loadHealthIssue = async () => {
    try {
      setIsLoading(true);
      const data = await fetchHealthIssueById(id);
      setHealthIssue(data);
    } catch (error) {
      console.error('Error loading health issue:', error);
      toast.error('Failed to load health issue details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteHealthIssue(id);
      toast.success('Health issue deleted successfully');
      navigate('/health-issues');
    } catch (error) {
      console.error('Failed to delete health issue:', error);
      toast.error('Failed to delete health issue');
      setIsDeleting(false);
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'monitoring':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatDate = (dateString, timeString) => {
    if (!dateString) return 'Not specified';
    
    const date = new Date(dateString);
    let formattedDate = date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (timeString) {
      formattedDate += ' at ' + timeString;
    }
    
    return formattedDate;
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">
                {healthIssue?.description || 'No description provided'}
              </p>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Timeline</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-4 w-4 rounded-full bg-teal-600 mt-1"></div>
                  </div>
                  <div>
                    <p className="font-medium">Started</p>
                    <p className="text-gray-600">
                      {formatDate(healthIssue?.start_date, healthIssue?.start_time)}
                    </p>
                  </div>
                </li>
                
                {healthIssue?.status === 'resolved' && (
                  <li className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-4 w-4 rounded-full bg-green-600 mt-1"></div>
                    </div>
                    <div>
                      <p className="font-medium">Resolved</p>
                      <p className="text-gray-600">
                        {formatDate(healthIssue?.end_date, healthIssue?.end_time)}
                      </p>
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </div>
        );
      case 'logbook':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Link
                to={`/health-issues/${id}/logbook/new`}
                className="flex items-center text-sm bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded"
              >
                <FaPlus className="mr-2" /> Add Logbook Entry
              </Link>
            </div>
            <LogbookEntriesList healthIssueId={id} />
          </div>
        );
      case 'symptoms':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Link
                to={`/health-issues/${id}/symptoms/new`}
                className="flex items-center text-sm bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded"
              >
                <FaPlus className="mr-2" /> Record Symptom
              </Link>
            </div>
            <SymptomsList healthIssueId={id} onRefresh={shouldRefreshSymptoms} />
          </div>
        );
      case 'charts':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Link
                to={`/health-issues/${id}/charts/new`}
                className="flex items-center text-sm bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded"
              >
                <FaPlus className="mr-2" /> Add Measurement
              </Link>
            </div>
            <ChartsList healthIssueId={id} />
          </div>
        );
      case 'lab_results':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Link
                to={`/health-issues/${id}/labs/new`}
                className="flex items-center text-sm bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded"
              >
                <FaPlus className="mr-2" /> Add Lab Result
              </Link>
            </div>
            <LabResultsList healthIssueId={id} />
          </div>
        );
      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Link
                to={`/health-issues/${id}/documents/new`}
                className="flex items-center text-sm bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded"
              >
                <FaPlus className="mr-2" /> Upload Document
              </Link>
            </div>
            <DocumentsList healthIssueId={id} />
          </div>
        );
      default:
        return null;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4">
      {/* Navigation and actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <Link to="/health-issues" className="text-teal-500 hover:underline flex items-center">
            <FaArrowLeft className="mr-2" /> Back to Health Issues
          </Link>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Link
            to={`/health-issues/${id}/edit`}
            className="bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 rounded flex items-center"
          >
            <FaEdit className="mr-2" /> Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded flex items-center"
            disabled={isDeleting}
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
      
      {/* Header section */}
      <div className="bg-white shadow rounded-lg mb-6 p-6">
        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-900 mr-3">{healthIssue?.title}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(healthIssue?.status)}`}
              >
                {healthIssue?.status?.charAt(0).toUpperCase() + healthIssue?.status?.slice(1)}
              </span>
            </div>
            <p className="text-gray-600">
              Started on {formatDate(healthIssue?.start_date, healthIssue?.start_time)}
              {healthIssue?.status === 'resolved' && healthIssue?.end_date && (
                <span> · Ended on {formatDate(healthIssue?.end_date, healthIssue?.end_time)}</span>
              )}
            </p>
          </div>
        </div>
      </div>
      
      {/* Tabs and content */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {/* Tabs */}
        <nav className="flex overflow-x-auto border-b">
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'overview'
                ? 'border-b-2 border-teal-500 text-teal-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'logbook'
                ? 'border-b-2 border-teal-500 text-teal-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('logbook')}
          >
            Logbook
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'symptoms'
                ? 'border-b-2 border-teal-500 text-teal-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('symptoms')}
          >
            Symptoms
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'charts'
                ? 'border-b-2 border-teal-500 text-teal-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('charts')}
          >
            Charts
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'lab_results'
                ? 'border-b-2 border-teal-500 text-teal-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('lab_results')}
          >
            Lab Results
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'documents'
                ? 'border-b-2 border-teal-500 text-teal-500'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('documents')}
          >
            Documents
          </button>
        </nav>
        
        {/* Tab content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
      
      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <ConfirmDialog
          isOpen={showDeleteConfirm}
          title="Delete Health Issue"
          message={`Are you sure you want to delete "${healthIssue?.title}"? This will permanently remove all associated data including logbook entries, symptoms, and documents.`}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          confirmButtonClass="bg-red-600 hover:bg-red-700"
          isProcessing={isDeleting}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default HealthIssueDetail;