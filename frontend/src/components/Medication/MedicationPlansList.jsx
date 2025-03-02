import React from 'react';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

const MedicationPlansList = ({ plans }) => {
  return (
    <div className="space-y-4">
      {plans.map((plan) => (
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
  );
};

export default MedicationPlansList;