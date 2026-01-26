import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useTranslation } from "react-i18next";
import HeaderWithBack from "../components/HeaderWithBack";
import InstructionText from "../components/InstructionText";
import WasteTypeButton from "../components/WasteTypeButton";
import ErrorModal from "../components/ErrorModal";
import ActionButton from "../components/ActionButton";
import { styles } from "../styles/screens/PickUpScreen.styles";

const PickUpScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { ecoPontoId, ecoPontoName } = route.params || {};

  const wasteTypes = [
    { id: "plastic", label: t("Pickup.plastic"), icon: "water-outline" },
    { id: "paper", label: t("Pickup.paper"), icon: "document-text-outline" },
    { id: "glass", label: t("Pickup.glass"), icon: "wine-outline" },
    { id: "metal", label: t("Pickup.metal"), icon: "hardware-chip-outline" },
  ];

  const handleSelectWaste = (wasteId) => {
    if (selectedItems.includes(wasteId)) {
      setSelectedItems(selectedItems.filter((id) => id !== wasteId));
    } else {
      setSelectedItems([...selectedItems, wasteId]);
    }
  };

  const handleContinue = () => {
    if (selectedItems.length === 0) {
      setShowErrorModal(true);
      return;
    }

    // Avança direto para a tela de foto
    navigation.navigate("PickUpScreenFinalStep", {
      items: selectedItems,
      ecoPontoId,
      ecoPontoName,
    });
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InstructionText
          part1={t("Pickup.instructionPart1")}
          boldText={t("Pickup.instructionBold")}
          part2={t("Pickup.instructionPart2")}
        />

        <View style={styles.wasteTypesContainer}>
          {wasteTypes.map((waste) => (
            <WasteTypeButton
              key={waste.id}
              icon={waste.icon}
              label={waste.label}
              isSelected={selectedItems.includes(waste.id)}
              onPress={() => handleSelectWaste(waste.id)}
            />
          ))}
        </View>
      </ScrollView>

      <ErrorModal
        visible={showErrorModal}
        title={t("Pickup.emptyAlertTitle")}
        message={t("Pickup.emptyAlertMessage")}
        onConfirm={() => setShowErrorModal(false)}
      />

      <ActionButton
        onPress={handleContinue}
        text={t("Pickup.continueButton")}
        disabled={selectedItems.length === 0}
      />
    </View>
  );
};

export default PickUpScreen;
