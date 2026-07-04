import { Platform } from "react-native";

// Na web o React Navigation usa o pathname do navegador (os prefixes são
// ignorados). No nativo, os prefixes definem o esquema de deep link.
const prefixes = Platform.OS === "web" ? [] : ["ecolink://"];

export const authLinking = {
  prefixes,
  config: {
    screens: {
      Login: "login",
      Register: "registro",
    },
  },
};

export const appLinking = {
  prefixes,
  config: {
    screens: {
      Doações: {
        path: "doacoes",
        screens: {
          DashboardScreen: "",
          OverviewScreen: "historico",
          QRScannerScreen: "scanner",
          PickUpScreen: "coleta",
          PickUpScreenFinalStep: "coleta/confirmar",
          PickUpScreenMap: "mapa",
          AvailableEcopointsScreen: "ecopontos",
          EcopointDetailScreen: "ecopontos/:locationId",
        },
      },
      Mapa: {
        path: "mapa-tab",
        screens: {
          MapScreen: "",
        },
      },
      Conteúdo: {
        path: "conteudo",
        screens: {
          ContentScreen: {
            screens: {
              MediaList: "",
              MediaUpload: "upload",
            },
          },
        },
      },
      Perfil: {
        path: "perfil",
        screens: {
          ProfileScreen: "",
        },
      },
    },
  },
};
