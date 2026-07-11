import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { uploadContentImage } from "../../utils/contentImageUpload";
import { isApiConnectionError } from "../../config/api";
import { styles } from "../../styles/components/ContentImageUploader.styles";

const ContentImageUploader = ({
  slug,
  purpose = "inline",
  previewUrl,
  onUploaded,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const slugReady = Boolean(slug?.trim());

  const handleUpload = async (file) => {
    if (!slugReady) {
      setErrorMessage(t("Content.slugRequiredForImage"));
      return;
    }

    setUploading(true);
    setErrorMessage("");

    try {
      const uploaded = await uploadContentImage({
        file,
        slug,
        purpose,
      });

      onUploaded?.({
        mediaId: uploaded.mediaId,
        previewUrl: uploaded.url,
      });
    } catch (error) {
      console.error("[ContentImageUploader] Upload failed:", error);
      if (isApiConnectionError(error)) {
        setErrorMessage(t("Api.connectionMessage"));
      } else {
        setErrorMessage(error?.message || t("Content.imageUploadError"));
      }
    } finally {
      setUploading(false);
    }
  };

  const pickFromGallery = async () => {
    if (Platform.OS === "web") {
      inputRef.current?.click();
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("Content.permissionDeniedTitle"), t("Content.galleryPermission"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    const asset = result.assets[0];
    await handleUpload({
      uri: asset.uri,
      fileName: asset.fileName || `content-${Date.now()}.jpg`,
      type: asset.mimeType || "image/jpeg",
    });
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("Content.permissionDeniedTitle"), t("Content.cameraPermission"));
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    const asset = result.assets[0];
    await handleUpload({
      uri: asset.uri,
      fileName: asset.fileName || `camera-${Date.now()}.jpg`,
      type: asset.mimeType || "image/jpeg",
    });
  };

  const onWebFileChange = async (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    await handleUpload(selectedFile);
    event.target.value = "";
  };

  return (
    <View style={styles.container}>
      {Platform.OS === "web" ? (
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: "none" }}
          onChange={onWebFileChange}
        />
      ) : null}

      {previewUrl ? (
        <Image source={{ uri: previewUrl }} style={styles.preview} resizeMode="cover" />
      ) : (
        <View style={styles.placeholder}>
          <Ionicons name="image-outline" size={28} color="#29A66C" />
          <Text style={styles.placeholderText}>{t("Content.imagePlaceholder")}</Text>
        </View>
      )}

      {!slugReady ? (
        <Text style={styles.helperText}>{t("Content.slugRequiredForImage")}</Text>
      ) : null}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={pickFromGallery}
          disabled={uploading || !slugReady}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>{t("Content.pickGallery")}</Text>
        </TouchableOpacity>

        {Platform.OS !== "web" ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={takePhoto}
            disabled={uploading || !slugReady}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>{t("Content.takePhoto")}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {uploading ? <ActivityIndicator size="small" color="#29A66C" /> : null}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

export default ContentImageUploader;
