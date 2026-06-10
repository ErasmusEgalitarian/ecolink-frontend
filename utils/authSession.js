import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_ENDPOINTS } from "../config/api";

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
    const profileResponse = await fetch(USER_ENDPOINTS.ME, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (profileResponse.ok) {
      const profileData = await profileResponse.json();
      const userRole = profileData.data?.roleId?.name || "User";
      await AsyncStorage.setItem("userRole", userRole);
    } else {
      const userRole = authData.user?.roleId?.name || authData.user?.role || "User";
      await AsyncStorage.setItem("userRole", userRole);
    }
  } catch {
    const userRole = authData.user?.roleId?.name || authData.user?.role || "User";
    await AsyncStorage.setItem("userRole", userRole);
  }

  return token;
};
