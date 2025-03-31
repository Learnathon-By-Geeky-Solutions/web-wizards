import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import LogbookEntryForm from '../components/HealthIssues/LogbookEntryForm';
import SymptomForm from '../components/HealthIssues/SymptomForm';
import ChartForm from '../components/HealthIssues/ChartForm';
import LabResultForm from '../components/HealthIssues/LabResultForm';
import DocumentForm from '../components/HealthIssues/DocumentForm';
import HealthIssueEditForm from '../components/HealthIssues/HealthIssueEditForm';

const HealthIssueFormPage = () => {
  const { id, recordType } = useParams();

  const renderForm = () => {
    switch (recordType) {
      case 'logbook':
        return <LogbookEntryForm healthIssueId={id} />;
      case 'symptoms':
        return <SymptomForm healthIssueId={id} />;
      case 'charts':
        return <ChartForm healthIssueId={id} />;
      case 'labs':
        return <LabResultForm healthIssueId={id} />;
      case 'documents':
        return <DocumentForm healthIssueId={id} />;
      case 'edit':
        return <HealthIssueEditForm healthIssueId={id} />;
      default:
        return (
          <div className="text-center">
            <p className="text-red-500">Invalid form type requested.</p>
            <Link to={`/health-issues/${id}`} className="text-teal-500 hover:underline mt-2 inline-block">
              Return to health issue
            </Link>
          </div>
        );
    }
  };

  const getPageTitle = () => {
    switch (recordType) {
      case 'logbook':
        return 'Add Logbook Entry';
      case 'symptoms':
        return 'Record Symptom';
      case 'charts':
        return 'Record Measurement';
      case 'labs':
        return 'Add Lab Result';
      case 'documents':
        return 'Upload Document';
      case 'edit':
        return 'Edit Health Issue';
      default:
        return 'Health Issue Form';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <Link to={`/health-issues/${id}`} className="text-teal-500 hover:underline flex items-center">
          <FaArrowLeft className="mr-2" /> Back to Health Issue
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">{getPageTitle()}</h1>
      
      {renderForm()}
    </div>
  );
};

export default HealthIssueFormPage;