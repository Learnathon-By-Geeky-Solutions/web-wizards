import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import Sidebar from '../Sidebar';
import {
  PencilSquareIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

const MedicationPlans = () => {
  const { user } = useContext(AuthContext);
  const [isLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('MEDICATION_PLANS_HOME');

  // Filters state
  const [statusFilter, setStatusFilter] = useState('Active');
  const [healthIssueFilter, setHealthIssueFilter] = useState('All Health Issues');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample medication plan data
  const [medicationPlans] = useState([
    {
      id: 'Chat-0009',
      description: '1 mg, when needed, ongoing',
      effectiveDate: '2025-01-08',
      status: 'Active',
    },
  ]);

  // Modal handlers
  const openLogMedicationPlan = () => setCurrentPage('LOG_MEDICATION_PLAN');
  const closeLogMedicationPlan = () => setCurrentPage('MEDICATION_PLANS_HOME');

  // Filter logic
  const filteredPlans = medicationPlans.filter((plan) => {
    if (statusFilter !== 'All' && plan.status !== statusFilter) return false;
    if (searchTerm && !plan.id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        {/* Rest of your component JSX */}
        <div className="mt-6 relative">
          {/* Page 1: Medication Plans Home */}
          {currentPage === 'MEDICATION_PLANS_HOME' && (
            <div>
              {/* Header + Filters */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Medication Plans</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  {/* Status filters */}
                  <div className="flex items-center space-x-2">
                    {['Active', 'Inactive', 'All'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1 rounded-full ${
                          statusFilter === status
                            ? 'bg-teal-600 text-white'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>

                  {/* Health issue dropdown */}
                  <select
                    value={healthIssueFilter}
                    onChange={(e) => setHealthIssueFilter(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-gray-700"
                  >
                    <option>All Health Issues</option>
                    <option>Current Health Issues</option>
                    <option>Past Health Issues</option>
                  </select>

                  {/* Search bar */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border rounded pl-3 pr-3 py-1 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Medication Plans List */}
              {filteredPlans.length > 0 ? (
                <div className="space-y-4">
                  {filteredPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-white rounded shadow"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-700">{plan.id}</h3>
                        <p className="text-sm text-gray-500">{plan.description}</p>
                        <p className="text-sm text-gray-500">
                          Effective from {plan.effectiveDate}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 md:mt-0">
                        {/* Edit icon */}
                        <button
                          type="button"
                          className="p-2 rounded hover:bg-gray-100 text-gray-600"
                          title="Edit"
                          onClick={() => alert(`Edit ${plan.id}`)}
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </button>
                        {/* Delete icon */}
                        <button
                          type="button"
                          className="p-2 rounded hover:bg-gray-100 text-gray-600"
                          title="Delete"
                          onClick={() => alert(`Delete ${plan.id}`)}
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // Empty State if no matching plans
                <div className="flex flex-col items-center justify-center mt-16">
                  <div className="w-32 h-32 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-teal-400"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M12 4v16M4 12h16" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-lg">
                    No medication plans found for this filter.
                  </p>
                </div>
              )}

              {/* Floating Plus Button to add new plan */}
              <button
                onClick={openLogMedicationPlan}
                className="bg-teal-500 text-white w-12 h-12 rounded-full fixed bottom-6 right-6 flex items-center justify-center text-2xl hover:bg-teal-600"
              >
                +
              </button>
            </div>
          )}

          {/* Page 2: Log Medication Plan (Modal) */}
          {currentPage === 'LOG_MEDICATION_PLAN' && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
                <h2 className="text-2xl font-bold mb-4">Add Medication Plan</h2>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Date*
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded-md"
                        defaultValue="2025-02-15"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
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
                    <label className="block text-sm font-medium text-gray-700">
                      Medication name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter medication plan title"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-2 mt-4">
                  <button
                    onClick={closeLogMedicationPlan}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <button className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600">
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicationPlans;
