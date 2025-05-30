import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

const PickUpScreenMap = ({ navigation }) => {
    const { t } = useTranslation();

    const handleLocationSelected = (coords) => {
        // Send this coords to backend
        console.log('Selected Coordinates:', coords);
        // Navegar ou realizar a ação com as coordenadas selecionadas
        Alert.alert('Success', t('PickupFinal.created'), [
            { text: 'OK', onPress: () => navigation.navigate('OverviewScreen') },
        ]);
    };

    return (
        <View style={styles.container}>
            {/* Mapa com busca e pin */}
            {/* <MapComponent
                style={styles.mapComponent}
                showSearchAndPin={true}
                onLocationSelected={handleLocationSelected}
            /> */}

            {/* Botão de Finalizar */}
            {/* <TouchableOpacity style={styles.finishButton} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>{t('PickupFinal.buttonTXT')}</Text>
            </TouchableOpacity> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
        marginVertical: 12,
        marginHorizontal: 32,
        borderRadius: 12,
        overflow: 'hidden',
    },
    mapComponent: {
        flex: 1,
        borderRadius: 12,
    },
    finishButton: {
        position: 'absolute',
        backgroundColor: '#AFD34D',
        borderRadius: 25,
        justifyContent: 'center',
        alignSelf: 'center',
        width: '100%',
        height: 48,
        bottom: 12,
    },
    buttonText: {
        alignSelf: "center",
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
});

export default PickUpScreenMap;