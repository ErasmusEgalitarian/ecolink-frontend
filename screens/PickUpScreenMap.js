import React from "react";
import { TouchableOpacity, Text, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { styles } from "../styles/screens/PickUpScreenMap.styles";

const PickUpScreenMap = ({ navigation }) => {
  const { t } = useTranslation();

  const handleLocationSelected = (coords) => {
    // Send this coords to backend
    console.log("Selected Coordinates:", coords);
    // Navegar ou realizar a ação com as coordenadas selecionadas
    Alert.alert("Success", t("PickupFinal.created"), [
      { text: "OK", onPress: () => navigation.navigate("OverviewScreen") },
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

export default PickUpScreenMap;
