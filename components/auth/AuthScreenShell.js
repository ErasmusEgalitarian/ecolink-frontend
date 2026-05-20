import React from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthLayout } from "../../hooks/useAuthLayout";
import { styles } from "../../styles/components/AuthScreenShell.styles";

const AuthScreenShell = ({ children, footer }) => {
  const layout = useAuthLayout();

  return (
    <SafeAreaView style={styles.root} edges={["top"]}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{
            flexGrow: 1,
            minHeight: layout.contentMinHeight,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.topSheetBlock} />

          <View
            style={[
              styles.header,
              {
                height: layout.headerHeight,
                paddingHorizontal: layout.horizontalPadding,
              },
            ]}
          >
            <Image
              source={require("../../assets/logo.png")}
              style={{
                width: layout.logoWidth,
                height: layout.logoHeight,
              }}
              resizeMode="contain"
            />
          </View>

          <View
            style={[
              styles.sheet,
              {
                marginTop: -layout.sheetOverlap,
                borderTopLeftRadius: layout.sheetRadius,
                borderTopRightRadius: layout.sheetRadius,
                paddingHorizontal: layout.horizontalPadding,
              },
            ]}
          >
            <View
              style={[
                styles.sheetInner,
                layout.isCompact && { paddingTop: 24 },
              ]}
            >
              {children}
            </View>
            {footer ? (
              <SafeAreaView
                edges={["bottom"]}
                style={[
                  styles.footer,
                  {
                    paddingBottom: layout.footerPaddingVertical,
                  },
                ]}
              >
                {footer}
              </SafeAreaView>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AuthScreenShell;
