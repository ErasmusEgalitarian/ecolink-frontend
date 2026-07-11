import React, { useRef } from "react";
import {
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

import { styles } from "../../styles/components/ProfileAvatarUploader.styles";

const ProfileAvatarUploader = ({
  avatarUrl,
  previewUri = null,
  onImageSelected,
  disabled = false,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const displayUri = previewUri || avatarUrl;

  const notifySelection = (file, preview) => {
    onImageSelected?.(file, preview);
  };

  const pickFromGallery = async () => {
    if (disabled) {
      return;
    }

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
    notifySelection(
      {
        uri: asset.uri,
        fileName: asset.fileName || `profile-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      },
      asset.uri,
    );
  };

  const onWebFileChange = (event) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) {
      return;
    }

    notifySelection(selectedFile, URL.createObjectURL(selectedFile));
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
          disabled={disabled}
        />
      ) : null}

      <TouchableOpacity
        style={styles.avatarButton}
        onPress={pickFromGallery}
        activeOpacity={0.85}
        disabled={disabled}
      >
        {displayUri ? (
          <Image
            key={displayUri}
            source={{ uri: displayUri }}
            style={styles.avatarImage}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={36} color="#52B788" />
          </View>
        )}

        <View style={styles.editBadge}>
          <Ionicons name="camera" size={14} color="#FFFFFF" />
        </View>
      </TouchableOpacity>

      <Text style={styles.helperText}>{t("Profile.avatarHelper")}</Text>
    </View>
  );
};

export default ProfileAvatarUploader;
