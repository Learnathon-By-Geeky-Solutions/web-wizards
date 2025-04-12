import React, { useState } from 'react';
import VitalsModal from './VitalsModal';
import VitalsList from './VitalsList';
import { saveVitalMeasurement } from '../../../api/vitalsApi';
import { toast } from 'react-toastify';

const Logbook = () => {
  const [currentPage, setCurrentPage] = useState('LOGBOOK');
  const [reloadList, setReloadList] = useState(0);

  const handleSaveVital = async (data) => {
    try {
      await saveVitalMeasurement(data);
      toast.success('Vital measurement saved successfully');
      setReloadList(prev => prev + 1);
    } catch (error) {
      console.error('Failed to save vital measurement:', error);
      toast.error('Failed to save vital measurement');
    }
  };

  return (
    <div className="p-4">
      {currentPage === 'LOGBOOK' ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Health Logbook</h1>
            <button
              onClick={() => setCurrentPage('ADD_VITAL')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Vital Sign
            </button>
          </div>
          <VitalsList key={reloadList} />
        </>
      ) : currentPage === 'ADD_VITAL' && (
        <VitalsModal 
          setCurrentPage={setCurrentPage}
          onSave={handleSaveVital}
        />
      )}
    </div>
  );
};

export default Logbook;