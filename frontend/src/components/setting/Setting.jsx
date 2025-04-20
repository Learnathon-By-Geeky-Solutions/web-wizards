import React, { useState} from 'react';
import Sidebar from '../Sidebar';
import UserProfile from '../Navbar/UserProfile';
import SelectField from './SelectField';
import TimeField from './TimeField';

const Setting = () => {

  // Combined state object
  const [settings, setSettings] = useState({
    fullName: 'Faysal Ahammed',
    isLoading: false,
    isDropdownOpen: false,
    message: '',
    unitOfMeasurement: 'metric',
    cholesterolUnit: 'mmol/L',
    classificationMethod: 'ESC/ESH',
    glucoseUnit: 'mmol/L',
    ketonesUnit: 'mmol/L',
    hbA1cUnit: '%',
    dateFormat: 'yyyy-MM-dd',
    morningTime: '07:00',
    noonTime: '12:00',
    eveningTime: '18:00',
    bedTime: '23:00',
    use24HourClock: true
  });

  // Helper function to update single field
  const updateSetting = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setSettings(prev => ({
      ...prev,
      unitOfMeasurement: 'metric',
      cholesterolUnit: 'mmol/L',
      classificationMethod: 'ESC/ESH',
      glucoseUnit: 'mmol/L',
      ketonesUnit: 'mmol/L',
      hbA1cUnit: '%',
      dateFormat: 'yyyy-MM-dd',
      morningTime: '07:00',
      noonTime: '12:00',
      eveningTime: '18:00',
      bedTime: '23:00',
      use24HourClock: true
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    console.log(settings);

    // Set the success message and clear it after 3 seconds
    updateSetting('message', 'Settings saved successfully');
    setTimeout(() => updateSetting('message', ''), 3000);
  };

  // Loading state
  if (settings.isLoading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64 p-6">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
          </div>
        </div>
      </div>
    );
  }

  const selectOptions = {
    unitOfMeasurement: [
      { value: 'metric', label: 'Metric (kg, gram, ml, cm)' },
      { value: 'imperial', label: 'Imperial (lb, oz, in)' }
    ],
    cholesterolUnit: [
      { value: 'mmol/L', label: 'mmol/L' },
      { value: 'mg/dL', label: 'mg/dL' }
    ],
    classificationMethod: [
      { value: 'ESC/ESH', label: 'ESC/ESH' },
      { value: 'ACC/AHA', label: 'ACC/AHA' }
    ],
    glucoseUnit: [
      { value: 'mmol/L', label: 'mmol/L' },
      { value: 'mg/dL', label: 'mg/dL' }
    ],
    ketonesUnit: [
      { value: 'mmol/L', label: 'mmol/L' },
      { value: 'mg/dL', label: 'mg/dL' }
    ],
    hbA1cUnit: [
      { value: '%', label: '%' },
      { value: 'mmol/mol', label: 'mmol/mol' }
    ],
    dateFormat: [
      { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD' },
      { value: 'dd-MM-yyyy', label: 'DD-MM-YYYY' },
      { value: 'MM-dd-yyyy', label: 'MM-DD-YYYY' }
    ]
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-6">
        <UserProfile/>

        {/* Settings Form */}
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>

          {settings.message && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">
              {settings.message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <SelectField
              id="unitOfMeasurement"
              label="Unit of Measurement"
              value={settings.unitOfMeasurement}
              onChange={updateSetting}
              options={selectOptions.unitOfMeasurement}
            />
            
            <SelectField
              id="cholesterolUnit"
              label="Cholesterol Unit"
              value={settings.cholesterolUnit}
              onChange={updateSetting}
              options={selectOptions.cholesterolUnit}
            />

            <SelectField
              id="classificationMethod"
              label="Classification Method"
              value={settings.classificationMethod}
              onChange={updateSetting}
              options={selectOptions.classificationMethod}
            />

            <SelectField
              id="glucoseUnit"
              label="Glucose Unit"
              value={settings.glucoseUnit}
              onChange={updateSetting}
              options={selectOptions.glucoseUnit}
            />

            <SelectField
              id="ketonesUnit"
              label="Ketones Unit"
              value={settings.ketonesUnit}
              onChange={updateSetting}
              options={selectOptions.ketonesUnit}
            />

            <SelectField
              id="hbA1cUnit"
              label="HbA1c Unit"
              value={settings.hbA1cUnit}
              onChange={updateSetting}
              options={selectOptions.hbA1cUnit}
            />

            <SelectField
              id="dateFormat"
              label="Date Format"
              value={settings.dateFormat}
              onChange={updateSetting}
              options={selectOptions.dateFormat}
            />

            <TimeField
              id="morningTime"
              label="Morning Time"
              value={settings.morningTime}
              onChange={updateSetting}
            />

            <TimeField
              id="noonTime"
              label="Noon Time"
              value={settings.noonTime}
              onChange={updateSetting}
            />

            <TimeField
              id="eveningTime"
              label="Evening Time"
              value={settings.eveningTime}
              onChange={updateSetting}
            />

            <TimeField
              id="bedTime"
              label="Bed Time"
              value={settings.bedTime}
              onChange={updateSetting}
            />

            <div className="flex items-center">
              <input
                id="use24HourClock"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={settings.use24HourClock}
                onChange={(e) => updateSetting('use24HourClock', e.target.checked)}
              />
              <label htmlFor="use24HourClock" className="ml-2 text-sm font-medium">
                Use 24 Hour Clock
              </label>
            </div>

            <div className="flex space-x-4 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Setting;
