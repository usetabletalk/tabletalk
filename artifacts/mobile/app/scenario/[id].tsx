import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useAppState } from "@/contexts/AppStateContext";
import { SCENARIOS, ScenarioStep } from "@/data/scenarios";

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentStep, setCurrentStep] = useState<ScenarioStep | null>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (scenario) {
      const firstStep = scenario.steps[scenario.firstStepId];
      setMessages([
        {
          id: Date.now().toString(),
          stepId: firstStep.id,
          speaker: firstStep.speaker,
          text: firstStep.text,
        },
      ]);
      setCurrentStep(firstStep);
    }
  }, [scenario]);

  const handleOptionSelect = (option: { id: string; text: string; nextStepId: string }) => {
    if (!scenario) return;

    // Add user's choice
    const userMsg: Message = {
      id: Date.now().toString() + "1",
      stepId: "choice",
      speaker: "user",
      text: option.text,
    };

    // Add next step immediately
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
      bgColor = colors.secondary;
      textColor = colors.secondaryForeground;
      align = "center";
    }

    return (
      <View style={[styles.messageWrapper, { alignSelf: align as any }]}>
        {isApp && (
          <View style={styles.appIconWrapper}>
            <Feather name="info" size={16} color={colors.secondaryForeground} />
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: bgColor,
              borderRadius: colors.radius,
              borderWidth: isApp ? 0 : 1,
              borderColor: isApp ? "transparent" : colors.border,
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
  },
  messageText: {
    fontSize: 16,
    lineHeight: 24,
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
