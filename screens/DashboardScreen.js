import React from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StudentDashboardScreen from "./StudentDashboardScreen";
import CollectorDashboardScreen from "./CollectorDashboardScreen";
import { useUserRole } from "../hooks/useUserRole";

const DashboardScreen = ({ navigation }) => {
  const { isCollector, loading } = useUserRole();

  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F6FFFB",
        }}
        edges={["top"]}
      >
        <ActivityIndicator size="large" color="#29A66C" />
      </SafeAreaView>
    );
  }

  if (isCollector) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#F6FFFB" }} edges={["top"]}>
        <CollectorDashboardScreen navigation={navigation} />
      </SafeAreaView>
    );
  }

  return <StudentDashboardScreen navigation={navigation} />;
};

export default DashboardScreen;
