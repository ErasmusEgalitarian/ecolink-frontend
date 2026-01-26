import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/components/CameraSimulator.styles";

const CameraSimulator = ({
  visible,
  cameraState,
  onClose,
  onCapture,
  captureTitle,
  loadingTitle,
  successTitle,
}) => {
  const checkmarkScale = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (cameraState === "success") {
      Animated.spring(checkmarkScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
    } else {
      checkmarkScale.setValue(0);
    }
  }, [cameraState]);

  return (
    <Modal
      visible={visible}
      transparent={false}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {cameraState === "capturing" && (
          <>
            {/* <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>📷 Simulando Câmera</Text>
              <Text style={styles.placeholderSubtext}>Modo de teste</Text>
            </View> */}

            <View style={styles.overlay}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={onClose}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <Text style={styles.title}>{captureTitle}</Text>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={onCapture}
                activeOpacity={0.8}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
            </View>
          </>
        )}

        {cameraState === "loading" && (
          <View style={styles.statusOverlay}>
            <Text style={styles.statusTitle}>{loadingTitle}</Text>
            <ActivityIndicator size="large" color="#FFFFFF" />
          </View>
        )}

        {cameraState === "success" && (
          <View style={styles.statusOverlay}>
            <Text style={styles.statusTitle}>{successTitle}</Text>
            <Animated.View style={{ transform: [{ scale: checkmarkScale }] }}>
              <Ionicons name="checkmark-circle" size={120} color="#52B788" />
            </Animated.View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default CameraSimulator;
