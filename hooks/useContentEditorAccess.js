import { useUserRole } from "./useUserRole";

export const useContentEditorAccess = () => {
  const { isEditor, loading, refreshRole } = useUserRole();

  return {
    isEditor,
    loadingRole: loading,
    refreshRole,
  };
};
