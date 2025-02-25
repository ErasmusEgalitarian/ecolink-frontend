import React, {useState} from 'react';
import {ActivityIndicator, Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');

const RegistrationScreen = ({navigation}) => {
        const {t} = useTranslation();
        const [username, setUsername] = React.useState('');
        const [email, setEmail] = React.useState('');
        const [phoneNumber, setPhoneNumber] = React.useState('');
        const [address, setAddress] = React.useState('');
        const [password, setPassword] = React.useState('');
        const [loading, setLoading] = useState(false);

        // Fetch request to handle registration
        const handleRegister = async () => {
            setLoading(true);

            try {
                const response = await fetch('http://192.168.0.168:5000/api/auth/register',
                    {
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({username, email, password, phoneNumber, address}),
                    });
                const data = await response.json();

                if (response.ok) {
                    Alert.alert('Registration Successful', data.message || 'Something went wrong.')
                    navigation.navigate('Login');
                } else {
                    Alert.alert('Registration Failed', data.message || 'Something went wrong.');
                }

            } catch (error) {
                Alert.alert('Error', error.body,'Unable to complete registration. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        return (
            <View style={styles.container}>
                <View style={styles.txtImitation}>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Icon name="arrow-back" size={25} color="blue"/>
                        <Text style={{
                            color: 'blue',
                            textDecorationLine: 'underline',
                            fontSize: 19
                        }}>{t('Register.headerLink')}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.broadStyleInputs}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.txt}>{t('Register.inputHeaders')}</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setUsername}
                            value={username}
                            placeholder={t('Register.username')}
                            keyboardType="default"
                        />
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
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setPhoneNumber}
                            value={phoneNumber}
                            placeholder={t('Register.phoneNumber')}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            onChangeText={setAddress}
                            value={address}
                            placeholder={t('Register.address')}
                            keyboardType="default"
                        />
                    </View>
                </View>
                <View style={styles.buttonSpacing}/>

                {loading ? (
                    <ActivityIndicator size="large" color="#AFD34D"/>
                ) : (
                    <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                        <Text style={styles.buttonText}>{t('Register.buttonTXT')}</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    }
;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#AFD34D'
    },
    broadStyleInputs: {
        marginTop: height * 0.25
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        marginTop: height * 0.02,
    },
    input: {
        height: height * 0.06,
        borderWidth: 1,
        padding: width * 0.03,
        width: '100%',
        backgroundColor: 'white'
    },
    loginButton: {
        backgroundColor: 'white',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.2,
        borderRadius: 25,
        alignItems: 'center',
        width: '80%',
    },
    buttonText: {
        color: '#AFD34D',
        fontSize: width * 0.045,
        fontWeight: 'bold',
    },
    txtImitation: {
        top: height * 0.05,
        marginBottom: height * 0.01,
        alignSelf: 'flex-start',
        marginLeft: width * 0.06,
    },
    txt: {
        fontSize: width * 0.06,
        marginBottom: height * 0.01,
        alignSelf: 'flex-start',
        color: 'white'
    },
    buttonSpacing: {
        marginTop: height * 0.05,
    },
})
export default RegistrationScreen;
