import { Feather } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES: {
  id: Difficulty;
  label: string;
  icon: string;
  tagline: string;
  description: string;
}[] = [
  {
    id: "easy",
    label: "Easy",
    icon: "sun",
    tagline: "Low pressure",
    description: "They trust what you're saying and understand your concerns.",
  },
  {
    id: "medium",
    label: "Medium",
    icon: "cloud",
    tagline: "Some friction",
    description: "They're asking follow-up questions and seem a bit confused.",
  },
  {
    id: "hard",
    label: "Hard",
    icon: "zap",
    tagline: "Push back",
    description: "They're skeptical and trying to argue with you about it.",
  },
];

function buildRolePrompt(
  setting: string,
  person: string,
  skill: string,
  difficulty: Difficulty,
  additionalInfo: string
): string {
  const diff = DIFFICULTIES.find((d) => d.id === difficulty)!;
  let prompt = `You are playing the role of ${person} in the following setting: ${setting}.\n\n`;
  prompt += `The user is practicing: ${skill}\n\n`;
  prompt += `Difficulty — ${diff.label} (${diff.tagline}): ${diff.description}\n`;
  prompt += `Stay consistent with this difficulty level throughout the scene. Do not suddenly become more cooperative or more difficult than specified.`;
  if (additionalInfo.trim()) {
    prompt += `\n\nAdditional context provided by the user:\n${additionalInfo.trim()}`;
  }
  return prompt;
}

