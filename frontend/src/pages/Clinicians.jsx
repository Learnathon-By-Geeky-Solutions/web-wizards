import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import SearchFilters from '../components/Clinicians/SearchFilters';
import ClinicianCard from '../components/Clinicians/ClinicianCard';
import DiagnosticCenterCard from '../components/Clinicians/DiagnosticCenterCard';
import Spinner from '../components/common/Spinner';
import { 
  fetchClinicians, 
  fetchDiagnosticCenters, 
  fetchSpecializations 
} from '../api/cliniciansApi';
import {
  setActiveTab,
  setClinicians,
  setDiagnosticCenters,
  setSpecializations,
  updateFilter,
  resetFilters,
  setLoading,
  setError
} from '../store/slices/clinicianSlice';

const Clinicians = () => {
  const navigate = useNavigate();
  const {
    activeTab,
    clinicians,
    diagnosticCenters,
    specializations,
    loading: isLoading,
    error,
    filters
  } = useSelector(state => state.clinicians);
  const dispatch = useDispatch();

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      dispatch(setLoading(true));
      try {
        // Load specializations
        const specializationsData = await fetchSpecializations();
        dispatch(setSpecializations(specializationsData));
        
        // Load initial clinicians and diagnostic centers
        if (activeTab === 'clinicians') {
          const cliniciansData = await fetchClinicians();
          dispatch(setClinicians(cliniciansData));
        } else {
          const centersData = await fetchDiagnosticCenters();
          dispatch(setDiagnosticCenters(centersData));
        }
        
        dispatch(setError(null));
      } catch (err) {
        console.error('Error loading clinicians data:', err);
        dispatch(setError('Failed to load data. Please try again.'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    
    loadData();
  }, [activeTab, dispatch]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    dispatch(updateFilter({ filterName, value }));
  };

  // Filter clinicians based on current filters
  const filteredClinicians = clinicians.filter((clinician) => {
    // Search term filter (name, specialization)
    if (filters.searchTerm && 
        !clinician.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !(clinician.specializations && 
          clinician.specializations.some(spec => 
            spec.name.toLowerCase().includes(filters.searchTerm.toLowerCase())
          ))
    ) {
      return false;
    }
    
    // City filter
    if (filters.city && clinician.city !== filters.city) {
      return false;
    }
    
    // Specialization filter
    if (filters.specialization && 
        !(clinician.specializations && 
          clinician.specializations.some(spec => 
            spec.id.toString() === filters.specialization
          ))
    ) {
      return false;
    }
    
    // Rating filter
    if (filters.rating && clinician.average_rating < parseFloat(filters.rating)) {
      return false;
    }
    
    // Available online filter
    if (filters.availableOnline && !clinician.available_online) {
      return false;
    }
    
    // Accepting patients filter
    if (filters.acceptingPatients && !clinician.is_accepting_patients) {
      return false;
    }
    
    return true;
  });

  // Filter diagnostic centers based on current filters
  const filteredCenters = diagnosticCenters.filter((center) => {
    // Search term filter (name, services)
    if (filters.searchTerm && 
        !center.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !(center.services && 
          center.services.toLowerCase().includes(filters.searchTerm.toLowerCase()))
    ) {
      return false;
    }
    
    // City filter
    if (filters.city && center.city !== filters.city) {
      return false;
    }
    
    // Rating filter
    if (filters.rating && center.average_rating < parseFloat(filters.rating)) {
      return false;
    }
    
    // 24 Hours filter
    if (filters.is24Hours && !center.is_24_hours) {
      return false;
    }
    
    // Home collection filter
    if (filters.hasHomeCollection && !center.has_home_collection) {
      return false;
    }
    
    return true;
  });

  // Handle navigation to detail pages
  const handleViewClinicianDetails = (id) => {
    navigate(`/clinicians/physician/${id}`);
  };

  const handleViewCenterDetails = (id) => {
    navigate(`/clinicians/diagnostic-center/${id}`);
  };

  return (
    <MainLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Find Healthcare Providers</h1>
        
        {/* Tabs */}
        <div className="bg-white rounded-lg p-1 mb-6 inline-flex shadow">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'clinicians'
                ? 'bg-teal-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => dispatch(setActiveTab('clinicians'))}
          >
            Clinicians
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'centers'
                ? 'bg-teal-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => dispatch(setActiveTab('centers'))}
          >
            Diagnostic Centers
          </button>
        </div>
        
        {/* Filters */}
        <SearchFilters 
          filters={filters} 
          onFilterChange={handleFilterChange} 
          specializations={specializations}
          activeTab={activeTab}
        />
        
        {/* Results */}
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : (
          <div>
            {activeTab === 'clinicians' ? (
              // Clinicians list
              <>
                <h2 className="text-xl font-semibold mb-4">Clinicians ({filteredClinicians.length})</h2>
                
                {filteredClinicians.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredClinicians.map((clinician) => (
                      <ClinicianCard 
                        key={clinician.id} 
                        clinician={clinician} 
                        onViewDetails={handleViewClinicianDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No clinicians found matching your criteria.</p>
                    <button
                      onClick={() => dispatch(resetFilters())}
                      className="mt-3 text-teal-500 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Diagnostic centers list
              <>
                <h2 className="text-xl font-semibold mb-4">Diagnostic Centers ({filteredCenters.length})</h2>
                
                {filteredCenters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCenters.map((center) => (
                      <DiagnosticCenterCard 
                        key={center.id} 
                        center={center} 
                        onViewDetails={handleViewCenterDetails}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No diagnostic centers found matching your criteria.</p>
                    <button
                      onClick={() => dispatch(resetFilters())}
                      className="mt-3 text-teal-500 hover:underline"
                    >
                      Clear filters
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Clinicians;