/**
 * Desktop split-view for the Chatbot tab.
 * Left column: scrollable scenario list.
 * Right column: empty placeholder → mode picker → chat panel.
 *
 * Only rendered on web at ≥ 768 px wide.
 */
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import { useAppState } from "@/contexts/AppStateContext";
import { ROLE_PROMPTS } from "@/data/rolePrompts";
import { SCENARIOS, type Scenario, type ScenarioMode } from "@/data/scenarios";
import { useColors } from "@/hooks/useColors";

// ─── custom-scenario helpers (mirrors custom-scenario.tsx) ──────────────────

type Difficulty = "easy" | "medium" | "hard";

const DIFFICULTIES: {
  id: Difficulty;
  label: string;
  icon: string;
  tagline: string;
  description: string;
}[] = [
  { id: "easy",   label: "Easy",   icon: "sun",   tagline: "Low pressure", description: "They trust what you're saying and understand your concerns." },
  { id: "medium", label: "Medium", icon: "cloud",  tagline: "Some friction", description: "They're asking follow-up questions and seem a bit confused." },
  { id: "hard",   label: "Hard",   icon: "zap",    tagline: "Push back",    description: "They're skeptical and trying to argue with you about it." },
];

function buildRolePrompt(setting: string, person: string, skill: string, difficulty: Difficulty, additionalInfo: string): string {
  const diff = DIFFICULTIES.find((d) => d.id === difficulty)!;
  let p = `You are playing the role of ${person} in the following setting: ${setting}.\n\n`;
  p += `The user is practicing: ${skill}\n\n`;
  p += `Difficulty — ${diff.label} (${diff.tagline}): ${diff.description}\n`;
  p += `Stay consistent with this difficulty level throughout the scene.`;
  if (additionalInfo.trim()) p += `\n\nAdditional context:\n${additionalInfo.trim()}`;
  return p;
}

function QuestionBlock({ number, label, optional, children, colors }: {
  number: number; label: string; optional?: boolean;
  children: React.ReactNode; colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={cs.questionBlock}>
      <View style={cs.questionLabelRow}>
        <View style={[cs.questionBadge, { backgroundColor: colors.primary }]}>
          <Text style={[cs.questionNumber, { color: colors.primaryForeground }]}>{number}</Text>
        </View>
        <Text style={[cs.questionLabel, { color: colors.foreground }]}>{label}</Text>
        {optional && <Text style={[cs.optionalTag, { color: colors.mutedForeground }]}>optional</Text>}
      </View>
      {children}
    </View>
  );
}

// ─── chat helpers (mirrors chat.tsx) ────────────────────────────────────────

const DEBRIEF_MARKER = "[DEBRIEF]";
const ADVICE_OPEN = "[ADVICE]";
const ADVICE_CLOSE = "[/ADVICE]";
const DISCLAIMER =
  "Not a doctor or dietitian — always verify specific foods yourself.\n\nTip: type [anything in brackets] to step outside the scene and talk to me directly.";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "disclaimer" | "debrief" | "advice";
  content: string;
};
type ParsedPart = { role: "assistant" | "debrief" | "advice"; content: string };

function parseResponse(raw: string): ParsedPart[] {
  const debriefIdx = raw.indexOf(DEBRIEF_MARKER);
  const mainText =
    debriefIdx === -1 ? raw : raw.slice(0, debriefIdx).trimEnd();
  const debriefText =
    debriefIdx === -1
      ? ""
      : raw.slice(debriefIdx + DEBRIEF_MARKER.length).trimStart();

  const parts: ParsedPart[] = [];
  let cursor = 0;
  while (cursor < mainText.length) {
    const openIdx = mainText.indexOf(ADVICE_OPEN, cursor);
    if (openIdx === -1) break;
    const closeIdx = mainText.indexOf(ADVICE_CLOSE, openIdx + ADVICE_OPEN.length);
    if (closeIdx === -1) break;
    const before = mainText.slice(cursor, openIdx).trim();
    if (before) parts.push({ role: "assistant", content: before });
    const advice = mainText
      .slice(openIdx + ADVICE_OPEN.length, closeIdx)
      .trim();
    if (advice) parts.push({ role: "advice", content: advice });
    cursor = closeIdx + ADVICE_CLOSE.length;
  }
  const remaining = mainText.slice(cursor).trim();
  if (remaining) parts.push({ role: "assistant", content: remaining });
  if (debriefText) parts.push({ role: "debrief", content: debriefText });
  return parts.length > 0
    ? parts
    : [{ role: "assistant", content: raw.trim() }];
}

