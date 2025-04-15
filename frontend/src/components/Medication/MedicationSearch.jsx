import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSearchMedicationsQuery, useGetMedicationCategoriesQuery } from '../../store/api/medicationApi';
import { toast } from 'react-toastify';
import { XMarkIcon } from '@heroicons/react/24/outline';
import debounce from 'lodash/debounce';

const MedicationSearch = ({ onSelect, selectedMedication }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Fetch categories using RTK Query
  const { 
    data: categories = [],
    error: categoriesError 
  } = useGetMedicationCategoriesQuery();
  
  // Search medications with RTK Query
  const { 
    data: medications = [], 
    isFetching: isLoading,
    error: searchError 
  } = useSearchMedicationsQuery(
    { q: query, category: selectedCategory },
    { skip: !query && !selectedCategory }
  );
  
  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  useEffect(() => {
    // Show results when data is available
    if (medications.length > 0 && !isLoading) {
      setIsOpen(true);
    }
  }, [medications, isLoading]);
  
  useEffect(() => {
    // Handle errors
    if (categoriesError) {
      console.error('Error loading categories:', categoriesError);
      toast.error('Failed to load medication categories');
    }
    
    if (searchError) {
      console.error('Error searching medications:', searchError);
      toast.error('Failed to search medications. Please try again.');
    }
  }, [categoriesError, searchError]);
  
  const handleQueryChange = debounce((e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  }, 300);
  
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  const handleSelect = (medication) => {
    onSelect(medication);
    setQuery('');
    setIsOpen(false);
  };

  const clearSelection = () => {
    onSelect(null);
    setQuery('');
  };

  return (
    <div className="space-y-4">
      {selectedMedication ? (
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
          <div>
            <p className="font-medium">{selectedMedication.full_name}</p>
            <p className="text-sm text-gray-500">
              {selectedMedication.manufacturer}
            </p>
          </div>
          <button
            type="button"
            onClick={clearSelection}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="relative" ref={dropdownRef}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="text"
              defaultValue={query}
              onChange={(e) => handleQueryChange(e)}
              placeholder="Search medications..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>

          {isOpen && medications.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {medications.map((medication) => (
                <button
                  key={medication.id}
                  type="button"
                  onClick={() => handleSelect(medication)}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">{medication.full_name}</div>
                    <div className="text-sm text-gray-500">
                      {medication.manufacturer}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <div className="animate-spin h-5 w-5 border-2 border-gray-500 rounded-full border-t-transparent"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

MedicationSearch.propTypes = {
  onSelect: PropTypes.func.isRequired,
  selectedMedication: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    full_name: PropTypes.string.isRequired,
    manufacturer: PropTypes.string,
  }),
};

export default MedicationSearch;