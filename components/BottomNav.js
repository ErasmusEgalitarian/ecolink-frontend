import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/components/BottomNav.styles";

import LandingScreen from "../screens/LandingScreen";
import DashboardScreen from "../screens/DashboardScreen";

import PickUpScreen from "../screens/PickUpScreen";
import OverviewScreen from "../screens/OverviewScreen";
import PickUpScreenFinalStep from "../screens/PickUpScreenFinalStep";
import PickUpScreenMap from "../screens/PickUpScreenMap";
import ContentStackNavigator from "../navigation/ContentStackNav";
import QRScannerScreen from "../screens/QRScannerScreen";
import ProfileScreen from "../screens/ProfileScreen";
import DonationHistoryScreen from "../screens/DonationHistoryScreen";
import ProfileSemesterDonationsScreen from "../screens/ProfileSemesterDonationsScreen";
import ProfileMyDataScreen from "../screens/ProfileMyDataScreen";
import ProfileChangePasswordScreen from "../screens/ProfileChangePasswordScreen";
import ProfileDeleteAccountScreen from "../screens/ProfileDeleteAccountScreen";
import AvailableEcopointsScreen from "../screens/AvailableEcopointsScreen";
import EcopointDetailScreen from "../screens/EcopointDetailScreen";
import EcopointFaqScreen from "../screens/EcopointFaqScreen";
import DonationsFaqScreen from "../screens/DonationsFaqScreen";
import GeneralDonationsScreen from "../screens/GeneralDonationsScreen";
import RecentDonationsScreen from "../screens/RecentDonationsScreen";
import MyDonationsScreen from "../screens/MyDonationsScreen";
import PendingPickupsScreen from "../screens/PendingPickupsScreen";
import CollectorPickupsScreen from "../screens/CollectorPickupsScreen";
import CollectorPickupScreen from "../screens/CollectorPickupScreen";
import RequireRoleScreen from "./guards/RequireRoleScreen";
import { COLLECTOR_ROLES } from "../utils/collectorPermissions";
import { createDonationsTabPressListener } from "../utils/donationsNavigation";
import { createProfileTabPressListener } from "../utils/profileNavigation";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PendingPickupsGuardedScreen(props) {
  return (
    <RequireRoleScreen
      allowedRoles={[...COLLECTOR_ROLES]}
      navigation={props.navigation}
      redirectTo="DashboardScreen"
    >
      <PendingPickupsScreen {...props} />
    </RequireRoleScreen>
  );
}

function CollectorPickupsGuardedScreen(props) {
  return (
    <RequireRoleScreen
      allowedRoles={[...COLLECTOR_ROLES]}
      navigation={props.navigation}
      redirectTo="DashboardScreen"
    >
      <CollectorPickupsScreen {...props} />
    </RequireRoleScreen>
  );
}

function CollectorPickupGuardedScreen(props) {
  return (
    <RequireRoleScreen
      allowedRoles={[...COLLECTOR_ROLES]}
      navigation={props.navigation}
      redirectTo="DashboardScreen"
    >
      <CollectorPickupScreen {...props} />
    </RequireRoleScreen>
  );
}

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

// Stack Navigator para Doações (DashboardScreen é a raiz; OverviewScreen acessível via "Doações Gerais")
function DonationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardScreen"
        component={DashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="GeneralDonationsScreen"
        component={GeneralDonationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecentDonationsScreen"
        component={RecentDonationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MyDonationsScreen"
        component={MyDonationsScreen}
        options={{ headerShown: false }}
      />
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
      <Stack.Screen
        name="AvailableEcopointsScreen"
        component={AvailableEcopointsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EcopointDetailScreen"
        component={EcopointDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EcopointFaqScreen"
        component={EcopointFaqScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DonationsFaqScreen"
        component={DonationsFaqScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PendingPickupsScreen"
        component={PendingPickupsGuardedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CollectorPickupsScreen"
        component={CollectorPickupsGuardedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CollectorPickupScreen"
        component={CollectorPickupGuardedScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

// Stack Navigator para Mapa (a implementar)
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

// Stack Navigator para Conteúdo educativo
function ContentStack() {
  return <ContentStackNavigator />;
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
      <Stack.Screen
        name="DonationHistoryScreen"
        component={DonationHistoryScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileSemesterDonationsScreen"
        component={ProfileSemesterDonationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileMyDataScreen"
        component={ProfileMyDataScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DonationsFaqScreen"
        component={DonationsFaqScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileChangePasswordScreen"
        component={ProfileChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileDeleteAccountScreen"
        component={ProfileDeleteAccountScreen}
        options={{ headerShown: false }}
      />
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
          listeners={createDonationsTabPressListener}
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
          listeners={createProfileTabPressListener}
        >
          {() => <ProfileStack onLogout={onLogout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </View>
  );
}
