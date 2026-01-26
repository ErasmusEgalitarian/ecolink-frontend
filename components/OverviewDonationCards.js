import React from "react";
import { Image, Text, View } from "react-native";
import { styles } from "../styles/components/OverviewDonationCards.styles";

const MaterialCircles = ({ materials }) => {
  // Map material types to their corresponding colors
  const materialColors = {
    glass: "#6ABF4B",
    plastic: "#FFDD00",
    metal: "#0052CC",
    paper: "#FF5733",
    default: "#CCCCCC",
  };

  return (
    <View style={styles.materialsContainer}>
      {materials.map((material, index) => (
        <View
          key={index}
          style={[
            styles.materialsCircle,
            {
              backgroundColor:
                materialColors[material] || materialColors.default,
            },
          ]}
        />
      ))}
    </View>
  );
};

const DonationCard = ({ donation, showUserInfo = false }) => {
  const materialIcons = {
    metal: require("../assets/materialIcons/recycleMetal.png"),
    plastic: require("../assets/materialIcons/recyclePlastic.png"),
    paper: require("../assets/materialIcons/recyclePaper.png"),
    glass: require("../assets/materialIcons/recycleGlass.png"),
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Extrair username se disponível (para admin view)
  const username =
    donation.userId?.username || donation.userId?.email || "Usuário";

  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          style={styles.materialIcon}
          source={materialIcons[donation.materialType] || materialIcons.plastic}
        />
        <View style={styles.cardTXTContainer}>
          {showUserInfo && <Text style={styles.cardUserTXT}>{username}</Text>}
          <Text style={styles.cardTXT}>
            {donation.qtdMaterial} {donation.materialType}
          </Text>
          <Text style={styles.cardSTXT}>{donation.ecopointId}</Text>
          <Text style={styles.cardDateTXT}>
            {formatDate(donation.donationDate)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const OverviewDonationCards = ({ data = [], showUserInfo = false }) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((donation) => (
        <DonationCard
          key={donation._id}
          donation={donation}
          showUserInfo={showUserInfo}
        />
      ))}
    </>
  );
};

export default OverviewDonationCards;
