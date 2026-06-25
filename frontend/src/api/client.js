import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
});

export const getPortfolio = () => api.get('/portfolio');
export const addAsset = (data) => api.post('/portfolio', data);
export const deleteAsset = (id) => api.delete(`/portfolio/${id}`);
export const getCoinHistory = (coinId, days = 7) =>
  api.get(`/coins/${coinId}/history?days=${days}`);
export const getCoinOHLC = (coinId, days = 7) =>
  api.get(`/coins/${coinId}/ohlc?days=${days}`);
export const getCoinDetails = (coinId) =>
  api.get(`/coins/${coinId}/details`);
export const getCoinPrices = (ids) =>
  api.get(`/coins/prices${ids ? `?ids=${ids}` : ''}`);
export const getTopCoins = (limit = 50) =>
  api.get(`/coins/top?limit=${limit}`);