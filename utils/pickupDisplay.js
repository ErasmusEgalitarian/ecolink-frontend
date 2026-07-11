import { formatRelativeTime } from "./donationDisplay";

export const PICKUP_STATUS_COLORS = {
  pending: "#C9AB00",
  accepted: "#006BB0",
  completed: "#70A31F",
  cancelled: "#D62B25",
  default: "#4E6879",
};

export const getPickupId = (pickup) =>
  pickup?.id || pickup?._id?.toString?.() || pickup?._id || "";

export const getPickupEcopoint = (pickup) => {
  const ecopoint = pickup?.ecopointId;
  return ecopoint && typeof ecopoint === "object" ? ecopoint : null;
};

export const getPickupLocation = (pickup) => {
  const ecopoint = getPickupEcopoint(pickup);
  const location = ecopoint?.locationId;
  return location && typeof location === "object" ? location : null;
};

export const getPickupLocationName = (pickup, t) => {
  const location = getPickupLocation(pickup);
  if (location?.name?.trim()) {
    return location.name.trim();
  }

  const ecopoint = getPickupEcopoint(pickup);
  if (ecopoint?.label?.trim()) {
    return ecopoint.label.trim();
  }

  return t("Collector.unknownLocation");
};

export const getPickupEcopointLabel = (pickup, t) => {
  const ecopoint = getPickupEcopoint(pickup);
  if (ecopoint?.label?.trim()) {
    return ecopoint.label.trim();
  }

  return t("Collector.unknownEcopoint");
};

export const getPickupEcopointStatus = (pickup) =>
  getPickupEcopoint(pickup)?.status || "";

export const getPickupStatusMeta = (status, t) => {
  const color = PICKUP_STATUS_COLORS[status] || PICKUP_STATUS_COLORS.default;
  const label = t(`Collector.pickupStatus.${status}`, { defaultValue: status });

  return { label, color };
};

export const getPickupCreatedLabel = (pickup, t) => {
  const date = pickup?.createdAt || pickup?.confirmedAt;
  if (!date) {
    return "";
  }

  return formatRelativeTime(date, t);
};

export const formatPickupTimelineDate = (dateInput, language = "pt") => {
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const locale = String(language).startsWith("pt") ? "pt-BR" : "en-US";

  return date.toLocaleString(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const buildPickupTimeline = (pickup) => {
  if (!pickup) {
    return [];
  }

  const steps = [
    { key: "created", date: pickup.createdAt },
    pickup.confirmedAt ? { key: "accepted", date: pickup.confirmedAt } : null,
    pickup.completedAt ? { key: "completed", date: pickup.completedAt } : null,
    pickup.cancelledAt ? { key: "cancelled", date: pickup.cancelledAt } : null,
  ].filter(Boolean);

  const terminalKey =
    pickup.pickupStatus === "cancelled"
      ? "cancelled"
      : pickup.pickupStatus === "completed"
        ? "completed"
        : pickup.pickupStatus === "accepted"
          ? "accepted"
          : "created";

  return steps.map((step) => ({
    ...step,
    isTerminal: step.key === terminalKey,
    isPast: steps.findIndex((item) => item.key === step.key)
      < steps.findIndex((item) => item.key === terminalKey),
  }));
};

export const summarizePickupDonations = (donations = []) => {
  const summary = {
    totalItems: donations.length,
    totalWeight: 0,
    byMaterial: {},
  };

  donations.forEach((donation) => {
    const weight = Number(donation?.qtdMaterial) || 0;
    summary.totalWeight += weight;

    const material = donation?.materialType || "unknown";
    summary.byMaterial[material] = (summary.byMaterial[material] || 0) + weight;
  });

  return summary;
};

export const isPickupActiveForUser = (pickup, userId) => {
  if (!pickup || !userId) {
    return false;
  }

  const acceptorId =
    pickup.pickupBy?.id ||
    pickup.pickupBy?._id?.toString?.() ||
    pickup.pickupBy?.toString?.();

  return (
    pickup.pickupStatus === "accepted" &&
    acceptorId &&
    acceptorId.toString() === userId.toString()
  );
};
