import React from "react";
import { View } from "react-native";

import { useColors } from "@/hooks/useColors";

export default function ChatbotScreen() {
  const colors = useColors();
  return <View style={{ flex: 1, backgroundColor: colors.background }} />;
}
