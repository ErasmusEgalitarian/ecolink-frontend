/** Material colors from the Doações gerais chart legend (Figma). */
export const RECYCLING_MATERIALS = [
  {
    id: "metal",
    color: "#29A66C",
    labelKey: "GeneralDonations.materialMetal",
  },
  {
    id: "paper",
    color: "#1A7048",
    labelKey: "GeneralDonations.materialPaper",
  },
  {
    id: "plastic",
    color: "#C6F27E",
    labelKey: "GeneralDonations.materialPlastic",
  },
  {
    id: "glass",
    color: "#B5E8D0",
    labelKey: "GeneralDonations.materialGlass",
  },
];

/** Reserved for future aluminum breakdown. */
export const ALUMINUM_COLOR = "#A7A9AC";

export const RECYCLING_COLORS = Object.fromEntries(
  RECYCLING_MATERIALS.map(({ id, color }) => [id, color]),
);

export const getMaterialColor = (materialType) =>
  RECYCLING_COLORS[materialType] ?? "#9CA3AF";
