import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RequireRoleScreen from "../components/guards/RequireRoleScreen";
import ContentListScreen from "../screens/ContentListScreen";
import ContentDetailScreen from "../screens/ContentDetailScreen";
import ContentEditorScreen from "../screens/ContentEditorScreen";
import { CONTENT_MANAGER_ROLES } from "../utils/contentPermissions";

const ContentStack = createNativeStackNavigator();

function ContentEditorGuardedScreen(props) {
  return (
    <RequireRoleScreen
      allowedRoles={[...CONTENT_MANAGER_ROLES]}
      navigation={props.navigation}
      redirectTo="ContentList"
    >
      <ContentEditorScreen {...props} />
    </RequireRoleScreen>
  );
}

function ContentStackNavigator() {
  return (
    <ContentStack.Navigator>
      <ContentStack.Screen
        name="ContentList"
        component={ContentListScreen}
        options={{ headerShown: false }}
      />
      <ContentStack.Screen
        name="ContentDetail"
        component={ContentDetailScreen}
        options={{ headerShown: false }}
      />
      <ContentStack.Screen
        name="ContentEditor"
        component={ContentEditorGuardedScreen}
        options={{ headerShown: false }}
      />
    </ContentStack.Navigator>
  );
}

export default ContentStackNavigator;
