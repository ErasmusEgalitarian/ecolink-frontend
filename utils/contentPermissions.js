export const CONTENT_MANAGER_ROLES = new Set(["Editor", "Admin"]);

export const canManageContent = (role) =>
  CONTENT_MANAGER_ROLES.has(role);
