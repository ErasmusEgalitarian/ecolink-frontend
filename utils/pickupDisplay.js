import { getDonationMaterialLabelKey, formatDonationWeight } from "./donationDisplay";

export const getPickupId = (pickup) => pickup?._id || pickup?.id || "";

export const getPickupEcopoint = (pickup) => {
  const ecopoint = pickup?.ecopointId;
  return ecopoint && typeof ecopoint === "object" ? ecopoint : null;
};

export const getPickupLocationName = (pickup, t) => {
  const ecopoint = getPickupEcopoint(pickup);
  const locationName =
    typeof ecopoint?.locationId === "object"
      ? ecopoint.locationId?.name?.trim()
      : "";

  if (locationName) {
    return locationName;
  }

  return ecopoint?.label?.trim() || t("Collector.unknownLocation");
};

export const getPickupEcopointLabel = (pickup) =>
  getPickupEcopoint(pickup)?.label?.trim() || "";

export const getPickupEcopointStatus = (pickup) =>
  getPickupEcopoint(pickup)?.status || "";

export const getPickupLocationAddress = (pickup) => {
  const ecopoint = getPickupEcopoint(pickup);
  if (typeof ecopoint?.locationId === "object") {
    return ecopoint.locationId?.address?.trim() || "";
  }
  return "";
};

export const getPickupLocationCoordinates = (pickup) => {
  const ecopoint = getPickupEcopoint(pickup);
  const coordinates =
    typeof ecopoint?.locationId === "object"
      ? ecopoint.locationId?.coordinates?.coordinates
      : null;

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  return { lng: coordinates[0], lat: coordinates[1] };
};

export const summarizePickupDonations = (donations = []) => {
  const summary = {};

  donations.forEach((donation) => {
    const type = donation?.materialType;
    if (!type) {
      return;
    }

    if (!summary[type]) {
      summary[type] = { count: 0, weight: 0 };
    }

    summary[type].count += 1;
    summary[type].weight += Number(donation.qtdMaterial) || 0;
  });

  return summary;
};

export const formatPickupMaterialSummary = (summary, t) =>
  Object.entries(summary).map(([materialType, data]) => ({
    materialType,
    labelKey: getDonationMaterialLabelKey(materialType),
    count: data.count,
    weightLabel: formatDonationWeight(data.weight, t),
  }));
