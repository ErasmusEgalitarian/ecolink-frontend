import AsyncStorage from "@react-native-async-storage/async-storage";
import { api, USER_ROUTES } from "../config/api";

export { clearAuthStorage, getStoredAuthToken, isTokenExpired } from "./authToken";

export const persistAuthSession = async (authData) => {
  const token = authData?.token;
  const userId = authData?.user?.id;

  if (!userId || !token) {
    throw new Error("Invalid response from server: Missing user ID or token");
  }

  await AsyncStorage.setItem("userId", userId);
  await AsyncStorage.setItem("authToken", token);

  if (authData.user?.username) {
    await AsyncStorage.setItem("userName", authData.user.username);
  }

  if (authData.user?.email) {
    await AsyncStorage.setItem("userEmail", authData.user.email);
  }

  try {
    const profileResponse = await api.get(USER_ROUTES.ME, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userRole = profileResponse.data?.data?.roleId?.name || "User";
    await AsyncStorage.setItem("userRole", userRole);
  } catch {
    const userRole = authData.user?.roleId?.name || authData.user?.role || "User";
    await AsyncStorage.setItem("userRole", userRole);
  }

  return token;
};
