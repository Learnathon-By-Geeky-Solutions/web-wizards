import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import Sidebar from '../Sidebar';

const Setting = () => {
  const { user, logout } = useContext(AuthContext);

  // Basic states
  const [fullName, setFullName] = useState('Faysal Ahammed');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [message, setMessage] = useState('');

  // Settings form states
  const [unitOfMeasurement, setUnitOfMeasurement] = useState('metric');
  const [cholesterolUnit, setCholesterolUnit] = useState('mmol/L');
  const [classificationMethod, setClassificationMethod] = useState('ESC/ESH');
  const [glucoseUnit, setGlucoseUnit] = useState('mmol/L');
  const [ketonesUnit, setKetonesUnit] = useState('mmol/L');
  const [hbA1cUnit, setHbA1cUnit] = useState('%');
  const [dateFormat, setDateFormat] = useState('yyyy-MM-dd');
  const [morningTime, setMorningTime] = useState('07:00');
  const [noonTime, setNoonTime] = useState('12:00');
  const [eveningTime, setEveningTime] = useState('18:00');
  const [bedTime, setBedTime] = useState('23:00');
  const [use24HourClock, setUse24HourClock] = useState(true);

  const handleReset = () => {
    setUnitOfMeasurement('metric');
    setCholesterolUnit('mmol/L');
    setClassificationMethod('ESC/ESH');
    setGlucoseUnit('mmol/L');
    setKetonesUnit('mmol/L');
    setHbA1cUnit('%');
    setDateFormat('yyyy-MM-dd');
    setMorningTime('07:00');
    setNoonTime('12:00');
    setEveningTime('18:00');
    setBedTime('23:00');
    setUse24HourClock(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    // Example validation can be added here if needed.
    // Since the form has default values, this example proceeds to "save".

    console.log({
      unitOfMeasurement,
      cholesterolUnit,
      classificationMethod,
      glucoseUnit,
      ketonesUnit,
      hbA1cUnit,
      dateFormat,
      morningTime,
      noonTime,
      eveningTime,
      bedTime,
      use24HourClock,
    });

    // Set the success message and clear it after 3 seconds
    setMessage('Settings saved successfully');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleProfileInfoClick = () => {
    alert(`Profile Info\nName: ${user?.name}\nEmail: ${user?.email}`);
    setIsDropdownOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsDropdownOpen(false);
  };

  // Display the first letter of user's name
  const getFirstLetter = (name) => name?.[0].toUpperCase();

  // Loading state
  if (isLoading) {
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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-6">
        {/* User Profile Dropdown */}
        <div className="relative flex justify-end mb-4">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
          >
            <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white">
              {getFirstLetter(fullName)}
            </div>
            <span className="text-gray-700">{fullName}</span>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-12 w-48 bg-white rounded-lg shadow-lg py-1 z-10">
              <button
                onClick={handleProfileInfoClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Profile Info
              </button>
              <button
                onClick={handleLogoutClick}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Settings Form */}
        <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Settings</h1>

          {message && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="unitOfMeasurement"
              >
                Unit of Measurement
              </label>
              <select
                id="unitOfMeasurement"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={unitOfMeasurement}
                onChange={(e) => setUnitOfMeasurement(e.target.value)}
              >
                <option value="metric">Metric (kg, gram, ml, cm)</option>
                <option value="imperial">Imperial (lb, oz, in)</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="cholesterolUnit"
              >
                Cholesterol Unit
              </label>
              <select
                id="cholesterolUnit"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={cholesterolUnit}
                onChange={(e) => setCholesterolUnit(e.target.value)}
              >
                <option value="mmol/L">mmol/L</option>
                <option value="mg/dL">mg/dL</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="classificationMethod"
              >
                Classification Method
              </label>
              <select
                id="classificationMethod"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={classificationMethod}
                onChange={(e) => setClassificationMethod(e.target.value)}
              >
                <option value="ESC/ESH">ESC/ESH</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="glucoseUnit"
              >
                Glucose Unit
              </label>
              <select
                id="glucoseUnit"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={glucoseUnit}
                onChange={(e) => setGlucoseUnit(e.target.value)}
              >
                <option value="mmol/L">mmol/L</option>
                <option value="mg/dL">mg/dL</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="ketonesUnit"
              >
                Ketones Unit
              </label>
              <select
                id="ketonesUnit"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={ketonesUnit}
                onChange={(e) => setKetonesUnit(e.target.value)}
              >
                <option value="mmol/L">mmol/L</option>
                <option value="mg/dL">mg/dL</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="hbA1cUnit">
                HbA1c Unit
              </label>
              <select
                id="hbA1cUnit"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={hbA1cUnit}
                onChange={(e) => setHbA1cUnit(e.target.value)}
              >
                <option value="%">%</option>
                <option value="mmol/mol">mmol/mol</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="dateFormat">
                Date Format
              </label>
              <select
                id="dateFormat"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={dateFormat}
                onChange={(e) => setDateFormat(e.target.value)}
              >
                <option value="yyyy-MM-dd">yyyy-MM-dd</option>
                <option value="MM/dd/yyyy">MM/dd/yyyy</option>
                <option value="dd/MM/yyyy">dd/MM/yyyy</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="morningTime">
                Morning Time
              </label>
              <input
                id="morningTime"
                type="time"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={morningTime}
                onChange={(e) => setMorningTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="noonTime">
                Noon Time
              </label>
              <input
                id="noonTime"
                type="time"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={noonTime}
                onChange={(e) => setNoonTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="eveningTime">
                Evening Time
              </label>
              <input
                id="eveningTime"
                type="time"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={eveningTime}
                onChange={(e) => setEveningTime(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="bedTime">
                Bed Time
              </label>
              <input
                id="bedTime"
                type="time"
                className="block w-full border border-gray-300 rounded px-3 py-2"
                value={bedTime}
                onChange={(e) => setBedTime(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <input
                id="use24HourClock"
                type="checkbox"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                checked={use24HourClock}
                onChange={(e) => setUse24HourClock(e.target.checked)}
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
