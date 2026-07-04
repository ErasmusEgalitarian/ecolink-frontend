/**
 * Retorna à tela alvo na pilha de Doações de forma semântica.
 *
 * - Se a tela já existir na pilha, faz pop até ela (ignora telas intermediárias).
 * - Se não existir (deep link, F5 na web ou entrada direta), substitui a tela atual
 *   em vez de empilhar, evitando histórico inconsistente.
 */
export const returnToScreen = (navigation, screenName) => {
  const state = navigation.getState();
  const hasTarget = state.routes.some((route) => route.name === screenName);

  if (hasTarget) {
    navigation.navigate(screenName);
    return;
  }

  navigation.replace(screenName);
};

/**
 * Reseta a aba Doações para o Dashboard quando o usuário clica na aba
 * já ativa e a pilha interna não está na raiz.
 */
export const createDonationsTabPressListener = ({ navigation, route }) => ({
  tabPress: () => {
    const tabState = navigation.getState();
    const routeIndex = tabState.routes.findIndex((r) => r.name === route.name);

    if (tabState.index !== routeIndex) {
      return;
    }

    const stackIndex = tabState.routes[routeIndex]?.state?.index ?? 0;
    if (stackIndex > 0) {
      navigation.navigate("Doações", { screen: "DashboardScreen" });
    }
  },
});
