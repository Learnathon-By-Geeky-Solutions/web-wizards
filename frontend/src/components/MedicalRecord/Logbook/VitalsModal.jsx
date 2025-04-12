import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CloseButton from './CloseButton';
import { useGetHealthIssuesQuery, useAddHealthIssueLogEntryMutation } from '../../../store/api/healthIssuesApi';

const VitalsModal = ({ setCurrentPage }) => {
  const [selectedVital, setSelectedVital] = useState(null);
  const [formData, setFormData] = useState({ 
    date: new Date().toISOString().split('T')[0], 
    time: new Date().toTimeString().slice(0, 5), 
    value: '', 
    health_issue: '',
    notes: '' 
  });
  
  const { data: healthIssues = [] } = useGetHealthIssuesQuery();
  const [addLogEntry] = useAddHealthIssueLogEntryMutation();

  const vitals = {
    'Temperature': { unit: '°C', type: 'temperature' },
    'Blood sugar': { unit: 'mg/dL', type: 'blood_sugar' },
    'Weight': { unit: 'kg', type: 'weight' },
    'Height': { unit: 'cm', type: 'height' },
    'Oxygen saturation': { unit: '%', type: 'oxygen_saturation' },
    'Respiratory rate': { unit: 'breaths/min', type: 'respiratory_rate' },
  };

  const handleSave = async () => {
    if (selectedVital && formData.date && formData.time && formData.value && formData.health_issue) {
      try {
        const data = {
          healthIssueId: formData.health_issue,
          title: `${selectedVital} Measurement`,
          notes: `Value: ${formData.value} ${vitals[selectedVital].unit}\n${formData.notes || ''}`,
          entry_date: formData.date,
          entry_time: formData.time,
          vital_signs: {
            [vitals[selectedVital].type]: {
              value: formData.value,
              unit: vitals[selectedVital].unit
            }
          }
        };
        await addLogEntry(data);
        setCurrentPage('LOGBOOK');
      } catch (error) {
        console.error('Failed to save vital measurement:', error);
      }
    }
  };

  return (
    <div className="relative p-4 bg-white rounded shadow">
      <CloseButton setCurrentPage={setCurrentPage} />
      {!selectedVital ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Add new vital sign</h2>
          <div className="grid grid-cols-2 gap-4">
            {Object.keys(vitals).map((vital) => (
              <button
                key={vital}
                onClick={() => setSelectedVital(vital)}
                className="p-2 bg-blue-100 rounded hover:bg-blue-200"
              >
                {vital}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">{selectedVital}</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="date" className="block mb-1 font-medium">Date</label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="time" className="block mb-1 font-medium">Time</label>
              <input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="value" className="block mb-1 font-medium">
                {selectedVital} Value ({vitals[selectedVital].unit})
              </label>
              <input
                id="value"
                type="text"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder={`Enter ${selectedVital} value`}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="health_issue" className="block mb-1 font-medium">Related Health Issue (Optional)</label>
              <select
                id="health_issue"
                value={formData.health_issue}
                onChange={(e) => setFormData({ ...formData, health_issue: e.target.value })}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a health issue</option>
                {healthIssues.map(issue => (
                  <option key={issue.id} value={issue.id}>
                    {issue.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label htmlFor="notes" className="block mb-1 font-medium">Notes (Optional)</label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border p-2 w-full rounded focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Add any additional notes"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

VitalsModal.propTypes = {
  setCurrentPage: PropTypes.func.isRequired
};

export default VitalsModal;