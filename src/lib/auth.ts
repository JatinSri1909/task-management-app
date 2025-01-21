import axios from 'axios';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData extends LoginData {
  confirmPassword: string;
}

const AUTH_TOKEN_KEY = 'taskmanager_token';

export const auth = {
  // Store JWT token
  setToken: (token: string) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  // Get stored JWT token
  getToken: () => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  // Remove stored JWT token
  removeToken: () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  // Check if user is logged in
  isLoggedIn: () => {
    return !!auth.getToken();
  },

  // Login user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await axios.post('/api/auth/login', data);
    auth.setToken(response.data.token);
    return response.data;
  },

  // Signup user  
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await axios.post('/api/auth/signup', data);
    auth.setToken(response.data.token);
    return response.data;
  },

  // Logout user
  logout: () => {
    auth.removeToken();
  }
};