export default function CustomScenarioScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [setting, setSetting] = useState("");
  const [person, setPerson] = useState("");
  const [skill, setSkill] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const canSubmit = setting.trim() && person.trim() && skill.trim() && difficulty;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const rolePrompt = buildRolePrompt(setting, person, skill, difficulty!, additionalInfo);
    const title = `${setting}`;
    router.push(
      `/chatbot/chat?customTitle=${encodeURIComponent(title)}&customRolePrompt=${encodeURIComponent(rolePrompt)}`
    );
  };

  const topPad = Platform.OS === "web" ? 50 : insets.top;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen
        options={{
          headerTitle: "Custom Scenario",
          headerTitleStyle: { fontFamily: "Inter_600SemiBold", fontSize: 16 },
        }}
      />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Platform.OS === "web" ? topPad + 16 : 16, paddingBottom: insets.bottom + 32 },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Intro */}
        <View style={[styles.introCard, { backgroundColor: colors.primary + "18", borderRadius: colors.radius }]}>
          <Feather name="edit-3" size={18} color={colors.primary} style={{ marginRight: 10, marginTop: 1 }} />
          <Text style={[styles.introText, { color: colors.foreground }]}>
            Answer a few quick questions and we'll set up a personalised practice session for you.
          </Text>
        </View>

        {/* Q1 */}
        <QuestionBlock number={1} label="What is the setting?" colors={colors}>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, color: colors.foreground }]}
            value={setting}
            onChangeText={setSetting}
            placeholder="e.g. a friend's catered wedding, an office celebration, Grandma's holiday table…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={300}
          />
        </QuestionBlock>

        {/* Q2 */}
        <QuestionBlock number={2} label="Who should the chatbot play?" colors={colors}>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, color: colors.foreground }]}
            value={person}
            onChangeText={setPerson}
            placeholder="e.g. a caterer, a relative, a well-meaning partner, a skeptical coworker…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={200}
          />
        </QuestionBlock>

        {/* Q3 */}
        <QuestionBlock number={3} label="What skill are you practicing?" colors={colors}>
          <TextInput
            style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, color: colors.foreground }]}
            value={skill}
            onChangeText={setSkill}
            placeholder="e.g. explaining cross-contact to a stranger, holding my ground when people are doubtful…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={300}
          />
        </QuestionBlock>

        {/* Q4 */}
        <QuestionBlock number={4} label="Select a difficulty level." colors={colors}>
          <View style={styles.difficultyGrid}>
            {DIFFICULTIES.map((d) => {
              const selected = difficulty === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => setDifficulty(d.id)}
                  style={({ pressed }) => [
                    styles.difficultyCard,
                    {
                      backgroundColor: selected ? colors.primary + "18" : colors.card,
                      borderColor: selected ? colors.primary : colors.border,
                      borderRadius: colors.radius,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                  accessibilityLabel={`${d.label}: ${d.description}`}
                >
                  <View style={[styles.difficultyIconRow]}>
                    <Feather
                      name={d.icon as any}
                      size={16}
                      color={selected ? colors.primary : colors.mutedForeground}
                    />
                    {selected && (
                      <View style={[styles.selectedDot, { backgroundColor: colors.primary }]} />
                    )}
                  </View>
                  <Text style={[styles.difficultyLabel, { color: selected ? colors.primary : colors.foreground }]}>
                    {d.label}
                  </Text>
                  <Text style={[styles.difficultyTagline, { color: colors.mutedForeground }]}>
                    {d.tagline}
                  </Text>
                  <Text style={[styles.difficultyDesc, { color: colors.mutedForeground }]}>
                    {d.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </QuestionBlock>

        {/* Q5 */}
        <QuestionBlock
          number={5}
          label="Any additional details?"
          optional
          colors={colors}
        >
          <TextInput
            style={[
              styles.textInput,
              styles.textInputTall,
              { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, color: colors.foreground },
            ]}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            placeholder="e.g. I'm preparing for an upcoming event… there was a situation recently that went badly and I want to try it differently… I'd like the bot to start with a specific line…"
            placeholderTextColor={colors.mutedForeground}
            multiline
            maxLength={600}
            textAlignVertical="top"
          />
          <Text style={[styles.charCount, { color: colors.mutedForeground }]}>
            {additionalInfo.length}/600
          </Text>
        </QuestionBlock>

        {/* Submit */}
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            {
              backgroundColor: canSubmit ? colors.primary : colors.card,
              borderRadius: colors.radius,
              borderWidth: canSubmit ? 0 : 1,
              borderColor: colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Start custom scenario"
          accessibilityState={{ disabled: !canSubmit }}
        >
          <Feather
            name="play"
            size={18}
            color={canSubmit ? colors.primaryForeground : colors.mutedForeground}
            style={{ marginRight: 8 }}
          />
          <Text style={[styles.submitText, { color: canSubmit ? colors.primaryForeground : colors.mutedForeground }]}>
            Start scenario
          </Text>
        </Pressable>

        {!canSubmit && (
          <Text style={[styles.requiredNote, { color: colors.mutedForeground }]}>
            Questions 1–4 are required to start.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function QuestionBlock({
  number,
  label,
  optional,
  children,
  colors,
}: {
  number: number;
  label: string;
  optional?: boolean;
  children: React.ReactNode;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={styles.questionBlock}>
      <View style={styles.questionLabelRow}>
        <View style={[styles.questionBadge, { backgroundColor: colors.primary }]}>
          <Text style={[styles.questionNumber, { color: colors.primaryForeground }]}>{number}</Text>
        </View>
        <Text style={[styles.questionLabel, { color: colors.foreground }]}>{label}</Text>
        {optional && (
          <Text style={[styles.optionalTag, { color: colors.mutedForeground }]}>optional</Text>
        )}
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 28,
  },
  introCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
  },
  introText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  questionBlock: {
    gap: 12,
  },
  questionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  questionBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  questionNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
  },
  questionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    flex: 1,
  },
  optionalTag: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    fontStyle: "italic",
  },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
    minHeight: 90,
  },
  textInputTall: {
    minHeight: 100,
  },
  charCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    textAlign: "right",
    marginTop: -4,
  },
  difficultyGrid: {
    flexDirection: "row",
    gap: 10,
  },
  difficultyCard: {
    flex: 1,
    borderWidth: 1.5,
    padding: 12,
    gap: 4,
  },
  difficultyIconRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  selectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  difficultyLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  difficultyTagline: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 11,
    letterSpacing: 0.2,
  },
  difficultyDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 4,
  },
  submitText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  requiredNote: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    textAlign: "center",
    marginTop: -16,
  },
});
