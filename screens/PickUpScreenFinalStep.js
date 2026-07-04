import React, { useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import HeaderWithBack from "../components/HeaderWithBack";
import InstructionText from "../components/InstructionText";
import ActionButton from "../components/ActionButton";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import CancelModal from "../components/CancelModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useAuth } from "../hooks/useDonationHelpers";
import { api, DONATION_ROUTES, isApiConnectionError } from "../config/api";
import { DONATIONS_STACK_ROOT } from "../utils/donationsNavigation";
import { getDonationMaterialLabelKey } from "../utils/donationDisplay";
import { styles } from "../styles/screens/PickUpScreenFinalStep.styles";

const randomDonationWeightGrams = () => Math.floor(Math.random() * 10) + 1;

const PickUpScreenFinalStep = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { items = [], ecoPontoId, ecoPontoName } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showAnotherDonationModal, setShowAnotherDonationModal] =
    useState(false);
  const [successMessage, setSuccessMessage] = useState({
    title: "",
    message: "",
  });
  const [errorMessage, setErrorMessage] = useState({ title: "", message: "" });
  const { getCredentials } = useAuth();

  const selectedMaterials = useMemo(
    () =>
      items.map((itemId) => ({
        id: itemId,
        label: t(getDonationMaterialLabelKey(itemId)),
      })),
    [items, t],
  );

  const returnToDonationsHome = () => {
    const state = navigation.getState();
    const hasDashboard = state.routes.some(
      (route) => route.name === DONATIONS_STACK_ROOT,
    );

    if (hasDashboard) {
      navigation.popToTop();
      return;
    }

    navigation.replace(DONATIONS_STACK_ROOT);
  };

  const handleCancelDonation = () => {
    setShowCancelModal(false);
    returnToDonationsHome();
  };

  const createWasteEntry = async () => {
    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { userId, success } = await getCredentials();

      if (!success) {
        setErrorMessage({
          title: t("PickupFinal.errorTitle"),
          message:
            "Não foi possível obter suas credenciais. Por favor, faça login novamente.",
        });
        setShowErrorModal(true);
        return;
      }

      let successCount = 0;
      let failedItems = [];
      let hasConnectionFailure = false;

      for (const itemId of items) {
        const payload = {
          userId,
          ecopointId: ecoPontoId,
          materialType: itemId,
          qtdMaterial: randomDonationWeightGrams(),
        };

        try {
          await api.post(DONATION_ROUTES.CREATE, payload);
          successCount++;
        } catch (error) {
          if (isApiConnectionError(error)) {
            hasConnectionFailure = true;
          }

          failedItems.push({
            item: itemId,
            error: error.data?.message || error.message,
          });
        }
      }

      if (successCount > 0) {
        setSuccessMessage({
          title: t("PickupFinal.successTitle"),
          message: t("PickupFinal.successMessage"),
        });
        setShowSuccessModal(true);
      } else {
        throw new Error(
          hasConnectionFailure
            ? t("Api.connectionMessage")
            : `Falha ao criar doações. Erros: ${failedItems.map((f) => `${f.item}: ${f.error}`).join(", ")}`,
        );
      }
    } catch (error) {
      setErrorMessage({
        title: t("PickupFinal.errorTitle"),
        message: isApiConnectionError(error)
          ? t("Api.connectionMessage")
          : error.message || "Ocorreu um erro ao criar a doação.",
      });
      setShowErrorModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    setShowAnotherDonationModal(true);
  };

  const handleMakeAnotherDonation = () => {
    setShowAnotherDonationModal(false);
    navigation.navigate("QRScannerScreen");
  };

  const handleGoToDonationsHome = () => {
    setShowAnotherDonationModal(false);
    returnToDonationsHome();
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack
        onBack={() => setShowCancelModal(true)}
        rightIcon="checkmark-circle"
        rightIconColor="#52B788"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <InstructionText
          part1={t("PickupFinal.instructionPart1")}
          boldText={t("PickupFinal.instructionBold")}
          part2={t("PickupFinal.instructionPart2")}
        />

        {ecoPontoName ? (
          <Text style={styles.ecopointLabel}>
            {t("Pickup.ecopointLabel", { name: ecoPontoName })}
          </Text>
        ) : null}

        <View style={styles.materialsSummary}>
          {selectedMaterials.map((material) => (
            <View key={material.id} style={styles.materialChip}>
              <Text style={styles.materialChipText}>{material.label}</Text>
            </View>
          ))}
        </View>

        {isSubmitting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#52B788" />
            <Text style={styles.loadingText}>
              {t("PickupFinal.submitting")}
            </Text>
          </View>
        ) : null}
      </ScrollView>

      <CancelModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title={t("PickupFinal.cancelTitle")}
        subtitle={t("PickupFinal.cancelSubtitle")}
        cancelText={t("PickupFinal.cancelNo")}
        confirmText={t("PickupFinal.cancelYes")}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleCancelDonation}
      />

      <SuccessModal
        visible={showSuccessModal}
        title={successMessage.title}
        message={successMessage.message}
        onConfirm={handleSuccessConfirm}
        buttonText={t("PickupFinal.successButton")}
      />

      <ConfirmationModal
        visible={showAnotherDonationModal}
        onClose={() => setShowAnotherDonationModal(false)}
        title={t("PickupFinal.anotherDonationTitle")}
        message={t("PickupFinal.anotherDonationQuestion")}
        cancelText={t("PickupFinal.anotherDonationNo")}
        confirmText={t("PickupFinal.anotherDonationYes")}
        onCancel={handleGoToDonationsHome}
        onConfirm={handleMakeAnotherDonation}
      />

      <ErrorModal
        visible={showErrorModal}
        title={errorMessage.title}
        message={errorMessage.message}
        onConfirm={() => setShowErrorModal(false)}
      />

      <ActionButton
        onPress={createWasteEntry}
        text={t("PickupFinal.finishButton")}
        disabled={isSubmitting || items.length === 0}
      />
    </View>
  );
};

export default PickUpScreenFinalStep;
