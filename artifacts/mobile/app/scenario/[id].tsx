import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useAppState } from "@/contexts/AppStateContext";
import { SCENARIOS, ScenarioMode, ScenarioStep } from "@/data/scenarios";

type Message = {
  id: string;
  stepId: string;
  speaker: "other" | "user" | "app";
  text: string;
};

export default function ScenarioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { markScenarioCompleted } = useAppState();

  const scenario = SCENARIOS.find((s) => s.id === id);
  const [selectedMode, setSelectedMode] = useState<ScenarioMode | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ScenarioStep | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const hasModes = Boolean(scenario?.modes?.length);
  const conversationReady = !hasModes || selectedMode !== null;

  useEffect(() => {
    if (!scenario || !conversationReady) return;
    const firstStepId = selectedMode ? selectedMode.firstStepId : scenario.firstStepId;
    const firstStep = scenario.steps[firstStepId];
    if (!firstStep) return;
    setMessages([
      {
        id: Date.now().toString(),
        stepId: firstStep.id,
        speaker: firstStep.speaker,
        text: firstStep.text,
      },
    ]);
    setCurrentStep(firstStep);
  }, [scenario, conversationReady, selectedMode]);

  const handleOptionSelect = (option: { id: string; text: string; nextStepId: string }) => {
    if (!scenario) return;

    const userMsg: Message = {
      id: Date.now().toString() + "1",
      stepId: "choice",
      speaker: "user",
      text: option.text,
    };

    const nextStep = scenario.steps[option.nextStepId];
    const nextMsg: Message = {
      id: Date.now().toString() + "2",
      stepId: nextStep.id,
      speaker: nextStep.speaker,
      text: nextStep.text,
    };

    setMessages((prev) => [nextMsg, userMsg, ...prev]);
    setCurrentStep(nextStep);

    if (nextStep.isEnd) {
      markScenarioCompleted(scenario.id);
    }
  };

  if (!scenario) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: "center", alignItems: "center" }]}>
        <Text style={{ color: colors.foreground }}>Scenario not found.</Text>
      </View>
    );
  }

  if (hasModes && !selectedMode) {
    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.modePickerContent,
          { paddingBottom: insets.bottom + 32, paddingTop: Platform.OS === "web" ? 24 : 16 },
        ]}
      >
        <View style={styles.modeHeader}>
          <Text style={[styles.modeTitle, { color: colors.foreground }]}>
            {scenario.title}
          </Text>
          <Text style={[styles.modeSubtitle, { color: colors.mutedForeground }]}>
            Choose who you'll be practicing with. Each option gives you different challenges to work through.
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
              onPress={() => setSelectedMode(mode)}
              accessibilityRole="button"
              accessibilityLabel={`${mode.label}: ${mode.description}`}
            >
              <Text style={styles.modeEmoji}>{mode.emoji}</Text>
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

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.speaker === "user";
    const isApp = item.speaker === "app";

    let bgColor = colors.card;
    let textColor = colors.cardForeground;
    let align = "flex-start";

    if (isUser) {
      bgColor = colors.primary;
      textColor = colors.primaryForeground;
      align = "flex-end";
    } else if (isApp) {
      bgColor = colors.tints.mint;
      textColor = colors.foreground;
      align = "center";
    } else {
      bgColor = colors.secondary;
      textColor = colors.secondaryForeground;
    }

    return (
      <View style={[styles.messageWrapper, { alignSelf: align as any }]}>
        {isApp && (
          <View style={styles.appIconWrapper}>
            <Feather name="info" size={16} color={colors.foreground} style={{ opacity: 0.6 }} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: bgColor,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: textColor, fontFamily: isApp ? "Inter_500Medium" : "Inter_400Regular" },
            ]}
          >
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {selectedMode && (
        <View style={[styles.modeBadge, { backgroundColor: colors.tints.peach }]}>
          <Text style={[styles.modeBadgeText, { color: colors.foreground }]}>
            {selectedMode.emoji} {selectedMode.label}
          </Text>
          <Pressable
            onPress={() => {
              setSelectedMode(null);
              setMessages([]);
              setCurrentStep(null);
            }}
            hitSlop={12}
            accessibilityLabel="Change practice partner"
          >
            <Text style={[styles.modeBadgeChange, { color: colors.primary }]}>Change</Text>
          </Pressable>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        inverted
        contentContainerStyle={[styles.listContent, { paddingTop: 24 }]}
      />

      <View
        style={[
          styles.optionsContainer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 24,
          },
        ]}
      >
        {currentStep?.options && currentStep.options.length > 0 ? (
          currentStep.options.map((opt) => (
            <Pressable
              key={opt.id}
              style={({ pressed }) => [
                styles.optionButton,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              onPress={() => handleOptionSelect(opt)}
            >
              <Text style={[styles.optionText, { color: colors.primary }]}>{opt.text}</Text>
            </Pressable>
          ))
        ) : currentStep?.isEnd ? (
          <Pressable
            style={({ pressed }) => [
              styles.finishButton,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.finishButtonText, { color: colors.primaryForeground }]}>
              Finish Practice
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // ── Mode picker ────────────────────────────────────────────────────────────
  modePickerContent: {
    paddingHorizontal: 24,
    gap: 32,
  },
  modeHeader: {
    gap: 10,
    paddingTop: 8,
  },
  modeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 32,
  },
  modeSubtitle: {
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
  modeEmoji: {
    fontSize: 28,
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
  // ── Mode badge (in-conversation) ───────────────────────────────────────────
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  modeBadgeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  modeBadgeChange: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
  },
  // ── Conversation ───────────────────────────────────────────────────────────
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  messageWrapper: {
    maxWidth: "85%",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  appIconWrapper: {
    marginBottom: 12,
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexShrink: 1,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderWidth: 1,
    alignItems: "center",
  },
  optionText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  finishButton: {
    padding: 18,
    alignItems: "center",
  },
  finishButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
});
