export const COLLECTOR_ROLES = new Set(["Editor", "Admin"]);

export const canCollectPickups = (role) => COLLECTOR_ROLES.has(role);
