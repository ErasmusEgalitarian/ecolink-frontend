import React, { useEffect, useState } from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import BottomNav from './components/BottomNav';
import LangChanger from './components/LangChanger';
import LoginScreen from './screens/LoginScreen';
import RegistrationScreen from './screens/RegistrationScreen';
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check whether the user has logged in with useEffect hook
    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('authToken');
            // !!token means turning the token value to a boolean to verify if its not null
            setIsLoggedIn(!!token);
        };
        checkAuth();
    }, []);

    // Assign the token from the backend
    const handleLogin = async (token) => {
        await AsyncStorage.setItem('authToken', token);
        setIsLoggedIn(true);
    };

    // To logout the user from app
    const handleLogout = async () => {
        await AsyncStorage.multiRemove([
            'authToken',
            'userId',
            'userName',
            'userEmail',
            'userRole',
        ]);
        setIsLoggedIn(false);
    };

    return (
        <SafeAreaProvider>
            <NavigationContainer theme={MyTheme}>
                {isLoggedIn ? (
                    <BottomNav onLogout={handleLogout} />
                ) : (
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
                )}
            </NavigationContainer>
            <LangChanger />
        </SafeAreaProvider>
    );
}
