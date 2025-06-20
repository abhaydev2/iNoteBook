// config/api.config.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/users/signup`,
    LOGIN: `${API_BASE_URL}/users/login`,
      LOGOUT: `${API_BASE_URL}/users/logout`, // <-- Add this
  },
  NOTES: {
    BASE: `${API_BASE_URL}/notes`,
    CREATE: `${API_BASE_URL}/notes`,
    GET_ALL: `${API_BASE_URL}/notes`,
    UPDATE: `${API_BASE_URL}/notes`,
    DELETE: `${API_BASE_URL}/notes`,
  },
};

export default API_ENDPOINTS;
