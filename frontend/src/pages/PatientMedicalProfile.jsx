import React, { useState, useRef, useContext } from 'react';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';
import AddCondition from '../components/MedicalRecord/MedicalRecord/AddCondition';
import AddAllergy from '../components/MedicalRecord/MedicalRecord/AddAllergy';
import { useUploadProfileImageMutation, useUpdatePatientProfileMutation } from '../store/api/userProfileApi';
import { AuthContext } from '../context/authContextDefinition';

const PatientMedicalProfile = () => {
  const { user } = useContext(AuthContext);
  const [fullName, setFullName] = useState(user?.name || 'User');
  const [profileData, setProfileData] = useState(user || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileUpdated, setIsProfileUpdated] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const firstLetter = fullName.charAt(0);

  // RTK Query hooks
  const [uploadProfileImage, { isLoading: isUploadingImage }] = useUploadProfileImageMutation();
  const [updatePatientProfile, { isLoading: isUpdatingProfile }] = useUpdatePatientProfileMutation();

  const [bloodGroup, setBloodGroup] = useState(user?.blood_group || 'None');
  const [height, setHeight] = useState(user?.height || 0);
  const [weight, setWeight] = useState(user?.weight || 0);

  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState(user?.image || null);
  const fileInputRef = useRef(null);

  const handleAddPhotoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handlePhotoChange = async (e) => {
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
    // Create a local preview
    setPhotoUrl(URL.createObjectURL(file));
    setIsProfileUpdated(true);
    setUploadingImage(true);
    
    try {
      // Upload image using RTK Query mutation
      const response = await uploadProfileImage(file).unwrap();
      console.log('Image uploaded successfully:', response);
      // Update the photoUrl with the actual Cloudinary URL from the response
      if (response && response.image) {
        setPhotoUrl(response.image);
      }
      setUploadingImage(false);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
      setUploadingImage(false);
    }
  };

  const bloodGroups = ['None', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const [isAdditionalInfoOpen, setIsAdditionalInfoOpen] = useState(true);

  const [chronicConditions, setChronicConditions] = useState([]);
  const [allergies, setAllergies] = useState([]);

  const [isAddConditionModalOpen, setIsAddConditionModalOpen] = useState(false);
  const [isAddAllergyModalOpen, setIsAddAllergyModalOpen] = useState(false);

  const handleAddConditionConfirm = (conditionData) => {
    setChronicConditions([...chronicConditions, conditionData]);
    setIsAddConditionModalOpen(false);
    setIsProfileUpdated(true);
  };
  
  const handleAddAllergyConfirm = (allergyData) => {
    setAllergies([...allergies, allergyData]);
    setIsAddAllergyModalOpen(false);
    setIsProfileUpdated(true);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);
      const updatedData = {
        blood_group: bloodGroup,
        height: parseFloat(height) || 0,
        weight: parseFloat(weight) || 0,
      };

      // Update profile using RTK Query mutation
      const response = await updatePatientProfile(updatedData).unwrap();
      console.log('Profile updated successfully:', response);
      setIsProfileUpdated(false);
      setIsSaving(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading profile data...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        <div className="flex flex-col items-center">
          {photoUrl ? (
            <div className="relative w-24 h-24">
              {uploadingImage && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}
              <img
                src={photoUrl}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
            </div>
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
          <button 
            onClick={handleAddPhotoClick} 
            className="mt-3 text-blue-600 hover:text-blue-800"
            disabled={uploadingImage}
          >
            {photoUrl ? 'Change photo' : 'Add photo'}
          </button>
          <h2 className="text-xl font-semibold mt-3">{fullName}</h2>
          {profileData && <p className="text-gray-500">PIN: {profileData.id}</p>}
          <button className="mt-3 text-blue-600 hover:text-blue-800">Edit Profile</button>
          <button className="mt-1 text-gray-500 hover:text-gray-700">Download Medical History</button>
          <button className="mt-1 text-red-500 hover:text-red-700">Delete</button>
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium mb-1">Blood Group</label>
              <select
                id="bloodGroup"
                value={bloodGroup}
                onChange={(e) => {
                  setBloodGroup(e.target.value);
                  setIsProfileUpdated(true);
                }}
                className="w-full p-2 border rounded"
              >
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="height" className="block text-sm font-medium mb-1">Height (cm)</label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setIsProfileUpdated(true);
                }}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium mb-1">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setIsProfileUpdated(true);
                }}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
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

      <div className="mt-6">
        <button
          className={`px-6 py-2 ${
            isProfileUpdated 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          } rounded`}
          disabled={!isProfileUpdated || isSaving}
          onClick={handleUpdateProfile}
        >
          {isSaving ? 'Updating...' : 'Update'}
        </button>
      </div>

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

export default PatientMedicalProfile;