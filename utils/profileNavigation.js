import { Platform } from "react-native";
import { StackActions } from "@react-navigation/native";

import { goBackInDonationsStack } from "./donationsNavigation";

export const PROFILE_STACK_ROOT = "ProfileScreen";

const PROFILE_STACK_ROUTES = new Set([
  PROFILE_STACK_ROOT,
  "ProfileMyDataScreen",
  "ProfileChangePasswordScreen",
  "ProfileDeleteAccountScreen",
  "ProfileDeleteAccountConfirmScreen",
  "DonationHistoryScreen",
  "ProfileSemesterDonationsScreen",
  "DonationsFaqScreen",
]);

export const getNestedStackRouteName = (navigation) => {
  const state = navigation.getState();
  const index = state?.index ?? 0;
  return state?.routes?.[index]?.name ?? null;
};

/**
 * Volta uma tela na pilha de Perfil.
 *
 * Usa o índice da stack interna (não navigation.canGoBack), porque na web
 * canGoBack reflete o histórico do navegador e pode sair da aba Perfil.
 */
export const goBackInProfileStack = (
  navigation,
  { fallbackScreen = PROFILE_STACK_ROOT } = {},
) => {
  const state = navigation.getState();
  const stackIndex = state?.index ?? 0;

  if (stackIndex > 0) {
    navigation.goBack();
    return;
  }

  const currentRoute = state?.routes?.[stackIndex]?.name;
  if (currentRoute && currentRoute !== fallbackScreen) {
    navigation.replace(fallbackScreen);
  }
};

export const resetProfileTabToRoot = (navigation) => {
  const tabState = navigation.getState();
  const profileTab = tabState.routes.find((route) => route.name === "Perfil");
  const profileStackState = profileTab?.state;
  const stackIndex = profileStackState?.index ?? 0;
  const focusedRouteName =
    profileStackState?.routes?.[stackIndex]?.name ?? PROFILE_STACK_ROOT;

  if (focusedRouteName === PROFILE_STACK_ROOT && stackIndex === 0) {
    return;
  }

  // Deep link / refresh: pilha só com a sub-rota no índice 0 — replace evita
  // empilhar /perfil no histórico do navegador (segundo toque voltava para a sub-rota).
  if (
    profileStackState?.key &&
    stackIndex === 0 &&
    focusedRouteName !== PROFILE_STACK_ROOT
  ) {
    navigation.dispatch({
      ...StackActions.replace(PROFILE_STACK_ROOT),
      target: profileStackState.key,
    });
    return;
  }

  navigation.navigate("Perfil", { screen: PROFILE_STACK_ROOT });
};

export const getCurrentTabName = (navigation) => {
  let parent = navigation.getParent();

  while (parent) {
    const state = parent.getState();
    if (state?.routeNames?.includes("Perfil") && state?.routeNames?.includes("Doações")) {
      return state.routes[state.index]?.name ?? null;
    }
    parent = parent.getParent();
  }

  return null;
};

export const isProfileTabContext = (navigation) => {
  const tab = getCurrentTabName(navigation);
  if (tab === "Perfil") {
    return true;
  }
  if (tab === "Doações") {
    return false;
  }

  if (Platform.OS === "web" && typeof window !== "undefined") {
    const path = window.location.pathname;
    if (path.includes("/perfil")) {
      return true;
    }
    if (path.includes("/doacoes")) {
      return false;
    }
  }

  return PROFILE_STACK_ROUTES.has(getNestedStackRouteName(navigation));
};

export const goBackInProfileOrDonationsStack = (navigation) => {
  if (isProfileTabContext(navigation)) {
    goBackInProfileStack(navigation);
    return;
  }

  goBackInDonationsStack(navigation);
};

/**
 * Reseta a aba Perfil para ProfileScreen quando o usuário toca na aba já ativa
 * estando em qualquer sub-rota (inclusive após refresh em deep link).
 */
export const createProfileTabPressListener = ({ navigation, route }) => ({
  tabPress: (event) => {
    const tabState = navigation.getState();
    const routeIndex = tabState.routes.findIndex((item) => item.name === route.name);

    if (tabState.index !== routeIndex) {
      return;
    }

    event.preventDefault();

    const profileState = tabState.routes[routeIndex]?.state;
    const stackIndex = profileState?.index ?? 0;
    const focusedRouteName =
      profileState?.routes?.[stackIndex]?.name ?? PROFILE_STACK_ROOT;

    if (stackIndex > 0 || focusedRouteName !== PROFILE_STACK_ROOT) {
      resetProfileTabToRoot(navigation);
    }
  },
});
