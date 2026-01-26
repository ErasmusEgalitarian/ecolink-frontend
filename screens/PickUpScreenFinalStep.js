import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import HeaderWithBack from "../components/HeaderWithBack";
import InstructionText from "../components/InstructionText";
import CameraSimulator from "../components/CameraSimulator";
import ImageGallery from "../components/ImageGallery";
import ActionButton from "../components/ActionButton";
import SuccessModal from "../components/SuccessModal";
import ErrorModal from "../components/ErrorModal";
import CancelModal from "../components/CancelModal";
import ConfirmationModal from "../components/ConfirmationModal";
import { useCameraSimulator, useAuth } from "../hooks/useDonationHelpers";
import { MEDIA_ENDPOINTS, DONATION_ENDPOINTS } from "../config/api";
import { styles } from "../styles/screens/PickUpScreenFinalStep.styles";

const MOCK_MEDIA_ID = "6976eb4ce17e92b4602d49fc";
const MOCK_IMAGE_URL = "https://via.placeholder.com/300x300.png?text=Foto+Mock";

const PickUpScreenFinalStep = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { items, ecoPontoId } = route.params || {};
  const [images, setImages] = useState([]);
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
  const { showCameraModal, cameraState, startCapture, closeCamera } =
    useCameraSimulator();
  const { getCredentials } = useAuth();

  const handleOpenCamera = () => {
    startCapture(() => setImages((prev) => [...prev, MOCK_IMAGE_URL]));
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    setShowCancelModal(true);
  };

  const handleCancelDonation = () => {
    setShowCancelModal(false);
    navigation.navigate("OverviewScreen");
  };

  const handleContinueDonation = () => {
    setShowCancelModal(false);
  };

  const isMockMode = (imageUri) =>
    imageUri?.startsWith("https://via.placeholder.com");

  const uploadImage = async (imageUri) => {
    if (isMockMode(imageUri)) return null;

    try {
      const { token } = await getCredentials();
      const formData = new FormData();

      formData.append("file", {
        uri: imageUri,
        name: "donation-photo.jpg",
        type: "image/jpeg",
      });
      formData.append("category", "Storage");

      const response = await fetch(MEDIA_ENDPOINTS.UPLOAD, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Upload failed");
      }

      const data = await response.json();
      return data._id;
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  };

  const createWasteEntry = async () => {
    try {
      if (images.length === 0) {
        setErrorMessage({
          title: t("PickupFinal.noPhotoTitle"),
          message: t("PickupFinal.noPhotoMessage"),
        });
        setShowErrorModal(true);
        return;
      }

      const { userId, token, success } = await getCredentials();

      if (!success) {
        setErrorMessage({
          title: t("PickupFinal.errorTitle"),
          message:
            "Não foi possível obter suas credenciais. Por favor, faça login novamente.",
        });
        setShowErrorModal(true);
        return;
      }

      const firstImage = images[0];
      const mediaId = isMockMode(firstImage)
        ? MOCK_MEDIA_ID
        : await uploadImage(firstImage);

      if (!mediaId && !isMockMode(firstImage)) {
        throw new Error("Falha ao fazer upload da imagem");
      }

      let successCount = 0;
      let failedItems = [];

      for (const itemId of items) {
        const payload = {
          userId,
          ecopointId: ecoPontoId,
          materialType: itemId,
          qtdMaterial: 1,
          mediaId,
        };

        try {
          const response = await fetch(DONATION_ENDPOINTS.CREATE, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            const errorData = await response.json();
            failedItems.push({ item: itemId, error: errorData.message });
          } else {
            successCount++;
          }
        } catch (error) {
          failedItems.push({ item: itemId, error: error.message });
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
          `Falha ao criar doações. Erros: ${failedItems.map((f) => `${f.item}: ${f.error}`).join(", ")}`,
        );
      }
    } catch (error) {
      setErrorMessage({
        title: t("PickupFinal.errorTitle"),
        message: error.message || "Ocorreu um erro ao criar a doação.",
      });
      setShowErrorModal(true);
    }
  };

  const handleSuccessConfirm = () => {
    setShowSuccessModal(false);
    // Após fechar modal de sucesso, mostra modal de "fazer outra doação"
    setShowAnotherDonationModal(true);
  };

  const handleMakeAnotherDonation = () => {
    // Usuário quer fazer outra doação
    setShowAnotherDonationModal(false);
    navigation.navigate("QRScannerScreen");
  };

  const handleGoToOverview = () => {
    // Usuário NÃO quer fazer outra doação
    setShowAnotherDonationModal(false);
    navigation.navigate("OverviewScreen");
  };

  const handleErrorConfirm = () => {
    setShowErrorModal(false);
  };

  return (
    <View style={styles.container}>
      <HeaderWithBack
        onBack={handleBack}
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

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={handleOpenCamera}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={48} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.helperText}>{t("PickupFinal.helperText")}</Text>

        <ImageGallery
          images={images}
          onRemove={removeImage}
          title={t("PickupFinal.photosTitle")}
        />
      </ScrollView>

      <CameraSimulator
        visible={showCameraModal}
        cameraState={cameraState}
        onClose={closeCamera}
        onCapture={() => {}}
        captureTitle={t("PickupFinal.cameraTitle")}
        loadingTitle={t("PickupFinal.loadingTitle")}
        successTitle={t("PickupFinal.captureSuccessTitle")}
      />

      <CancelModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title={t("PickupFinal.cancelTitle")}
        subtitle={t("PickupFinal.cancelSubtitle")}
        cancelText={t("PickupFinal.cancelNo")}
        confirmText={t("PickupFinal.cancelYes")}
        onCancel={handleContinueDonation}
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
        onCancel={handleGoToOverview}
        onConfirm={handleMakeAnotherDonation}
      />

      <ErrorModal
        visible={showErrorModal}
        title={errorMessage.title}
        message={errorMessage.message}
        onConfirm={handleErrorConfirm}
      />

      <ActionButton
        onPress={createWasteEntry}
        text={t("PickupFinal.finishButton")}
        disabled={images.length === 0}
      />
    </View>
  );
};

export default PickUpScreenFinalStep;
