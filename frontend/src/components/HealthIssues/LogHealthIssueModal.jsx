import React, { useState } from 'react';
import DateTimeInput from './DateTimeInput';

const LogHealthIssueModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSave = () => {
    if (formData.title.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <h2 className="text-2xl font-bold mb-4">Add Health Issue</h2>
        
        <div className="space-y-4">
          <DateTimeInput 
            date={formData.date}
            time={formData.time}
            onDateChange={(value) => handleChange({ target: { name: 'date', value } })}
            onTimeChange={(value) => handleChange({ target: { name: 'time', value } })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">Health Issue Title*</label>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter Health Issue" 
              className="w-full p-2 border rounded-md" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Enter any additional details"
              className="w-full p-2 border rounded-md"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={!formData.title.trim()}
            className={`px-4 py-2 rounded ${formData.title.trim() ? 'bg-teal-500 text-white hover:bg-teal-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogHealthIssueModal;