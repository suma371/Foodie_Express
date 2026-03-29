import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Point to backend
  withCredentials: true, // For sending cookies (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
