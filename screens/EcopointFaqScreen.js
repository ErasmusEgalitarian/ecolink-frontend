import React from "react";

import FaqView from "../components/FaqView";
import { ECOPOINT_STATUS_COLORS } from "../utils/ecopoints";
import { goBackInDonationsStack } from "../utils/donationsNavigation";

const FAQ_SECTIONS = [
  {
    titleKey: "activeTitle",
    color: ECOPOINT_STATUS_COLORS.open,
    part1Key: "activeDescriptionPart1",
    boldKey: "activeDescriptionBold",
    part2Key: "activeDescriptionPart2",
  },
  {
    titleKey: "fullTitle",
    color: ECOPOINT_STATUS_COLORS.full,
    part1Key: "fullDescriptionPart1",
    boldKey: "fullDescriptionBold",
    part2Key: "fullDescriptionPart2",
  },
  {
    titleKey: "offlineTitle",
    color: ECOPOINT_STATUS_COLORS.offline,
    part1Key: "offlineDescriptionPart1",
    boldKey: "offlineDescriptionBold",
    part2Key: "offlineDescriptionPart2",
  },
  {
    titleKey: "closedTitle",
    color: ECOPOINT_STATUS_COLORS.closed,
    part1Key: "closedDescriptionPart1",
    boldKey: "closedDescriptionBold",
    part2Key: "closedDescriptionPart2",
  },
].map(({ color, ...section }) => ({
  ...section,
  titleColor: color,
}));

const EcopointFaqScreen = ({ navigation }) => {
  const handleBack = () => goBackInDonationsStack(navigation);

  return (
    <FaqView
      titleKey="title"
      translationNamespace="EcopointFaq"
      sections={FAQ_SECTIONS}
      onBack={handleBack}
    />
  );
};

export default EcopointFaqScreen;
