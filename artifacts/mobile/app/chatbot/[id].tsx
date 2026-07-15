import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { SCENARIOS } from "@/data/scenarios";

export default function ChatbotModePickerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const scenario = SCENARIOS.find((s) => s.id === id);

  if (!scenario) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.foreground }}>Scenario not found.</Text>
      </View>
    );
  }

  const handleModeSelect = (modeId: string) => {
    router.push(`/chatbot/chat?scenarioId=${id}&modeId=${modeId}`);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: insets.bottom + 32, paddingTop: Platform.OS === "web" ? 24 : 16 },
      ]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {scenario.title}
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Choose who you'll be chatting with. Each option gives you a different experience to practice.
        </Text>
      </View>

      <View style={styles.modeCards}>
        {scenario.modes!.map((mode) => (
          <Pressable
            key={mode.id}
            style={({ pressed }) => [
              styles.modeCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => handleModeSelect(mode.id)}
            accessibilityRole="button"
            accessibilityLabel={`${mode.label}: ${mode.description}`}
          >
            <View style={[styles.modeIconCircle, { backgroundColor: colors.tints[mode.tint] }]}>
              <Feather name={mode.icon as any} size={22} color={colors.foreground} />
            </View>
            <View style={styles.modeCardText}>
              <Text style={[styles.modeLabel, { color: colors.foreground }]}>
                {mode.label}
              </Text>
              <Text style={[styles.modeDescription, { color: colors.mutedForeground }]}>
                {mode.description}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    gap: 32,
  },
  header: {
    gap: 10,
    paddingTop: 8,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 32,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  modeCards: {
    gap: 14,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  modeIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  modeCardText: {
    flex: 1,
    gap: 4,
  },
  modeLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  modeDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
});
