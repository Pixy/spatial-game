import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001'; // URL de votre backend NestJS

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const gameAPI = {
  getEasyLevels: () => api.get('/levels/easy'),
  validateAnswer: (data: any) => api.post('/game/validate', data),
  saveProgress: (data: any) => api.post('/progress', data),
};

export default api;
