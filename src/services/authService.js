import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export class AuthService {
  static async login(credentials) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  }

  static async register(data) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  }

  static async getUserProfile() {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`);
    return response.data.user;
  }

  static async updatePreferences(preferences) {
    const response = await axios.post(`${API_BASE_URL}/auth/preferences`, preferences);
    return response.data;
  }

  static async changePassword(data) {
    const response = await axios.post(`${API_BASE_URL}/auth/change-password`, data);
    return response.data;
  }

  static setAuthToken(token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeAuthToken() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  static getStoredToken() {
    return localStorage.getItem('token');
  }
}