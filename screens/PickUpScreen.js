import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import { useTranslation } from "react-i18next";
import HeaderWithBack from "../components/HeaderWithBack";
import InstructionText from "../components/InstructionText";
import WasteTypeButton from "../components/WasteTypeButton";
import ErrorModal from "../components/ErrorModal";
import ActionButton from "../components/ActionButton";
import { getPickupWasteTypes } from "../utils/pickupMaterials";
import { styles } from "../styles/screens/PickUpScreen.styles";

const PickUpScreen = ({ navigation, route }) => {
  const { t } = useTranslation();
  const [selectedItems, setSelectedItems] = useState([]);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showNoMaterialsModal, setShowNoMaterialsModal] = useState(false);
  const {
    ecoPontoId,
    ecoPontoName,
    locationName,
    acceptedMaterials = [],
  } = route.params || {};

  const wasteTypes = useMemo(
    () => getPickupWasteTypes(acceptedMaterials, t),
    [acceptedMaterials, t],
  );

  const ecopointDisplayName = [ecoPontoName, locationName]
    .filter(Boolean)
    .join(" · ");

  useEffect(() => {
    if (!ecoPontoId) {
      navigation.replace("QRScannerScreen");
      return;
    }

    if (wasteTypes.length === 0) {
      setShowNoMaterialsModal(true);
    }
  }, [ecoPontoId, navigation, wasteTypes.length]);

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

    navigation.navigate("PickUpScreenFinalStep", {
      items: selectedItems,
      ecoPontoId,
      ecoPontoName,
    });
  };

  const handleNoMaterialsConfirm = () => {
    setShowNoMaterialsModal(false);
    navigation.navigate("QRScannerScreen");
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {ecopointDisplayName ? (
          <Text style={styles.ecopointLabel}>
            {t("Pickup.ecopointLabel", { name: ecopointDisplayName })}
          </Text>
        ) : null}

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

      <ErrorModal
        visible={showNoMaterialsModal}
        title={t("Pickup.noMaterialsTitle")}
        message={t("Pickup.noMaterialsMessage")}
        onConfirm={handleNoMaterialsConfirm}
      />

      <ActionButton
        onPress={handleContinue}
        text={t("Pickup.continueButton")}
        disabled={selectedItems.length === 0 || wasteTypes.length === 0}
      />
    </View>
  );
};

export default PickUpScreen;
