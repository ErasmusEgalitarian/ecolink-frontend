/** Material title colors from the Recent Donations Figma screen. */
export const RECENT_DONATION_MATERIAL_COLORS = {
  metal: "#CE8A0B",
  plastic: "#D62B25",
  paper: "#006BB0",
  glass: "#70A31F",
};

export const getRecentDonationMaterialColor = (materialType) =>
  RECENT_DONATION_MATERIAL_COLORS[materialType] ?? "#28363E";

export const getDonationMaterialLabelKey = (materialType) => {
  const keys = {
    metal: "GeneralDonations.materialMetal",
    plastic: "GeneralDonations.materialPlastic",
    paper: "GeneralDonations.materialPaper",
    glass: "GeneralDonations.materialGlass",
  };
  return keys[materialType] ?? "RecentDonations.unknownMaterial";
};

export const formatDonationWeight = (quantity, t) => {
  const value = Number(quantity);
  if (!Number.isFinite(value) || value < 0) {
    return t("RecentDonations.unknownWeight");
  }

  const rounded = Math.round(value);
  return t("RecentDonations.weightGrams", { count: rounded });
};

export const getDonationLocationLabel = (donation, t) => {
  const ecopoint = donation?.ecopointId;

  if (ecopoint && typeof ecopoint === "object") {
    const location =
      typeof ecopoint.locationId === "object"
        ? ecopoint.locationId?.name?.trim()
        : "";
    const label = ecopoint.label?.trim();

    if (location) {
      return location;
    }

    if (label) {
      return label;
    }
  }

  return t("RecentDonations.unknownLocation");
};

export const formatRelativeTime = (dateInput, t) => {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return t("RecentDonations.unknownTime");
  }

  const diffMs = Date.now() - date.getTime();
  if (diffMs < 0) {
    return t("RecentDonations.justNow");
  }

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < minuteMs) {
    return t("RecentDonations.justNow");
  }

  if (diffMs < hourMs) {
    const minutes = Math.floor(diffMs / minuteMs);
    return t("RecentDonations.minutesAgo", { count: minutes });
  }

  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);
    return t("RecentDonations.hoursAgo", { count: hours });
  }

  const days = Math.floor(diffMs / dayMs);
  return t("RecentDonations.daysAgo", { count: days });
};
