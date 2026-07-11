import React from "react";

import FaqView from "../components/FaqView";
import { goBackInProfileOrDonationsStack } from "../utils/profileNavigation";

const DONATIONS_FAQ_SECTIONS = [
  { titleKey: "whatIsEcolinkTitle", bodyKey: "whatIsEcolinkBody" },
  { titleKey: "whatAreEcopointsTitle", bodyKey: "whatAreEcopointsBody" },
  { titleKey: "howItWorksTitle", bodyKey: "howItWorksBody" },
  { titleKey: "howToParticipateTitle", bodyKey: "howToParticipateBody" },
  { titleKey: "howToGetCreditsTitle", bodyKey: "howToGetCreditsBody" },
];

const DonationsFaqScreen = ({ navigation }) => {
  const handleBack = () => goBackInProfileOrDonationsStack(navigation);

  return (
    <FaqView
      translationNamespace="DonationsFaq"
      sections={DONATIONS_FAQ_SECTIONS}
      onBack={handleBack}
    />
  );
};

export default DonationsFaqScreen;