// ─── right-panel state ───────────────────────────────────────────────────────

type RightPanel =
  | { kind: "empty" }
  | { kind: "modes"; scenario: Scenario }
  | { kind: "chat"; scenario: Scenario; mode?: ScenarioMode }
  | { kind: "custom-form" }
  | { kind: "custom-chat"; title: string; rolePrompt: string };

// ─── Empty placeholder ───────────────────────────────────────────────────────

function EmptyPanel() {
  const colors = useColors();
  return (
    <View style={rp.empty}>
      <Feather name="message-square" size={44} color={colors.border} />
      <Text style={[rp.emptyTitle, { color: colors.mutedForeground }]}>
        Choose a scenario
      </Text>
      <Text style={[rp.emptySubtitle, { color: colors.mutedForeground }]}>
        Select a practice scenario from the list to get started.
      </Text>
    </View>
  );
}

// ─── Mode picker ─────────────────────────────────────────────────────────────

function ModePicker({
  scenario,
  onSelect,
}: {
  scenario: Scenario;
  onSelect: (mode: ScenarioMode) => void;
}) {
  const colors = useColors();
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={[rp.modeContent, { paddingBottom: 40 }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[rp.modeTitle, { color: colors.foreground }]}>
        {scenario.title}
      </Text>
      <Text style={[rp.modeSub, { color: colors.mutedForeground }]}>
        Choose who you'll be chatting with. Each option gives you a different
        experience to practice.
      </Text>
      <View style={rp.modeCards}>
        {scenario.modes!.map((mode) => (
          <Pressable
            key={mode.id}
            style={({ pressed }) => [
              rp.modeCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => onSelect(mode)}
            accessibilityRole="button"
            accessibilityLabel={`${mode.label}: ${mode.description}`}
          >
            <View
              style={[
                rp.modeIcon,
                { backgroundColor: colors.tints[mode.tint] },
              ]}
            >
              <Feather
                name={mode.icon as any}
                size={22}
                color={colors.foreground}
              />
            </View>
            <View style={rp.modeText}>
              <Text style={[rp.modeLabel, { color: colors.foreground }]}>
                {mode.label}
              </Text>
              <Text style={[rp.modeDesc, { color: colors.mutedForeground }]}>
                {mode.description}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color={colors.mutedForeground}
            />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

// ─── Chat panel ──────────────────────────────────────────────────────────────

function ChatPanel({
  scenario,
  mode,
  customTitle,
  customRolePrompt,
  onBack,
}: {
  scenario?: Scenario;
  mode?: ScenarioMode;
  customTitle?: string;
  customRolePrompt?: string;
  onBack: () => void;
}) {
  const colors = useColors();
  const { state: appState } = useAppState();
  const flatListRef = useRef<FlatList>(null);
  const openingFired = useRef(false);

  const isCustom = !!customTitle;
  const displayTitle = isCustom ? customTitle! : scenario!.title;
  const rolePromptKey = mode ? `${scenario!.id}:${mode.id}` : scenario?.id ?? "";
  const effectiveRolePrompt = isCustom ? customRolePrompt : ROLE_PROMPTS[rolePromptKey];

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "disclaimer", role: "disclaimer", content: DISCLAIMER },
  ]);
  const [apiHistory, setApiHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const callApi = async (
    history: Array<{ role: "user" | "assistant"; content: string }>
  ) => {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history,
        scenarioTitle: displayTitle,
        modeLabel: mode?.label,
        rolePrompt: effectiveRolePrompt,
        isCustomScenario: isCustom,
        userName: appState.userName || undefined,
        userPronouns: appState.userPronouns || undefined,
        dietaryRestrictions: appState.dietaryRestrictions ?? [],
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { response: string };
    return data.response;
  };

  useEffect(() => {
    if (openingFired.current) return;
    openingFired.current = true;
    setLoading(true);
    const opening = [{ role: "user" as const, content: "[begin]" }];
    callApi(opening)
      .then((response) => {
        const parts = parseResponse(response);
        setMessages((prev) => [
          ...prev,
          ...parts.map((p, i) => ({
            id: `opening-${i}`,
            role: p.role,
            content: p.content,
          })),
        ]);
        setApiHistory([...opening, { role: "assistant", content: response }]);
      })
      .catch(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: "opening-err",
            role: "assistant",
            content: "Couldn't start the scene. Please try again.",
          },
        ]);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: false }),
          100
        );
      });
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };
    const nextHistory = [
      ...apiHistory,
      { role: "user" as const, content: text },
    ];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(
      () => flatListRef.current?.scrollToEnd({ animated: true }),
      50
    );
    try {
      const response = await callApi(nextHistory);
      const parts = parseResponse(response);
      const ts = Date.now();
      setMessages((prev) => [
        ...prev,
        ...parts.map((p, i) => ({
          id: `${ts + i}`,
          role: p.role,
          content: p.content,
        })),
      ]);
      setApiHistory([
        ...nextHistory,
        { role: "assistant", content: response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    if (
      item.role === "disclaimer" ||
      item.role === "debrief" ||
      item.role === "advice"
    ) {
      const icon =
        item.role === "disclaimer"
          ? "info"
          : item.role === "debrief"
            ? "check-circle"
            : "message-circle";
      const textColor =
        item.role === "advice" ? colors.accent : colors.foreground;
      const iconColor =
        item.role === "advice" ? colors.accent : colors.mutedForeground;
      return (
        <View
          style={[
            ch.disclaimer,
            {
              backgroundColor: colors.tints.mint,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Feather
            name={icon}
            size={14}
            color={iconColor}
            style={{ marginTop: 2, flexShrink: 0 }}
          />
          <Text style={[ch.disclaimerText, { color: textColor }]}>
            {item.content}
          </Text>
        </View>
      );
    }
    return (
      <View
        style={[
          ch.row,
          { justifyContent: isUser ? "flex-end" : "flex-start" },
        ]}
      >
        <View
          style={[
            ch.bubble,
            {
              backgroundColor: isUser ? colors.primary : colors.card,
              borderRadius: colors.radius,
              borderWidth: isUser ? 0 : 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Text
            style={[
              ch.bubbleText,
              {
                color: isUser
                  ? colors.primaryForeground
                  : colors.foreground,
              },
            ]}
          >
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View
        style={[
          ch.header,
          {
            borderBottomColor: colors.border,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Pressable
          onPress={onBack}
          style={ch.back}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Feather name="arrow-left" size={18} color={colors.primary} />
        </Pressable>
        <View style={ch.headerText}>
          <Text
            style={[ch.headerTitle, { color: colors.foreground }]}
            numberOfLines={1}
          >
            {displayTitle}
          </Text>
          {mode?.label ? (
            <Text
              style={[ch.headerSub, { color: colors.mutedForeground }]}
              numberOfLines={1}
            >
              {mode.label}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        style={{ flex: 1 }}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        contentContainerStyle={ch.list}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
      />

      {loading && (
        <View style={[ch.loadingRow, { paddingHorizontal: 20 }]}>
          <View
            style={[
              ch.loadingBubble,
              {
                backgroundColor: colors.card,
                borderRadius: colors.radius,
                borderColor: colors.border,
              },
            ]}
          >
            <ActivityIndicator size="small" color={colors.mutedForeground} />
          </View>
        </View>
      )}

      {/* Input */}
      <View
        style={[
          ch.inputArea,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <TextInput
          style={[
            ch.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              color: colors.foreground,
              fontFamily: "Inter_400Regular",
            },
          ]}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message…"
          placeholderTextColor={colors.mutedForeground}
          multiline
          maxLength={1000}
          onSubmitEditing={sendMessage}
          blurOnSubmit
        />
        <Pressable
          style={({ pressed }) => [
            ch.send,
            {
              backgroundColor:
                input.trim() && !loading
                  ? colors.primary
                  : colors.tints.mint,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
          accessibilityLabel="Send message"
        >
          <Feather
            name="send"
            size={18}
            color={
              input.trim() && !loading
                ? colors.primaryForeground
                : colors.mutedForeground
            }
          />
        </Pressable>
      </View>
    </View>
  );
}

// ─── Custom scenario form panel ──────────────────────────────────────────────

function CustomScenarioPanel({ onStart, onBack }: {
  onStart: (title: string, rolePrompt: string) => void;
  onBack: () => void;
}) {
  const colors = useColors();
  const [setting, setSetting] = useState("");
  const [person, setPerson] = useState("");
  const [skill, setSkill] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const canSubmit = setting.trim() && person.trim() && skill.trim() && difficulty;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const rolePrompt = buildRolePrompt(setting, person, skill, difficulty!, additionalInfo);
    onStart(setting, rolePrompt);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={[ch.header, { borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <Pressable onPress={onBack} style={ch.back} accessibilityRole="button" accessibilityLabel="Back">
          <Feather name="arrow-left" size={18} color={colors.primary} />
        </Pressable>
        <View style={ch.headerText}>
          <Text style={[ch.headerTitle, { color: colors.foreground }]}>Custom scenario</Text>
          <Text style={[ch.headerSub, { color: colors.mutedForeground }]}>Build a session around your own situation</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={cs.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[cs.introCard, { backgroundColor: colors.primary + "18", borderRadius: colors.radius }]}>
          <Feather name="edit-3" size={16} color={colors.primary} style={{ marginRight: 10, marginTop: 1 }} />
          <Text style={[cs.introText, { color: colors.foreground }]}>
            Answer a few quick questions and we'll set up a personalised practice session for you.
          </Text>
        </View>

        <QuestionBlock number={1} label="What is the setting?" colors={colors}>
          <TextInput
            style={[cs.textInput, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, color: colors.foreground }]}
            value={setting} onChangeText={setSetting}
            placeholder="e.g. a friend's catered wedding, an office celebration, Grandma's holiday table"
            placeholderTextColor={colors.mutedForeground} multiline maxLength={300}
          />
        </QuestionBlock>

        <QuestionBlock number={2} label="Who should the chatbot play?" colors={colors}>
          <TextInput
            style={[cs.textInput, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, color: colors.foreground }]}
            value={person} onChangeText={setPerson}
            placeholder="e.g. a caterer, a relative, a well-meaning partner, a skeptical coworker"
            placeholderTextColor={colors.mutedForeground} multiline maxLength={200}
          />
        </QuestionBlock>

        <QuestionBlock number={3} label="What skill are you practicing?" colors={colors}>
          <TextInput
            style={[cs.textInput, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, color: colors.foreground }]}
            value={skill} onChangeText={setSkill}
            placeholder="e.g. explaining cross-contact to a stranger, holding my ground when people are doubtful"
            placeholderTextColor={colors.mutedForeground} multiline maxLength={300}
          />
        </QuestionBlock>

        <QuestionBlock number={4} label="Select a difficulty level." colors={colors}>
          <View style={cs.difficultyGrid}>
            {DIFFICULTIES.map((d) => {
              const selected = difficulty === d.id;
              return (
                <Pressable
                  key={d.id}
                  onPress={() => setDifficulty(d.id)}
                  style={({ pressed }) => [
                    cs.difficultyCard,
                    { backgroundColor: selected ? colors.primary + "18" : colors.card, borderColor: selected ? colors.primary : colors.border, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                >
                  <View style={cs.difficultyIconRow}>
                    <View style={cs.difficultyIconLabel}>
                      <Feather name={d.icon as any} size={15} color={selected ? colors.primary : colors.mutedForeground} />
                      <Text style={[cs.difficultyLabel, { color: selected ? colors.primary : colors.foreground }]}>{d.label}</Text>
                    </View>
                    {selected && <View style={[cs.selectedDot, { backgroundColor: colors.primary }]} />}
                  </View>
                  <Text style={[cs.difficultyTagline, { color: colors.mutedForeground }]}>{d.tagline}</Text>
                  <Text style={[cs.difficultyDesc, { color: colors.mutedForeground }]}>{d.description}</Text>
                </Pressable>
              );
            })}
          </View>
        </QuestionBlock>

        <QuestionBlock number={5} label="Any additional details?" optional colors={colors}>
          <TextInput
            style={[cs.textInput, cs.textInputTall, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius, color: colors.foreground }]}
            value={additionalInfo} onChangeText={setAdditionalInfo}
            placeholder="e.g. I'm preparing for an upcoming event, I'd like the bot to start with a specific line"
            placeholderTextColor={colors.mutedForeground} multiline maxLength={600} textAlignVertical="top"
          />
          <Text style={[cs.charCount, { color: colors.mutedForeground }]}>{additionalInfo.length}/600</Text>
        </QuestionBlock>

        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit}
          style={({ pressed }) => [
            cs.submitButton,
            { backgroundColor: canSubmit ? colors.primary : colors.card, borderRadius: colors.radius, borderWidth: canSubmit ? 0 : 1, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Start custom scenario"
          accessibilityState={{ disabled: !canSubmit }}
        >
          <Feather name="play" size={16} color={canSubmit ? colors.primaryForeground : colors.mutedForeground} style={{ marginRight: 8 }} />
          <Text style={[cs.submitText, { color: canSubmit ? colors.primaryForeground : colors.mutedForeground }]}>
            Start scenario
          </Text>
        </Pressable>

        {!canSubmit && (
          <Text style={[cs.requiredNote, { color: colors.mutedForeground }]}>Questions 1–4 are required to start.</Text>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Left-column scenario card ────────────────────────────────────────────────

const MODE_TINT_MAP: Record<string, keyof ReturnType<typeof useColors>["tints"]> =
  { mint: "mint", lemon: "lemon", rose: "rose" };

function ScenarioCard({
  item,
  isSelected,
  onPress,
}: {
  item: Scenario;
  isSelected: boolean;
  onPress: () => void;
}) {
  const colors = useColors();
  const colorScheme = useColorScheme();
  return (
    <Pressable
      style={({ pressed }) => [
        lc.card,
        {
          backgroundColor: isSelected
            ? colors.primary + "14"
            : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
          borderRadius: colors.radius,
          opacity: pressed ? 0.9 : 1,
        },
      ]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <Text style={[lc.cardTitle, { color: colors.foreground }]}>
        {item.title}
      </Text>
      <Text style={[lc.cardDesc, { color: colors.mutedForeground }]}>
        {item.description}
      </Text>
      {item.modes && item.modes.length > 0 && (
        <View style={lc.chips}>
          {item.modes.map((mode) => {
            const tintKey = MODE_TINT_MAP[mode.tint] ?? "mint";
            return (
              <View
                key={mode.id}
                style={[
                  lc.chip,
                  {
                    backgroundColor: colors.tints[tintKey],
                    borderRadius: 20,
                    borderWidth: colorScheme === "dark" ? 0.5 : 0,
                    borderColor: "rgba(255,255,255,0.35)",
                  },
                ]}
              >
                <Feather
                  name={mode.icon as any}
                  size={11}
                  color={colors.foreground}
                  style={{ marginRight: 4 }}
                />
                <Text style={[lc.chipText, { color: colors.foreground }]}>
                  {mode.label}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </Pressable>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────

export function DesktopChatbotLayout({
  visibleScenarios,
  topPad,
}: {
  visibleScenarios: Scenario[];
  topPad: number;
}) {
  const colors = useColors();
  const { state } = useAppState();
  const router = useRouter();

  const [panel, setPanel] = useState<RightPanel>({ kind: "empty" });
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleScenarioPress = (item: Scenario) => {
    setSelectedId(item.id);
    if (item.modes && item.modes.length > 0) {
      setPanel({ kind: "modes", scenario: item });
    } else {
      setPanel({ kind: "chat", scenario: item });
    }
  };

  const handleModeSelect = (scenario: Scenario, mode: ScenarioMode) => {
    setPanel({ kind: "chat", scenario, mode });
  };

  const handleChatBack = (scenario: Scenario) => {
    if (scenario.modes && scenario.modes.length > 0) {
      setPanel({ kind: "modes", scenario });
    } else {
      setPanel({ kind: "empty" });
      setSelectedId(null);
    }
  };

  // Top padding for right panel to clear the hamburger button
  // Hamburger sits at top: 67+12=79, height: 40 → bottom at ~119px
  const RIGHT_TOP = topPad + 72;

  return (
    <View style={[layout.root, { backgroundColor: colors.background }]}>
      {/* ── Left column ── */}
      <View
        style={[
          layout.left,
          { borderRightColor: colors.border },
        ]}
      >
        <FlatList
          data={visibleScenarios}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ScenarioCard
              item={item}
              isSelected={selectedId === item.id}
              onPress={() => handleScenarioPress(item)}
            />
          )}
          contentContainerStyle={[lc.list, { paddingBottom: 40 }]}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Compact header */}
              <View
                style={[
                  lc.header,
                  {
                    paddingTop: topPad + 20,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    lc.heroBadge,
                    {
                      backgroundColor: colors.primary + "22",
                    },
                  ]}
                >
                  <Feather
                    name="smile"
                    size={13}
                    color={colors.primary}
                    style={{ marginRight: 5 }}
                  />
                  <Text
                    style={[lc.heroBadgeText, { color: colors.primary }]}
                  >
                    AI chatbot
                  </Text>
                </View>
                <Text
                  style={[lc.headerTitle, { color: colors.foreground }]}
                >
                  Chat Practice
                </Text>
              </View>

              {/* Custom scenario card */}
              <Pressable
                onPress={() => { setPanel({ kind: "custom-form" }); setSelectedId(null); }}
                style={({ pressed }) => [
                  lc.customCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.primary,
                    borderRadius: colors.radius,
                    opacity: pressed ? 0.88 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel="Create a custom scenario"
              >
                <View
                  style={[
                    lc.customIcon,
                    { backgroundColor: colors.primary + "18" },
                  ]}
                >
                  <Feather name="edit-3" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={[lc.customTitle, { color: colors.foreground }]}
                  >
                    Custom scenario
                  </Text>
                  <Text
                    style={[lc.customDesc, { color: colors.mutedForeground }]}
                  >
                    Build a session around your own situation.
                  </Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={16}
                  color={colors.mutedForeground}
                />
              </Pressable>

              <Text
                style={[lc.sectionLabel, { color: colors.foreground }]}
              >
                Example scenarios
              </Text>
            </>
          }
        />
      </View>

      {/* ── Right column ── */}
      <View style={layout.right}>
        {panel.kind === "empty" && (
          <View style={{ flex: 1, paddingTop: RIGHT_TOP }}>
            <EmptyPanel />
          </View>
        )}

        {panel.kind === "modes" && (
          <View style={[layout.rightInner, { paddingTop: RIGHT_TOP }]}>
            <ModePicker
              scenario={panel.scenario}
              onSelect={(mode) => handleModeSelect(panel.scenario, mode)}
            />
          </View>
        )}

        {panel.kind === "chat" && (
          <View style={[layout.rightInner, { paddingTop: RIGHT_TOP }]}>
            <ChatPanel
              key={`${panel.scenario.id}-${panel.mode?.id ?? "nomode"}`}
              scenario={panel.scenario}
              mode={panel.mode}
              onBack={() => handleChatBack(panel.scenario)}
            />
          </View>
        )}

        {panel.kind === "custom-form" && (
          <View style={[layout.rightInner, { paddingTop: RIGHT_TOP }]}>
            <CustomScenarioPanel
              onBack={() => setPanel({ kind: "empty" })}
              onStart={(title, rolePrompt) =>
                setPanel({ kind: "custom-chat", title, rolePrompt })
              }
            />
          </View>
        )}

        {panel.kind === "custom-chat" && (
          <View style={[layout.rightInner, { paddingTop: RIGHT_TOP }]}>
            <ChatPanel
              key={`custom-${panel.title}`}
              customTitle={panel.title}
              customRolePrompt={panel.rolePrompt}
              onBack={() => setPanel({ kind: "custom-form" })}
            />
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Custom-scenario form styles ─────────────────────────────────────────────

const cs = StyleSheet.create({
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40, gap: 28 },
  introCard: { flexDirection: "row", alignItems: "flex-start", padding: 14 },
  introText: { fontFamily: "Inter_400Regular", fontSize: 14, lineHeight: 21, flex: 1 },
  questionBlock: { gap: 12 },
  questionLabelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  questionBadge: { width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  questionNumber: { fontFamily: "Inter_700Bold", fontSize: 12 },
  questionLabel: { fontFamily: "Inter_600SemiBold", fontSize: 15, flex: 1 },
  optionalTag: { fontFamily: "Inter_400Regular", fontSize: 12, fontStyle: "italic" },
  textInput: {
    borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 22, minHeight: 80,
  },
  textInputTall: { minHeight: 100 },
  charCount: { fontFamily: "Inter_400Regular", fontSize: 12, textAlign: "right", marginTop: -4 },
  difficultyGrid: { flexDirection: "column", gap: 10 },
  difficultyCard: { borderWidth: 1.5, padding: 12, gap: 4 },
  difficultyIconRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  difficultyIconLabel: { flexDirection: "row", alignItems: "center", gap: 7 },
  selectedDot: { width: 7, height: 7, borderRadius: 4 },
  difficultyLabel: { fontFamily: "Inter_700Bold", fontSize: 14 },
  difficultyTagline: { fontFamily: "Inter_600SemiBold", fontSize: 11, letterSpacing: 0.2 },
  difficultyDesc: { fontFamily: "Inter_400Regular", fontSize: 12, lineHeight: 17, marginTop: 4 },
  submitButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 16, marginTop: 4 },
  submitText: { fontFamily: "Inter_700Bold", fontSize: 16 },
  requiredNote: { fontFamily: "Inter_400Regular", fontSize: 13, textAlign: "center", marginTop: -16 },
});

// ─── Styles ──────────────────────────────────────────────────────────────────

const layout = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "row",
  },
  left: {
    width: 360,
    borderRightWidth: 1,
  },
  right: {
    flex: 1,
  },
  rightInner: {
    flex: 1,
  },
});

// Left column
const lc = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  header: {
    paddingBottom: 20,
    marginBottom: 8,
    borderBottomWidth: 1,
    gap: 8,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  heroBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
  },
  customCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 2,
  },
  customIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  customTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
  },
  customDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    lineHeight: 17,
  },
  sectionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    paddingVertical: 12,
    paddingTop: 16,
  },
  card: {
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 15,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  chipText: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
  },
});

// Right panel — mode picker
const rp = StyleSheet.create({
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
  },
  modeContent: {
    paddingHorizontal: 32,
    gap: 8,
  },
  modeTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 32,
    marginBottom: 4,
  },
  modeSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  modeCards: {
    gap: 12,
  },
  modeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderWidth: 1,
    gap: 14,
  },
  modeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  modeText: { flex: 1, gap: 4 },
  modeLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  modeDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
});

// Right panel — chat
const ch = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  back: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  headerText: { flex: 1, gap: 2 },
  headerTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
  headerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    gap: 12,
  },
  disclaimer: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    marginVertical: 4,
  },
  disclaimerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    flex: 1,
  },
  row: { flexDirection: "row" },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleText: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 23,
  },
  loadingRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginBottom: 4,
  },
  loadingBubble: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 1,
  },
  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    maxHeight: 120,
  },
  send: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
