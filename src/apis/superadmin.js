import api from './axios'; // axios with baseURL

export const getSchools = (q = {}) => api.get('/api/schools', { params: q });
export const createSchool = (body) => api.post('/api/schools', body);
export const assignApiKey = (body) => api.post('/api/apikeys/assign', body);
export const createApiKey = (body) => api.post('/api/apikeys', body);
export const getApiKeys = (q={}) => api.get('/api/apikeys', { params: q });
export const getUsage = (q={}) => api.get('/api/usage', { params: q });
