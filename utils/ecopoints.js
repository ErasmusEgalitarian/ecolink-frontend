// Helpers de formatação para a tela de Ecopontos disponíveis.
// Mantém a lógica de exibição (distância, materiais e status) isolada da UI.

export const ECOPOINT_STATUS_COLORS = {
  open: "#70A31F",
  full: "#C9AB00",
  closed: "#D62B25",
  offline: "#4E6879",
  default: "#4E6879",
};

export const getStatusMeta = (status, t) => {
  switch (status) {
    case "open":
      return {
        label: t("Ecopoints.statusOpen"),
        color: ECOPOINT_STATUS_COLORS.open,
        dimmed: false,
      };
    case "full":
      return {
        label: t("Ecopoints.statusFull"),
        color: ECOPOINT_STATUS_COLORS.full,
        dimmed: false,
      };
    case "closed":
      return {
        label: t("Ecopoints.statusClosed"),
        color: ECOPOINT_STATUS_COLORS.closed,
        dimmed: false,
      };
    case "offline":
      return {
        label: t("Ecopoints.statusOffline"),
        color: ECOPOINT_STATUS_COLORS.offline,
        dimmed: true,
      };
    default:
      return {
        label: status || "",
        color: ECOPOINT_STATUS_COLORS.default,
        dimmed: false,
      };
  }
};

export const formatDistance = (meters, t, language = "pt") => {
  if (meters == null || Number.isNaN(Number(meters))) {
    return "";
  }

  const value = Number(meters);

  if (value < 1000) {
    return t("Ecopoints.distanceMeters", { value: Math.round(value) });
  }

  let km = (value / 1000).toFixed(1);
  if (km.endsWith(".0")) {
    km = km.slice(0, -2);
  }
  if (String(language).startsWith("pt")) {
    km = km.replace(".", ",");
  }

  return t("Ecopoints.distanceKm", { value: km });
};

export const formatMaterials = (materials, t) => {
  const list = Array.isArray(materials) ? materials : [];
  const names = list
    .map((material) =>
      t(`Ecopoints.materials.${material}`, { defaultValue: material }),
    )
    .filter(Boolean);

  if (names.length === 0) {
    return t("Ecopoints.noMaterials");
  }

  const prefix = t("Ecopoints.collectPrefix");

  if (names.length === 1) {
    return `${prefix} ${names[0]}.`;
  }

  const and = t("Ecopoints.materialAnd");
  const head = names.slice(0, -1).join(", ");
  const tail = names[names.length - 1];

  return `${prefix} ${head} ${and} ${tail}.`;
};
