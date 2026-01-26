import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Configuração da API
const API_BASE_URL = __DEV__
  ? "http://localhost:5000"
  : "http://localhost:5000"; // Alterar para URL de produção quando necessário

// ==================== AXIOS INSTANCE ====================
// Instância do axios com interceptor automático de token
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error("Erro ao recuperar token", e);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// ==================== ENDPOINTS ====================
// Endpoints de autenticação
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
};

// Endpoints de usuários
export const USER_ENDPOINTS = {
  ME: `${API_BASE_URL}/api/users/me`,
  PROFILE: `${API_BASE_URL}/api/users/profile`,
  UPDATE: `${API_BASE_URL}/api/users/update`,
};

// Endpoints de doações
export const DONATION_ENDPOINTS = {
  CREATE: `${API_BASE_URL}/api/donation`,
  LIST: `${API_BASE_URL}/api/donation`,
  MY: `${API_BASE_URL}/api/donation/my`,
  BY_ID: (id) => `${API_BASE_URL}/api/donation/${id}`,
};

// Endpoints de mídia
export const MEDIA_ENDPOINTS = {
  UPLOAD: `${API_BASE_URL}/api/media/upload`,
  LIST: `${API_BASE_URL}/api/media`,
  CATEGORIES: `${API_BASE_URL}/api/media/categories`,
  BY_ID: (id) => `${API_BASE_URL}/api/media/${id}`,
  UPDATE: (id) => `${API_BASE_URL}/api/media/${id}`,
  DELETE: (id) => `${API_BASE_URL}/api/media/${id}`,
};

export default API_BASE_URL;
