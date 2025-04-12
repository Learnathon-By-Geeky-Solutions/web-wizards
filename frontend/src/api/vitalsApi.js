import api from './api';

export const saveVitalMeasurement = async (data) => {
  try {
    const response = await api.post('/medical-records/charts/', {
      chart_type: data.type,
      title: data.vital,
      measurement_date: data.date,
      measurement_time: data.time,
      value: parseFloat(data.value),
      unit: data.unit,
      notes: data.notes,
      health_issue: data.health_issue || null
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchVitalMeasurements = async (params = {}) => {
  try {
    const response = await api.get('/medical-records/charts/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};