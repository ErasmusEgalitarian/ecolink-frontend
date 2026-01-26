import React from "react";
import { Text, View, Image } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "../styles/components/OverviewPickupCards.styles";

const OverviewPickupCards = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        {/* needs user img if possible */}
        {/* Mockup image, remove later */}
        <Image
          style={styles.profileIcon}
          source={{ uri: "https://via.placeholder.com/60.png?text=User" }}
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

export default OverviewPickupCards;
