import React, { useState, useContext, useRef } from 'react';
import { AuthContext } from '../../context/authContext';
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../Sidebar';
import TopNav from './TopNav';

/* ------------------ AddCondition Component (for Chronic Conditions) ------------------ */
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
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      {/* Modal Content */}
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

/* ------------------ AddAllergy Component (for Allergies) ------------------ */
const AddAllergy = ({ onClose, onConfirm }) => {
  const [allergyType, setAllergyType] = useState('None');
  const [dateDiagnosed, setDateDiagnosed] = useState('');
  const [description, setDescription] = useState('');

  const allergyTypes = [
    'None',
    'Dust Allergy',
    'Food Allergy',
    'Insect Allergy',
    'Latex Allergy',
    'Mold Allergy',
    'Pet Allergy',
    'Pollen Allergy',
    'Drug Allergy',
    'Other Allergy',
  ];

  const handleConfirm = () => {
    if (!allergyType || !dateDiagnosed.trim()) {
      alert('Please fill in all required fields (Allergy Type and Date Diagnosed).');
      return;
    }
    const allergyData = {
      allergyType,
      dateDiagnosed,
      description,
    };
    onConfirm(allergyData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      {/* Modal Content */}
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-semibold mb-4">Add Allergy</h2>
        <form>
          {/* Allergy Type Dropdown */}
          <div className="mb-4">
            <label htmlFor="allergyType" className="block text-sm font-medium mb-1">
              Allergy Type
            </label>
            <select
              id="allergyType"
              value={allergyType}
              onChange={(e) => setAllergyType(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {allergyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          {/* Date Diagnosed */}
          <div className="mb-4">
            <label htmlFor="dateDiagnosed" className="block text-sm font-medium mb-1">
              Date Diagnosed
            </label>
            <input
              type="date"
              id="dateDiagnosed"
              value={dateDiagnosed}
              onChange={(e) => setDateDiagnosed(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          {/* Description */}
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
        {/* Actions */}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleConfirm}
          >
            Confirm
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------------ Main MedicalRecord Component ------------------ */
const MedicalRecord = () => {
  const { user } = useContext(AuthContext);

  // User information (hard-coded or from API)
  const [fullName] = useState('Faysal Ahammed');
  const [email] = useState('faysalahammed2021@stud.cou.ac.bd');
  const firstLetter = fullName.charAt(0);

  // Medical info
  const [bloodGroup, setBloodGroup] = useState('None');
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);

  // Photo upload
  const [photo, setPhoto] = useState(null);
  const fileInputRef = useRef(null);
  const handleAddPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Please select a file under 5MB.');
      return;
    }
    setPhoto(file);
  };

  // Sidebar & Top Navigation items
  const bloodGroups = ['None', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  // Additional Information collapsible
  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(true);

  // Chronic Conditions state
  const [chronicConditions, setChronicConditions] = useState([]);
  // Allergies state
  const [allergies, setAllergies] = useState([]);

  // Modal controls for adding new entries
  const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(false);
  const [isAddAllergyModalOpen, setIsAddAllergyModalOpen] = useState(false);

  // Handlers to add new entries
  const handleAddConditionConfirm = (conditionData) => {
    setChronicConditions([...chronicConditions, conditionData]);
    setIsAddConditionModalOpen(false);
  };
  const handleAddAllergyConfirm = (allergyData) => {
    setAllergies([...allergies, allergyData]);
    setIsAddAllergyModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <TopNav fullName={fullName} />
        {/* Main Content */}
        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
            {/* Photo / Upload Section */}
            <div className="flex flex-col items-center">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="Profile Preview"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">{firstLetter}</span>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handlePhotoChange}
              />
              <button onClick={handleAddPhotoClick} className="mt-3 text-blue-600 hover:text-blue-800">
                Add photo
              </button>
              <h2 className="text-xl font-semibold mt-3">{fullName}</h2>
              <p className="text-gray-500">PIN: C4SDW9N5A5</p>
              <button className="mt-3 text-blue-600 hover:text-blue-800">Edit Profile</button>
              <button className="mt-1 text-gray-500 hover:text-gray-700">Download Medical History</button>
              <button className="mt-1 text-red-500 hover:text-red-700">Delete</button>
            </div>

            {/* Basic Info & Additional Information */}
            <div className="flex-1">
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Blood Group */}
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    {bloodGroups.map((group) => (
                      <option key={group} value={group}>
                        {group}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Height */}
                <div>
                  <label className="block text-sm font-medium mb-1">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                {/* Weight */}
                <div>
                  <label className="block text-sm font-medium mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              {/* Additional Information (Collapsible) */}
              <div className="mt-6">
                <button
                  onClick={() => setIsAdditionalInfoOpen(!isAdditionalInfoOpen)}
                  className="flex items-center justify-between w-full px-0 py-2"
                >
                  <span className="text-lg font-semibold">Additional Information</span>
                  {isAdditionalInfoOpen ? (
                    <ChevronUpIcon className="w-5 h-5" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5" />
                  )}
                </button>
                {isAdditionalInfoOpen && (
                  <div className="mt-4 space-y-6">
                    {/* Chronic Conditions */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Chronic Conditions</h3>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setIsAddConditionModalOpen(true)}
                        >
                          + Add new entry
                        </button>
                      </div>
                      {chronicConditions.length === 0 ? (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-4 mt-2 flex items-center justify-center text-gray-500">
                          <p>No Chronic Conditions</p>
                        </div>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {chronicConditions.map((condition, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-300 rounded p-2">
                              <p className="font-semibold">{condition.disease}</p>
                              <p>{condition.conditionName}</p>
                              <p>Date Diagnosed: {condition.dateDiagnosed}</p>
                              {condition.description && <p>Description: {condition.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Allergies */}
                    <div>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Allergies</h3>
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => setIsAddAllergyModalOpen(true)}
                        >
                          + Add new entry
                        </button>
                      </div>
                      {allergies.length === 0 ? (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded p-4 mt-2 flex items-center justify-center text-gray-500">
                          <p>No Allergies</p>
                        </div>
                      ) : (
                        <div className="mt-2 space-y-2">
                          {allergies.map((allergy, index) => (
                            <div key={index} className="bg-gray-50 border border-gray-300 rounded p-2">
                              <p className="font-semibold">{allergy.allergyType}</p>
                              <p>Date Diagnosed: {allergy.dateDiagnosed}</p>
                              {allergy.description && <p>Description: {allergy.description}</p>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Update Button (Disabled) */}
          <div className="mt-6">
            <button
              className="px-6 py-2 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
              disabled
            >
              Update
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isAddConditionModalOpen && (
        <AddCondition
          onClose={() => setIsAddConditionModalOpen(false)}
          onConfirm={handleAddConditionConfirm}
        />
      )}
      {isAddAllergyModalOpen && (
        <AddAllergy
          onClose={() => setIsAddAllergyModalOpen(false)}
          onConfirm={handleAddAllergyConfirm}
        />
      )}
    </div>
  );
};

export default MedicalRecord;
