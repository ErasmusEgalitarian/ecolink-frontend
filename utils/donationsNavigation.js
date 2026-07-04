export const DONATIONS_STACK_ROOT = "DashboardScreen";

/**
 * Volta uma tela na pilha de Doações.
 *
 * Usa o histórico real da stack (quem abriu a tela atual), então novas telas
 * não precisam declarar manualmente para onde voltar.
 *
 * Se não houver histórico (deep link, refresh na web ou entrada direta),
 * substitui pela raiz da pilha em vez de empilhar outra tela.
 */
export const goBackInDonationsStack = (
  navigation,
  { fallbackScreen = DONATIONS_STACK_ROOT } = {},
) => {
  if (navigation.canGoBack()) {
    navigation.goBack();
    return;
  }

  navigation.replace(fallbackScreen);
};

/**
 * @deprecated Prefira goBackInDonationsStack. Mantido apenas se alguma tela
 * precisar pular várias entradas e ir direto a um destino fixo.
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
      navigation.navigate("Doações", { screen: DONATIONS_STACK_ROOT });
    }
  },
});
