import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  confirmPassword: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  },

  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/register`, {
      email: credentials.email,
      password: credentials.password,
      name: credentials.email.split('@')[0], // Use email username as default name
    });
    return response.data;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await axios.post(`${API_URL}/forgot-password`, { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await axios.post(`${API_URL}/reset-password`, { token, password });
  },

  googleAuth: () => {
    window.location.href = `${API_URL}/google`;
  },

  logout: () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },

  setToken: (token: string, remember: boolean = false) => {
    if (remember) {
      localStorage.setItem('token', token);
    } else {
      sessionStorage.setItem('token', token);
    }
  },

  // Add axios interceptor for authentication
  setupAxiosInterceptors: () => {
    axios.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  },
};

// Setup axios interceptors
authService.setupAxiosInterceptors();

export default authService; 