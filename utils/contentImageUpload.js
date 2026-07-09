import { Platform } from "react-native";

import {
  api,
  API_UPLOAD_TIMEOUT_MS,
  CONTENT_ROUTES,
} from "../config/api";

const normalizeSlug = (slug = "") =>
  slug
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const uploadContentImage = async ({ file, slug, purpose = "inline" }) => {
  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    throw new Error("Slug is required before uploading images");
  }

  const formData = new FormData();

  // Text fields must come before the file so multer has slug when destination() runs.
  formData.append("slug", normalizedSlug);
  formData.append("purpose", purpose);

  if (Platform.OS === "web") {
    formData.append("file", file);
  } else {
    formData.append("file", {
      uri: file.uri,
      name: file.fileName || `content-${Date.now()}.jpg`,
      type: file.type || "image/jpeg",
    });
  }

  const response = await api.post(
    CONTENT_ROUTES.UPLOAD_IMAGE,
    formData,
    {
      timeout: API_UPLOAD_TIMEOUT_MS,
      params: {
        slug: normalizedSlug,
        purpose,
      },
    },
  );

  return response.data?.data;
};
