import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/components/BottomNav.styles";

import LandingScreen from "../screens/LandingScreen";
import DashboardScreen from "../screens/DashboardScreen";
import AdminRoleScreen from "../screens/AdminRoleScreen";
import PickUpScreen from "../screens/PickUpScreen";
import OverviewScreen from "../screens/OverviewScreen";
import PickUpScreenFinalStep from "../screens/PickUpScreenFinalStep";
import PickUpScreenMap from "../screens/PickUpScreenMap";
import MediaUploadScreen from "../screens/MediaUploadScreen";
import MediaListScreen from "../screens/MediaListScreen";
import MediaStackNavigator from "../navigation/MediaStackNav";
import QRScannerScreen from "../screens/QRScannerScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Placeholder screens for new tabs (você pode substituir depois)
function MapScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Mapa Screen</Text>
    </View>
  );
}

function ContentScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Conteúdo Screen</Text>
    </View>
  );
}

// Stack Navigator para Doações (OverviewScreen + fluxo de criação)
function DonationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OverviewScreen"
        component={OverviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QRScannerScreen"
        component={QRScannerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PickUpScreen"
        component={PickUpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PickUpScreenFinalStep"
        component={PickUpScreenFinalStep}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PickUpScreenMap"
        component={PickUpScreenMap}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Mapa (pode adicionar telas relacionadas)
function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Conteúdo/Mídia
function ContentStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ContentScreen"
        component={MediaStackNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Perfil
function ProfileStack({ onLogout }) {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileScreen"
        options={{ headerShown: false }}
      >
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function BottomNav({ onLogout }) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIcon: ({ focused }) => {
            let iconName;
            let iconColor = focused ? "#2D6A4F" : "#95A5A6";

            switch (route.name) {
              case "Doações":
                iconName = "hand-left-outline";
                break;
              case "Mapa":
                iconName = "location-outline";
                break;
              case "Conteúdo":
                iconName = "menu-outline";
                break;
              case "Perfil":
                iconName = "person-outline";
                break;
              default:
                iconName = "ellipse-outline";
            }

            return <Ionicons name={iconName} size={28} color={iconColor} />;
          },
          tabBarActiveTintColor: "#2D6A4F",
          tabBarInactiveTintColor: "#95A5A6",
          tabBarStyle: styles.tabBar,
        })}
      >
        <Tab.Screen
          name="Doações"
          component={DonationsStack}
          options={{
            tabBarLabel: t("BottomNav.donations"),
          }}
        />
        <Tab.Screen
          name="Mapa"
          component={MapStack}
          options={{
            tabBarLabel: t("BottomNav.map"),
          }}
        />
        <Tab.Screen
          name="Conteúdo"
          component={ContentStack}
          options={{
            tabBarLabel: t("BottomNav.content"),
          }}
        />
        <Tab.Screen
          name="Perfil"
          options={{
            tabBarLabel: t("BottomNav.profile"),
          }}
        >
          {() => <ProfileStack onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}
