import React from "react";

import ProfileStubScreen from "../components/profile/ProfileStubScreen";

const ProfileDeleteAccountScreen = ({ navigation }) => (
  <ProfileStubScreen
    navigation={navigation}
    titleKey="Profile.deleteAccount"
    messageKey="Profile.deleteAccountStubMessage"
  />
);

export default ProfileDeleteAccountScreen;
