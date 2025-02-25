import React from 'react';
import { Image, StyleSheet, Text, View } from "react-native";

const mockUpmaterials = [
    'glass',
    'plastic',
    'metal',
    'paper',
];

const MaterialCircles = ({ materials }) => {
    // Map material types to their corresponding colors
    const materialColors = {
        glass: '#6ABF4B',
        plastic: '#FFDD00',
        metal: '#0052CC',
        paper: '#FF5733',
        default: '#CCCCCC',
    };

    return (
        <View style={styles.materialsContainer}>
            {materials.map((material, index) => (
                <View
                    key={index}
                    style={[
                        styles.materialsCircle,
                        { backgroundColor: materialColors[material] || materialColors.default }
                    ]}
                />
            ))}
        </View>
    );
};

const OverviewDonationCards = () => {

    const materialIcons = {
        metal: require('../assets/materialIcons/recycleMetal.png'),
        plastic: require('../assets/materialIcons/recyclePlastic.png'),
        paper: require('../assets/materialIcons/recyclePaper.png'),
        glass: require('../assets/materialIcons/recycleGlass.png'),
    };

    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                <Image style={styles.materialIcon} source={materialIcons.metal}></Image>
                <View style={styles.cardTXTContainer}>
                    <Text style={styles.cardTXT}>Donation</Text>
                    <Text style={[styles.cardSTXT]}>Location</Text>

                    {/* Render the MaterialCircles component */}
                    <MaterialCircles materials={mockUpmaterials} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        marginBottom: 12,
        width: '100%',
        height: 84,
        borderRadius: 6,
        elevation: 3,
        alignSelf: "center",
        justifyContent: "center",
        padding: 12,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    materialIcon: {
        width: 60,
        height: 60,
        marginRight: 12,
    },
    cardTXT: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333'
    },
    cardSTXT: {
        fontSize: 16,
        fontWeight: 'medium',
        color: '#999999',
        marginBottom: 5
    },
    cardTXTContainer: {
        flexDirection: 'column'
    },
    materialsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    materialsCircle: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 12,
    },
});

export default OverviewDonationCards;