import React, { useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import CreatePickupCards from '../components/CreatePickupCards';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const PickUpScreen = ({ navigation }) => {
    const { t } = useTranslation();
    const [pickupItems, setPickupItems] = useState([]);
    const [resetTrigger, setResetTrigger] = useState(false);

    // Clears the prompts for the final screen
    useFocusEffect(
        React.useCallback(() => {
            setResetTrigger(true);
        }, [])
    );

    // Proceed to the next step of the donation registration
    const handleNextStep = () => {
        if (pickupItems.length > 0) {
            navigation.navigate('PickUpScreenFinalStep', { items: pickupItems });
        } else {
            Alert.alert(t('Pickup.emptyAlertTitle'), t('Pickup.emptyAlertMessage'));
        }
    };

    return (
        <View style={styles.parent}>
            <View style={styles.container}>
                {/* Content Section */}
                <CreatePickupCards onItemsChange={setPickupItems} />

                {/* Next Button */}
                <TouchableOpacity
                    style={styles.continueButton}
                    onPress={handleNextStep}
                >
                    <Text style={styles.buttonTXT}>{t('Pickup.buttonTXT')}</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    parent: {
        height: '100%',
        width: '100%',
    },
    container: {
        flex: 1,
        marginVertical: 12,
        marginHorizontal: 32,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        padding: 12,
        elevation: 1,
    },
    continueButton: {
        position: 'absolute',
        justifyContent: 'center',
        backgroundColor: '#AFD34D',
        height: 48,
        borderRadius: 25,
        alignSelf: 'center',
        width: '100%',
        bottom: 12
    },
    buttonTXT: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        alignSelf: 'center',
    },
});

export default PickUpScreen;