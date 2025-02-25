import React from 'react';
import { StyleSheet, Text, View, Image } from "react-native";
import Icon from 'react-native-vector-icons/Ionicons';

const OverviewPickupCards = () => {
    return (
        <View style={styles.card}>
            <View style={styles.cardContent}>
                {/* needs user img if possible */}
                {/* Mockup image, remove later */}
                <Image
                    style={styles.profileIcon}
                    source={{ uri: 'https://via.placeholder.com/60.png?text=User' }}
                    />

                {/* <Image style={styles.profileIcon} source={result.user}></Image> */}
                <View style={styles.cardTXTContainer}>
                    <Text style={styles.cardTXT}>Pick Up</Text>
                    <View style={styles.cardNumberContainer}>
                        <Icon name="logo-whatsapp" size={24} color="#9d9c9c" />
                        <Text style={styles.cardNumber}>+2991381989029</Text>
                    </View>
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
    profileIcon: {
        width: 60,
        height: 60,
        marginRight: 12,
        backgroundColor: 'rgba(162,162,162,0.84)',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardTXTContainer: {
        flexDirection: 'column',
    },
    cardTXT: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    cardNumberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    cardNumber: {
        fontSize: 16,
        fontWeight: 'medium',
        color: '#999999',
    },
});

export default OverviewPickupCards;