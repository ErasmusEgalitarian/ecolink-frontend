import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTH_STORAGE_KEYS = [
  "authToken",
  "userId",
  "userName",
  "userEmail",
  "userRole",
];

export const clearAuthStorage = async () => {
  await AsyncStorage.multiRemove(AUTH_STORAGE_KEYS);
};

const decodeBase64 = (value) => {
  if (typeof global.atob === "function") {
    return global.atob(value);
  }

  throw new Error("Base64 decoder is not available");
};

export const decodeJwtPayload = (token) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      decodeBase64(base64)
        .split("")
        .map((char) => `%${`00${char.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join(""),
    );

    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now();
};

export const getStoredAuthToken = async () => {
  const token = await AsyncStorage.getItem("authToken");

  if (!token || isTokenExpired(token)) {
    if (token) {
      await clearAuthStorage();
    }
    return null;
  }

  return token;
};
