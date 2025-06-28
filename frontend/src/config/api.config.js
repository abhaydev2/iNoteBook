// config/api.config.js

const  API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    SIGNUP: `${API_BASE_URL}/users/signup`,
    LOGIN: `${API_BASE_URL}/users/login`,
    LOGOUT: `${API_BASE_URL}/users/logout`,
  },
  NOTES: {
    GET_ALL: `${API_BASE_URL}/notes/getnotes`,
    CREATE: `${API_BASE_URL}/notes/create`,
    UPDATE: `${API_BASE_URL}/notes/edit`,
    DELETE: `${API_BASE_URL}/notes/delete`,
  },
};

export default  API_BASE_URL;
