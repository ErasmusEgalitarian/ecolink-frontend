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

import { uploadProfileImage } from "../../utils/profileImageUpload";
import { isApiConnectionError } from "../../config/api";
import { styles } from "../../styles/components/ProfileAvatarUploader.styles";

const ProfileAvatarUploader = ({ avatarUrl, onUploaded }) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async (file) => {
    setUploading(true);
    setErrorMessage("");

    try {
      const updatedProfile = await uploadProfileImage(file);
      onUploaded?.(updatedProfile?.avatarUrl || null);
    } catch (error) {
      console.error("[ProfileAvatarUploader] Upload failed:", error);
      if (isApiConnectionError(error)) {
        setErrorMessage(t("Api.connectionMessage"));
      } else {
        setErrorMessage(error?.message || t("Profile.avatarUploadError"));
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
      Alert.alert(
        t("Profile.permissionDeniedTitle"),
        t("Profile.galleryPermission"),
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (result.canceled || !result.assets?.[0]) {
      return;
    }

    const asset = result.assets[0];
    await handleUpload({
      uri: asset.uri,
      fileName: asset.fileName || `profile-${Date.now()}.jpg`,
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

      <TouchableOpacity
        style={styles.avatarButton}
        onPress={pickFromGallery}
        activeOpacity={0.85}
        disabled={uploading}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={36} color="#52B788" />
          </View>
        )}

        <View style={styles.editBadge}>
          {uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>

      <Text style={styles.helperText}>{t("Profile.avatarHelper")}</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );
};

export default ProfileAvatarUploader;
