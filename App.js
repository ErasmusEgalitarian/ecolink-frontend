import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import {
    useFonts,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppShell from './components/AppShell';
import BottomNav from './components/BottomNav';
import LangChanger from './components/LangChanger';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
import { setOnAuthExpired } from './config/api';
import { clearAuthStorage, getStoredAuthToken } from './utils/authToken';
import './i18n';

const Stack = createNativeStackNavigator();

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F3F3F3', 
    },
};

export default function App() {
    const [fontsLoaded] = useFonts({
        Montserrat_400Regular,
        Montserrat_500Medium,
        Montserrat_600SemiBold,
        Montserrat_700Bold,
    });
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setOnAuthExpired(() => {
            setIsLoggedIn(false);
        });

        const checkAuth = async () => {
            const token = await getStoredAuthToken();
            setIsLoggedIn(!!token);
            setIsAuthReady(true);
        };

        checkAuth();
    }, []);

    const handleLogin = async (token) => {
        await AsyncStorage.setItem('authToken', token);
        setIsLoggedIn(true);
    };

    const handleLogout = async () => {
        await clearAuthStorage();
        setIsLoggedIn(false);
    };

    if (!isAuthReady || !fontsLoaded) {
        return (
            <SafeAreaProvider>
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#F3F3F3',
                    }}
                >
                    <ActivityIndicator size="large" color="#52B788" />
                </View>
            </SafeAreaProvider>
        );
    }

    if (isLoggedIn) {
        return (
            <SafeAreaProvider>
                <AppShell>
                    <NavigationContainer theme={MyTheme}>
                        <BottomNav onLogout={handleLogout} />
                    </NavigationContainer>
                </AppShell>
            </SafeAreaProvider>
        );
    }

    // ── Auth screens: unchanged, full-width, as they were before ──────────────
    return (
        <SafeAreaProvider>
            <NavigationContainer theme={MyTheme}>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Login"
                        options={{ headerShown: false }}
                    >
                        {() => <LoginScreen onLogin={handleLogin} />}
                    </Stack.Screen>
                    <Stack.Screen
                        name="Register"
                        options={{ headerShown: false }}
                    >
                        {(props) => (
                            <RegistrationScreen
                                {...props}
                                onLogin={handleLogin}
                            />
                        )}
                    </Stack.Screen>
                </Stack.Navigator>
            </NavigationContainer>
            <LangChanger />
        </SafeAreaProvider>
    );
}
