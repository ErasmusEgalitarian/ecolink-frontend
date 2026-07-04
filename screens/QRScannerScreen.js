import React, { useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { CameraView, useCameraPermissions } from "expo-camera";
import ErrorModal from "../components/ErrorModal";
import { api, ECOPOINT_ROUTES } from "../config/api";
import { styles } from "../styles/screens/QRScannerScreen.styles";

const NAVIGATION_DELAY_MS = 1200;

const QRScannerScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanState, setScanState] = useState("idle");
  const [loadingTitle, setLoadingTitle] = useState("");
  const [errorModal, setErrorModal] = useState({
    visible: false,
    title: "",
    message: "",
  });
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  const resetScannerState = useCallback(() => {
    setScanned(false);
    setShowCamera(false);
    setScanState("idle");
    setLoadingTitle("");
    checkmarkScale.setValue(0);
  }, [checkmarkScale]);

  useFocusEffect(
    useCallback(() => {
      resetScannerState();
    }, [resetScannerState]),
  );

  const showScanError = (title, message) => {
    setShowCamera(false);
    setScanState("idle");
    setScanned(false);
    setLoadingTitle("");
    checkmarkScale.setValue(0);
    setErrorModal({ visible: true, title, message });
  };

  const resolveEcopoint = async (rawQrValue) => {
    const response = await api.get(ECOPOINT_ROUTES.BY_QR_CODE(rawQrValue));
    return response.data?.ecopoint;
  };

  const navigateToPickup = (ecopoint) => {
    navigation.navigate("PickUpScreen", {
      ecoPontoId: ecopoint.id,
      ecoPontoName: ecopoint.label,
      locationName: ecopoint.locationName,
      acceptedMaterials: ecopoint.acceptedMaterials ?? [],
    });
  };

  const playSuccessAnimation = (onComplete) => {
    setScanState("success");
    Animated.spring(checkmarkScale, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();

    setTimeout(onComplete, NAVIGATION_DELAY_MS);
  };

  const handleBarCodeScanned = async ({ data }) => {
    if (scanned || !data?.trim()) {
      return;
    }

    setScanned(true);
    setScanState("loading");
    setLoadingTitle(t("QRScanner.validatingTitle"));

    try {
      const ecopoint = await resolveEcopoint(data.trim());

      if (!ecopoint?.id) {
        showScanError(
          t("QRScanner.errorGenericTitle"),
          t("QRScanner.errorGenericMessage"),
        );
        return;
      }

      setLoadingTitle(t("QRScanner.openingTitle"));
      playSuccessAnimation(() => navigateToPickup(ecopoint));
    } catch (error) {
      const status = error?.status;
      const serverMessage = error?.message;

      if (status === 404) {
        showScanError(
          t("QRScanner.errorNotFoundTitle"),
          t("QRScanner.errorNotFoundMessage"),
        );
        return;
      }

      if (status === 409) {
        showScanError(
          t("QRScanner.errorUnavailableTitle"),
          serverMessage || t("QRScanner.errorUnavailableMessage"),
        );
        return;
      }

      showScanError(
        t("QRScanner.errorGenericTitle"),
        serverMessage || t("QRScanner.errorGenericMessage"),
      );
    }
  };

  const handleOpenCamera = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();

      if (!result?.granted) {
        Alert.alert(
          t("QRScanner.permissionDenied"),
          t("QRScanner.permissionDeniedMessage"),
        );
        return;
      }
    }

    resetScannerState();
    setShowCamera(true);
    setScanState("scanning");
  };

  const handleCloseCamera = () => {
    resetScannerState();
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        {scanState === "scanning" && (
          <>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            <View style={styles.overlay} pointerEvents="box-none">
              <TouchableOpacity
                style={styles.cameraBackButton}
                onPress={handleCloseCamera}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.cameraTitle}>
                {t("QRScanner.cameraTitle")}
              </Text>

              <View style={styles.scanFrame}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
          </>
        )}

        {scanState === "loading" && (
          <View style={styles.loadingOverlay}>
            <TouchableOpacity
              style={styles.cameraBackButton}
              onPress={handleCloseCamera}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.loadingTitle}>{loadingTitle}</Text>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}

        {scanState === "success" && (
          <View style={styles.successOverlay}>
            <Text style={styles.successTitle}>
              {t("QRScanner.successTitle")}
            </Text>
            <Animated.View style={{ transform: [{ scale: checkmarkScale }] }}>
              <Ionicons name="checkmark-circle" size={120} color="#52B788" />
            </Animated.View>
          </View>
        )}

        <ErrorModal
          visible={errorModal.visible}
          title={errorModal.title}
          message={errorModal.message}
          onConfirm={() => setErrorModal((prev) => ({ ...prev, visible: false }))}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        <Text style={styles.backButtonText}>{t("QRScanner.backButton")}</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>{t("QRScanner.title")}</Text>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            {t("QRScanner.instructionPart1")}{" "}
            <Text style={styles.instructionBold}>
              {t("QRScanner.instructionBold")}
            </Text>{" "}
            {t("QRScanner.instructionPart2")}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cameraButton}
          onPress={handleOpenCamera}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={80} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.helperText}>{t("QRScanner.helperText")}</Text>
      </View>

      <ErrorModal
        visible={errorModal.visible}
        title={errorModal.title}
        message={errorModal.message}
        onConfirm={() => setErrorModal((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

export default QRScannerScreen;
