import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import LandingScreen from '../screens/LandingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AdminRoleScreen from '../screens/AdminRoleScreen';
import PickUpScreen from '../screens/PickUpScreen';
import OverviewScreen from '../screens/OverviewScreen';
import PickUpScreenFinalStep from "../screens/PickUpScreenFinalStep";
import PickUpScreenMap from "../screens/PickUpScreenMap";
import MediaUploadScreen from "../screens/MediaUploadScreen";
import MediaListScreen from "../screens/MediaListScreen";
import MediaStackNavigator from "../navigation/MediaStackNav"


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="LandingPage" 
                component={LandingScreen} 
                options={{ headerShown: false }} 
            />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Admin" component={AdminRoleScreen} />
            <Stack.Screen name="Pickup" component={PickUpScreen} options={{ headerShown: false}}/>
            <Stack.Screen name="Overview" component={OverviewScreen} />
        </Stack.Navigator>
    );
}
// Navigation setup for creating a donation.
function PickupNavigator() {
    return (
        <Stack.Navigator>
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
                name="OverviewScreen"
                component={OverviewScreen}
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

// Custom Logout button
const LogoutButton = ({ onLogout }) => (
    <TouchableOpacity style={styles.logoutButton} onPress={onLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={24} color="white" />
    </TouchableOpacity>
);

export default function BottomNav({ onLogout }) {  // Accept onLogout as a prop
    const { t } = useTranslation();

    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    headerStyle: {
                        backgroundColor: '#F3F3F3',
                        height: 84,
                    },
                    headerTitleStyle: {
                        color: '#333333',
                        fontSize: 24,
                        fontWeight: 'bold',
                        marginLeft: 24,
                    },
                    headerRight: () => (
                        <LogoutButton onLogout={onLogout} />
                    ),
                    headerTintColor: '#fff',
                    headerTitleAlign: 'start',
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color, size }) => {
                        let iconName;

                        switch (route.name) {
                            case t('Navigation.home'):
                                iconName = 'home';
                                break;
                            case t('Navigation.admin'):
                                iconName = 'cog-outline';
                                break;
                            case t('Navigation.dashboard'):
                                iconName = 'grid';
                                break;
                            case t('Navigation.pickup'):
                                iconName = 'car';
                                break;
                            case t('Navigation.overview'):
                                iconName = 'list';
                                break;
                            case t('Navigation.scheduledP'):
                                iconName = 'calendar';
                                break;
                            case t('Navigation.mediaList'):
                                iconName = 'cloud-upload';
                                break;
                            default:
                                iconName = 'ellipse';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    tabBarActiveTintColor: '#14213D',
                    tabBarInactiveTintColor: 'gray',
                    tabBarStyle: styles.tabBar,
                })}
            >
                <Tab.Screen name={t('Navigation.home')} component={HomeStack} />
                <Tab.Screen name={t('Navigation.dashboard')} component={DashboardScreen} />
                <Tab.Screen name={t('Navigation.admin')} component={AdminRoleScreen} />
                <Tab.Screen name={t('Navigation.pickup')} component={PickupNavigator} />
                <Tab.Screen name={t('Navigation.overview')} component={OverviewScreen} />
                <Tab.Screen name={t('Navigation.mediaList')} component={MediaStackNavigator} />
                {/* <Tab.Screen name={t('Navigation.scheduledP')} component={ScheduledPickUpScreen} /> */}
            </Tab.Navigator>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F3F3',
    },
    tabBar: {
        backgroundColor: '#ffffff',
        height: 72,
        paddingBottom: 5,
        paddingTop: 5,
        marginBottom: 24,
        marginHorizontal: 32,
        borderRadius: 100,
        elevation: 1,
    },
    logoutButton: {
        width: 36,
        height: 36,
        borderRadius: 100,
        backgroundColor: '#FF2E17',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 32,
    },
});