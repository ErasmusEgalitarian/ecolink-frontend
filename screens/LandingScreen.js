import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapComponent from '../components/MapComponent';

const LandingScreen = () => {
    return (
        <View style={styles.container}>
            <MapComponent style={styles.mapComponent} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mapComponent: {
        flex: 1,
        marginVertical: 12,
        marginHorizontal: 32,
    },
});

export default LandingScreen;