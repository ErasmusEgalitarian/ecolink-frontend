import { useCallback, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { api, USER_ROUTES } from "../config/api";
import { canManageContent } from "../utils/contentPermissions";
import { canCollectPickups } from "../utils/collectorPermissions";

const ADMIN_ROLE = "Admin";

export const useUserRole = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadRole = useCallback(async () => {
    setLoading(true);

    try {
      try {
        const response = await api.get(USER_ROUTES.ME);
        const apiRole = response.data?.data?.roleId?.name;

        if (apiRole) {
          await AsyncStorage.setItem("userRole", apiRole);
          setRole(apiRole);
          return;
        }
      } catch (error) {
        console.error("[useUserRole] Error loading role from API:", error);
      }

      const cachedRole = await AsyncStorage.getItem("userRole");
      setRole(cachedRole || "User");
    } catch (error) {
      console.error("[useUserRole] Error loading cached role:", error);
      setRole("User");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadRole();
    }, [loadRole]),
  );

  return {
    role,
    loading,
    isEditor: canManageContent(role),
    isCollector: canCollectPickups(role),
    isAdmin: role === ADMIN_ROLE,
    refreshRole: loadRole,
  };
};
