import { useState } from 'react';
import PropTypes from 'prop-types';

const AddCondition = ({ onClose, onConfirm }) => {
  const [disease, setDisease] = useState('');
  const [conditionName, setConditionName] = useState('');
  const [dateDiagnosed, setDateDiagnosed] = useState('');
  const [description, setDescription] = useState('');

  const handleConfirm = () => {
    if (!disease.trim() || !conditionName.trim() || !dateDiagnosed.trim()) {
      alert('Please fill in all required fields.');
      return;
    }
    onConfirm({ disease, conditionName, dateDiagnosed, description });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Add Condition</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="disease" className="block text-sm font-medium mb-1">
              Disease <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="disease"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              placeholder="Enter disease"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="conditionName" className="block text-sm font-medium mb-1">
              Condition Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="conditionName"
              value={conditionName}
              onChange={(e) => setConditionName(e.target.value)}
              placeholder="Enter condition name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dateDiagnosed" className="block text-sm font-medium mb-1">
              Date Diagnosed <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateDiagnosed"
              value={dateDiagnosed}
              onChange={(e) => setDateDiagnosed(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description (optional)"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>
        </form>
        <div className="flex justify-end space-x-2 mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={handleConfirm}>
            Confirm
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

AddCondition.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default AddCondition;