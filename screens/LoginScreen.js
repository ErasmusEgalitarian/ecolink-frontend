import React, {useState} from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import GoogleSVG from '../assets/socialButtons/google.svg';
import FacebookSVG from '../assets/socialButtons/facebook.svg';
import XSVG from '../assets/socialButtons/x.svg';
import LangChanger from '../components/LangChanger'

const {width, height} = Dimensions.get('window');

const LoginScreen = ({onLogin}) => {
    const navigation = useNavigation();
    const {t} = useTranslation();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    // Constants for activityindicator loading animation
    const [loading, setLoading] = useState(false);

    // Handle navigation to registration screen
    const handleNavigateToRegister = () => {
        navigation.navigate('Register'); // Navigate to the Registration screen
    };

    const showLoader = () => {
        return <ActivityIndicator size="large" color="#AFD34D"/>
    }
    // Mock login for now. Later has to be removed for the other handleLogin when backend is running
    const handleLogin = async () => {
        setLoading(true);

        try {                                  //192.168.0.168 replace to 10.0.2.2 if using android emulator or localhost if on web
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            console.log('Login Response Data:', data); // Log the response for debugging

            if (response.ok) {
                const userId = data.user?.id;
                const token = data.token;

                if (!userId || !token) {
                    throw new Error('Invalid response from server: Missing user ID or token');
                }

                await AsyncStorage.setItem('userId', userId);
                await AsyncStorage.setItem('authToken', token);

                // Notify parent or navigate
                onLogin(token);
                Alert.alert('Login Successful', 'Welcome back!');
            } else {
                // Handle non-200 response
                Alert.alert('Login Failed', data.message || 'Invalid credentials');
            }
        } catch (error) {
            console.error('Login Error:', error.message || error); // Log error for debugging
            Alert.alert('Login Error', 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.langSwitcher}>
                <LangChanger/>
            </View>
            <Image style={styles.LoginLogo} source={require('../assets/EcoLinkLogo.png')}/>

            <View style={styles.inputContainer}>
                <Text style={styles.txt}>{t('Login.start')}</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    placeholder={t('Login.email')}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setPassword}
                    value={password}
                    placeholder={t('Login.password')}
                    secureTextEntry
                />
            </View>

            <View style={styles.buttonSpacing}/>

            {/* Login button toggle with ActivityIndicator */}
            {loading ? (
                showLoader()
            ) : (
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.buttonText}>{t('Login.buttonLogin')}</Text>
                </TouchableOpacity>
            )}

            {/* Social buttons, doenst work yet... */}
            <Text style={styles.txtOptions}>{t('Login.loginOptions')}</Text>

            <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <GoogleSVG height={24} width={24}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <FacebookSVG height={24} width={24}/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <XSVG height={24} width={24}/>
                </TouchableOpacity>
            </View>

            {/* Link to direct user to registration screen*/}
            <Text style={{textAlign: 'center'}}>
                {t('Login.registerAcc', {interpolation: {escapeValue: false}}).split('<link>')[0]}
                <TouchableOpacity onPress={handleNavigateToRegister}>
                    <Text style={{color: 'blue', textDecorationLine: 'underline', transform: [{translateY: 4}]}}>
                        {t('Login.registerAcc', {interpolation: {escapeValue: false}}).split('<link>')[1].split('</link>')[0]}
                    </Text>
                </TouchableOpacity>
                {t('Login.registerAcc', {interpolation: {escapeValue: false}}).split('</link>')[1]}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: height * 0.05,
    },
    LoginLogo: {
        marginTop: height * 0.1,
        marginBottom: height * 0.05,
        width: width * 0.4,
        height: height * 0.2,
        borderRadius: 33,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginTop: height * 0.02,
    },
    txt: {
        fontSize: width * 0.04,
        marginBottom: height * 0.01,
        alignSelf: 'flex-start',
    },
    txtOptions: {
        fontSize: width * 0.04,
        marginBottom: height * 0.01,
        paddingTop: height * 0.02,
        textAlign: 'center',
    },
    input: {
        height: height * 0.06,
        borderWidth: 1,
        padding: width * 0.03,
        width: '100%',
    },
    buttonSpacing: {
        marginTop: height * 0.05,
    },
    loginButton: {
        backgroundColor: '#AFD34D',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.2,
        borderRadius: 25,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: height * 0.03,
        marginBottom: height * 0.05,
    },
    socialButton: {
        borderColor: '#AFD34D',
        borderWidth: 2,
        borderRadius: 10,
        paddingHorizontal: width * 0.04,
        paddingVertical: height * 0.01,
        alignItems: 'center',
        width: '20%',
    },
    langSwitcher: {
        left: width * 0.5
    }
});


export default LoginScreen;
