import { Platform } from "react-native";

import { api, API_UPLOAD_TIMEOUT_MS, USER_ROUTES } from "../config/api";

export const uploadProfileImage = async (file) => {
  const formData = new FormData();

  if (Platform.OS === "web") {
    formData.append("file", file);
  } else {
    formData.append("file", {
      uri: file.uri,
      name: file.fileName || `profile-${Date.now()}.jpg`,
      type: file.type || "image/jpeg",
    });
  }

  const response = await api.post(USER_ROUTES.AVATAR, formData, {
    timeout: API_UPLOAD_TIMEOUT_MS,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data?.data;
};
