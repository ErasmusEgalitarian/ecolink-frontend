import React, { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import { useUserRole } from "../../hooks/useUserRole";

const RequireRoleScreen = ({
  allowedRoles,
  navigation,
  redirectTo,
  children,
}) => {
  const { role, loading } = useUserRole();
  const isAllowed = Boolean(role && allowedRoles.includes(role));

  useEffect(() => {
    if (!loading && !isAllowed) {
      navigation.replace(redirectTo);
    }
  }, [isAllowed, loading, navigation, redirectTo]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F3F3F3",
        }}
      >
        <ActivityIndicator size="large" color="#29A66C" />
      </View>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return children;
};

export default RequireRoleScreen;
