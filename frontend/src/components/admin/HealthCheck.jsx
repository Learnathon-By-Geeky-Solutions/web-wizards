import React from 'react';
import { useGetHealthStatusQuery, useGetDatabaseStatusQuery, useGetRedisStatusQuery } from '../store/api/healthApi';

const HealthCheck = () => {
  const { data: healthStatus, isLoading: healthLoading, error: healthError } = useGetHealthStatusQuery();
  const { data: dbStatus, isLoading: dbLoading, error: dbError } = useGetDatabaseStatusQuery();
  const { data: redisStatus, isLoading: redisLoading, error: redisError } = useGetRedisStatusQuery();

  const renderStatusBadge = (isUp) => {
    if (isUp) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Operational</span>;
    }
    return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Failure</span>;
  };
  
  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-4">System Health Status</h2>
      <div className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">API Service</h3>
            {healthLoading ? (
              <div className="animate-pulse w-20 h-6 bg-gray-200 rounded-full"></div>
            ) : healthError ? (
              renderStatusBadge(false)
            ) : (
              renderStatusBadge(healthStatus?.status === 'ok')
            )}
          </div>
          <p className="text-sm text-gray-500">
            {healthLoading ? 'Checking status...' : 
             healthError ? 'Unable to reach API service' :
             healthStatus?.message || 'API service is responding normally'}
          </p>
        </div>
      
        <div className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">Database</h3>
            {dbLoading ? (
              <div className="animate-pulse w-20 h-6 bg-gray-200 rounded-full"></div>
            ) : dbError ? (
              renderStatusBadge(false)
            ) : (
              renderStatusBadge(dbStatus?.status === 'ok')
            )}
          </div>
          <p className="text-sm text-gray-500">
            {dbLoading ? 'Checking database connection...' : 
             dbError ? 'Database connection failed' :
             dbStatus?.message || 'Database connection is healthy'}
          </p>
        </div>
      
        <div className="p-4 border border-gray-200 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-gray-700">Redis Cache</h3>
            {redisLoading ? (
              <div className="animate-pulse w-20 h-6 bg-gray-200 rounded-full"></div>
            ) : redisError ? (
              renderStatusBadge(false)
            ) : (
              renderStatusBadge(redisStatus?.status === 'ok')
            )}
          </div>
          <p className="text-sm text-gray-500">
            {redisLoading ? 'Checking Redis connection...' : 
             redisError ? 'Redis connection failed' :
             redisStatus?.message || 'Redis cache is functioning properly'}
          </p>
        </div>
      </div>
      
      <div className="mt-6 text-right">
        <div className="text-xs text-gray-500">
          Last checked: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;