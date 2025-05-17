const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = {
  baseURL: API_BASE_URL,
  endpoints: {
    auth: {
      login: '/api/auth/login',
      register: '/api/auth/register',
      logout: '/api/auth/logout',
    },
    calculators: {
      roi: '/api/calculators/roi',
      mortgage: '/api/calculators/mortgage',
      rehab: '/api/calculators/rehab',
    },
  },
};

export default api; 