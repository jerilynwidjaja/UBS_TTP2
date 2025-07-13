import axios from 'axios';

const API_BASE_URL = 'http://52.221.205.14:8080';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserPreferences {
  careerStage: string;
  skills: string[];
  learningGoals: string[];
  timeAvailability: string;
  level: string;
}

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials) {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    return response.data;
  }

  static async register(data: RegisterData) {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  }

  static async getUserProfile() {
    const response = await axios.get(`${API_BASE_URL}/auth/profile`);
    return response.data.user;
  }

  static async updatePreferences(preferences: UserPreferences) {
    const response = await axios.post(`${API_BASE_URL}/auth/preferences`, preferences);
    return response.data;
  }

  static async changePassword(data: PasswordChangeData) {
    const response = await axios.post(`${API_BASE_URL}/auth/change-password`, data);
    return response.data;
  }

  static setAuthToken(token: string) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static removeAuthToken() {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }

  static getStoredToken(): string | null {
    return localStorage.getItem('token');
  }
}