import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearAuthStorage, isTokenExpired } from "../utils/authToken";

// Configuração da API
const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:5000";

export const API_TIMEOUT_MS = 15000;
export const API_UPLOAD_TIMEOUT_MS = 60000;

export const API_ERROR_TYPES = {
  TIMEOUT: "timeout",
  NETWORK: "network",
  HTTP: "http",
  AUTH: "auth",
  UNKNOWN: "unknown",
};

let onAuthExpired = null;
let isHandlingAuthFailure = false;

export const setOnAuthExpired = (handler) => {
  onAuthExpired = handler;
};

const handleAuthFailure = async () => {
  if (isHandlingAuthFailure) {
    return;
  }

  isHandlingAuthFailure = true;

  try {
    await clearAuthStorage();
    onAuthExpired?.();
  } finally {
    isHandlingAuthFailure = false;
  }
};

// ==================== AXIOS INSTANCE ====================
// Instância do axios com interceptor automático de token
export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: API_TIMEOUT_MS,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        if (isTokenExpired(token)) {
          await handleAuthFailure();
          return Promise.reject(
            new Error("Session expired. Please log in again."),
          );
        }

        config.headers = config.headers || {};
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

const getServerMessage = (data) => {
  if (!data) return null;
  if (typeof data === "string") return data;
  return data.message || data.error || null;
};

const isAuthFailureResponse = (error) => {
  const status = error?.response?.status;
  const message = (getServerMessage(error?.response?.data) || "").toLowerCase();

  if (status === 401) {
    return true;
  }

  return status === 400 && message.includes("invalid token");
};

export const normalizeApiError = (error) => {
  if (error?.isApiError) {
    return error;
  }

  const status = error?.response?.status;
  const data = error?.response?.data;
  const message = error?.message || "";
  const isTimeout =
    error?.code === "ECONNABORTED" ||
    status === 408 ||
    status === 504 ||
    message.toLowerCase().includes("timeout");
  const isNetwork = !error?.response;
  const isAuth = isAuthFailureResponse(error);

  let type = API_ERROR_TYPES.UNKNOWN;
  if (isTimeout) {
    type = API_ERROR_TYPES.TIMEOUT;
  } else if (isNetwork) {
    type = API_ERROR_TYPES.NETWORK;
  } else if (isAuth) {
    type = API_ERROR_TYPES.AUTH;
  } else if (status) {
    type = API_ERROR_TYPES.HTTP;
  }

  const apiError = new Error(
    getServerMessage(data) ||
      (isAuth
        ? "Sessão expirada. Faça login novamente."
        : isTimeout
          ? "Tempo limite excedido ao conectar com o servidor."
          : "Erro ao comunicar com o servidor."),
  );

  apiError.name = "ApiError";
  apiError.isApiError = true;
  apiError.type = type;
  apiError.status = status;
  apiError.data = data;
  apiError.originalError = error;

  return apiError;
};

export const isApiConnectionError = (error) =>
  error?.type === API_ERROR_TYPES.TIMEOUT ||
  error?.type === API_ERROR_TYPES.NETWORK;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isAuthFailureResponse(error)) {
      await handleAuthFailure();
    }

    return Promise.reject(normalizeApiError(error));
  },
);

// ==================== ENDPOINTS ====================
export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  LOGOUT: "/auth/logout",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION_CODE: "/auth/resend-verification-code",
};

export const USER_ROUTES = {
  LIST: "/users",
  ME: "/users/me",
  PROFILE: "/users/profile",
  UPDATE: "/users/update",
};

export const ROLE_ROUTES = {
  LIST: "/roles",
  EDIT: (userId) => `/roles/edit/${userId}`,
};

export const DONATION_ROUTES = {
  CREATE: "/donation",
  LIST: "/donation",
  MY: "/donation/my",
  BY_ID: (id) => `/donation/${id}`,
};

export const SEMESTER_ROUTES = {
  LIST: "/semesters",
  CURRENT: "/semesters/current",
  CURRENT_PROGRESS: "/semesters/current/progress",
  PROGRESS: "/semesters/progress",
  BY_ID_PROGRESS: (id) => `/semesters/${id}/progress`,
};

export const MEDIA_ROUTES = {
  UPLOAD: "/media/upload",
  LIST: "/media",
  CATEGORIES: "/media/categories",
  BY_ID: (id) => `/media/${id}`,
  UPDATE: (id) => `/media/${id}`,
  DELETE: (id) => `/media/${id}`,
};

export default API_BASE_URL;
