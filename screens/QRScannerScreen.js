import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { styles } from "../styles/screens/QRScannerScreen.styles";

const QRScannerScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanState, setScanState] = useState("idle"); // idle, scanning, loading, success
  const checkmarkScale = new Animated.Value(0);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Resetar estado quando a tela recebe foco
  useFocusEffect(
    React.useCallback(() => {
      console.log("🔄 QRScannerScreen: Resetando estado ao receber foco");
      // Reset quando entra na tela
      setScanned(false);
      setShowCamera(false);
      setScanState("idle");
      checkmarkScale.setValue(0);

      return () => {
        // Cleanup quando sai da tela
        console.log("🔄 QRScannerScreen: Limpando ao sair");
      };
    }, [])
  );

  // Listener adicional para navegação
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      console.log("🎯 QRScannerScreen: Focus listener ativado");
      setScanned(false);
      setShowCamera(false);
      setScanState("idle");
      checkmarkScale.setValue(0);
    });

    return unsubscribe;
  }, [navigation]);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const handleOpenCamera = async () => {
    // MODO DE TESTE: Simular scan sem câmera (para testar no computador)
    console.log("🔄 Simulando scan de QR Code...");

    // Simular abertura da câmera
    setShowCamera(true);
    setScanState("scanning");

    // Simular scan automático após 2 segundos
    setTimeout(() => {
      handleBarCodeScanned({
        type: "QR",
        data: "ECOPONTO_MOCK_123",
      });
    }, 2000);

    /* 
    // CÓDIGO ORIGINAL (descomentar quando testar em dispositivo móvel):
    if (hasPermission === null) {
      Alert.alert(
        t('QRScanner.permissionPending'),
        t('QRScanner.permissionPendingMessage')
      );
      return;
    }

    if (hasPermission === false) {
      Alert.alert(
        t('QRScanner.permissionDenied'),
        t('QRScanner.permissionDeniedMessage')
      );
      return;
    }

    // Abrir câmera
    setShowCamera(true);
    setScanState('scanning');
    */
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (scanned) return;

    setScanned(true);
    setScanState("loading");

    // Simular processamento
    setTimeout(() => {
      setScanState("success");

      // Animar checkmark
      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();

      // Navegar após 1.5s
      setTimeout(() => {
        navigation.navigate("PickUpScreen", {
          ecoPontoId: data,
          ecoPontoName: "EcoPonto Identificado",
        });
      }, 1500);
    }, 1500);
  };

  // Renderizar tela de câmera
  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        {scanState === "scanning" && (
          <>
            {/* MODO DE TESTE: Placeholder visual ao invés de câmera */}
            {/* <View style={styles.cameraPlaceholder}>
              <Text style={styles.placeholderText}>📷 Simulando Câmera</Text>
              <Text style={styles.placeholderSubtext}>
                Escaneando QR Code...
              </Text>
            </View> */}
            {/* CÓDIGO ORIGINAL (descomentar quando testar em dispositivo móvel):
            <Camera
              style={styles.camera}
              type={Camera.Constants.Type.back}
              onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
            /> */}
            {/* Overlay com cantos */}
            <View style={styles.overlay}>
              <TouchableOpacity
                style={styles.cameraBackButton}
                onPress={() => {
                  setShowCamera(false);
                  setScanState("idle");
                  setScanned(false);
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.cameraTitle}>
                {t("QRScanner.cameraTitle")}
              </Text>

              <View style={styles.scanFrame}>
                {/* Canto superior esquerdo */}
                <View style={[styles.corner, styles.topLeft]} />
                {/* Canto superior direito */}
                <View style={[styles.corner, styles.topRight]} />
                {/* Canto inferior esquerdo */}
                <View style={[styles.corner, styles.bottomLeft]} />
                {/* Canto inferior direito */}
                <View style={[styles.corner, styles.bottomRight]} />
              </View>
            </View>
          </>
        )}

        {scanState === "loading" && (
          <View style={styles.loadingOverlay}>
            <TouchableOpacity
              style={styles.cameraBackButton}
              onPress={() => {
                setShowCamera(false);
                setScanState("idle");
                setScanned(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.loadingTitle}>
              {t("QRScanner.loadingTitle")}
            </Text>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}

        {scanState === "success" && (
          <View style={styles.successOverlay}>
            <TouchableOpacity
              style={styles.cameraBackButton}
              onPress={() => {
                setShowCamera(false);
                setScanState("idle");
                setScanned(false);
              }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.successTitle}>
              {t("QRScanner.successTitle")}
            </Text>
            <Animated.View style={{ transform: [{ scale: checkmarkScale }] }}>
              <Ionicons name="checkmark-circle" size={120} color="#52B788" />
            </Animated.View>
          </View>
        )}
      </View>
    );
  }

  // Tela inicial
  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
        <Text style={styles.backButtonText}>{t("QRScanner.backButton")}</Text>
      </TouchableOpacity>

      {/* Content */}
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

        {/* Camera Button */}
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={handleOpenCamera}
          activeOpacity={0.8}
        >
          <Ionicons name="camera" size={80} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.helperText}>{t("QRScanner.helperText")}</Text>
      </View>
    </View>
  );
};

export default QRScannerScreen;
