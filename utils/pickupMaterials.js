export const PICKUP_WASTE_TYPES = [
  { id: "plastic", labelKey: "Pickup.plastic", icon: "water-outline" },
  { id: "paper", labelKey: "Pickup.paper", icon: "document-text-outline" },
  { id: "glass", labelKey: "Pickup.glass", icon: "wine-outline" },
  { id: "metal", labelKey: "Pickup.metal", icon: "hardware-chip-outline" },
];

export const getPickupWasteTypes = (acceptedMaterials = [], t) => {
  const allowed = new Set(
    Array.isArray(acceptedMaterials) ? acceptedMaterials : [],
  );

  return PICKUP_WASTE_TYPES.filter(({ id }) => allowed.has(id)).map(
    ({ id, labelKey, icon }) => ({
      id,
      label: t(labelKey),
      icon,
    }),
  );
};
