import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";
import { SCENARIOS } from "@/data/scenarios";
import { ROLE_PROMPTS } from "@/data/rolePrompts";
import { useAppState } from "@/contexts/AppStateContext";

type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "disclaimer" | "debrief" | "advice";
  content: string;
};

const DEBRIEF_MARKER = "[DEBRIEF]";
const ADVICE_OPEN = "[ADVICE]";
const ADVICE_CLOSE = "[/ADVICE]";

type ParsedPart = { role: "assistant" | "debrief" | "advice"; content: string };

/** Splits a raw AI response into display segments.
 *  - [ADVICE]...[/ADVICE] blocks → green advice bubbles
 *  - [DEBRIEF] marker → mint debrief bubble (everything after it)
 *  - All other text → white assistant bubbles */
function parseResponse(raw: string): ParsedPart[] {
  // Split off [DEBRIEF] tail first
  const debriefIdx = raw.indexOf(DEBRIEF_MARKER);
  const mainText = debriefIdx === -1 ? raw : raw.slice(0, debriefIdx).trimEnd();
  const debriefText = debriefIdx === -1 ? "" : raw.slice(debriefIdx + DEBRIEF_MARKER.length).trimStart();

  // Parse [ADVICE]...[/ADVICE] blocks within mainText
  const parts: ParsedPart[] = [];
  let cursor = 0;
  while (cursor < mainText.length) {
    const openIdx = mainText.indexOf(ADVICE_OPEN, cursor);
    if (openIdx === -1) break;
    const closeIdx = mainText.indexOf(ADVICE_CLOSE, openIdx + ADVICE_OPEN.length);
    if (closeIdx === -1) break;

    const before = mainText.slice(cursor, openIdx).trim();
    if (before) parts.push({ role: "assistant", content: before });

    const advice = mainText.slice(openIdx + ADVICE_OPEN.length, closeIdx).trim();
    if (advice) parts.push({ role: "advice", content: advice });

    cursor = closeIdx + ADVICE_CLOSE.length;
  }

  const remaining = mainText.slice(cursor).trim();
  if (remaining) parts.push({ role: "assistant", content: remaining });
  if (debriefText) parts.push({ role: "debrief", content: debriefText });

  return parts.length > 0 ? parts : [{ role: "assistant", content: raw.trim() }];
}

const DISCLAIMER =
  "Not a doctor or dietitian — always verify specific foods yourself.\n\nTip: type [anything in brackets] to step outside the scene and talk to me directly.";

const API_BASE = Platform.OS === "web" ? "/api" : (process.env.EXPO_PUBLIC_API_URL ?? "/api");

export default function ChatbotChatScreen() {
  const { scenarioId, modeId, customTitle, customRolePrompt } = useLocalSearchParams<{
    scenarioId?: string;
    modeId?: string;
    customTitle?: string;
    customRolePrompt?: string;
  }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const { state: appState } = useAppState();

  const isCustom = !!customTitle;

  const scenario = isCustom ? undefined : SCENARIOS.find((s) => s.id === scenarioId);
  const mode = scenario?.modes?.find((m) => m.id === modeId);

  const rolePromptKey = modeId ? `${scenarioId}:${modeId}` : scenarioId ?? "";
  const builtInRolePrompt = ROLE_PROMPTS[rolePromptKey];
  const effectiveRolePrompt = isCustom ? customRolePrompt : builtInRolePrompt;
  const displayTitle = isCustom ? (customTitle ?? "Custom Scenario") : (scenario?.title ?? "Chat");

  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([
    { id: "disclaimer", role: "disclaimer", content: DISCLAIMER },
  ]);
  const [apiHistory, setApiHistory] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const openingFired = useRef(false);

  const callApi = async (
    history: Array<{ role: "user" | "assistant"; content: string }>
  ): Promise<string> => {
    const res = await fetch(`${API_BASE}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: history,
        scenarioTitle: displayTitle,
        modeLabel: mode?.label,
        rolePrompt: effectiveRolePrompt,
        userName: appState.userName || undefined,
        userPronouns: appState.userPronouns || undefined,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as { response: string };
    return data.response;
  };

  // Trigger the AI's opening line when the screen mounts with a scenario
  useEffect(() => {
    if ((!scenarioId && !isCustom) || openingFired.current) return;
    openingFired.current = true;
    setLoading(true);
    const openingHistory: Array<{ role: "user" | "assistant"; content: string }> = [
      { role: "user", content: "[begin]" },
    ];
    callApi(openingHistory)
      .then((response) => {
        const parts = parseResponse(response);
        const newMsgs: ChatMessage[] = parts.map((p, i) => ({
          id: `opening-${i}`,
          role: p.role,
          content: p.content,
        }));
        setDisplayMessages((prev) => [...prev, ...newMsgs]);
        setApiHistory([...openingHistory, { role: "assistant", content: response }]);
      })
      .catch(() => {
        setDisplayMessages((prev) => [
          ...prev,
          { id: "opening-err", role: "assistant", content: "Couldn't start the scene. Please try again." },
        ]);
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
      });
  }, [scenarioId]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text };
    const nextHistory = [...apiHistory, { role: "user" as const, content: text }];

    setDisplayMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 50);

    try {
      const response = await callApi(nextHistory);
      const parts = parseResponse(response);
      const ts = Date.now();
      const newMsgs: ChatMessage[] = parts.map((p, i) => ({
        id: `${ts + i}`,
        role: p.role,
        content: p.content,
      }));
      setDisplayMessages((prev) => [...prev, ...newMsgs]);
      setApiHistory([...nextHistory, { role: "assistant", content: response }]);
    } catch {
      setDisplayMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderItem = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === "user";
    const isDisclaimer = item.role === "disclaimer";
    const isDebrief = item.role === "debrief";

    if (isDisclaimer) {
      return (
        <View style={[styles.disclaimerBubble, { backgroundColor: colors.tints.mint, borderRadius: colors.radius }]}>
          <Feather name="info" size={14} color={colors.mutedForeground} style={{ marginTop: 2, flexShrink: 0 }} />
          <Text style={[styles.disclaimerText, { color: colors.foreground }]}>{item.content}</Text>
        </View>
      );
    }

    if (isDebrief) {
      return (
        <View style={[styles.disclaimerBubble, { backgroundColor: colors.tints.mint, borderRadius: colors.radius }]}>
          <Feather name="check-circle" size={14} color={colors.mutedForeground} style={{ marginTop: 2, flexShrink: 0 }} />
          <Text style={[styles.disclaimerText, { color: colors.foreground }]}>{item.content}</Text>
        </View>
      );
    }

    if (item.role === "advice") {
      return (
        <View style={[styles.disclaimerBubble, { backgroundColor: colors.tints.mint, borderRadius: colors.radius }]}>
          <Feather name="message-circle" size={14} color={colors.accent} style={{ marginTop: 2, flexShrink: 0 }} />
          <Text style={[styles.disclaimerText, { color: colors.accent }]}>{item.content}</Text>
        </View>
      );
    }

    return (
      <View style={[styles.messageRow, { justifyContent: isUser ? "flex-end" : "flex-start" }]}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isUser ? colors.primary : colors.card,
              borderRadius: colors.radius,
              borderWidth: isUser ? 0 : 1,
              borderColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.bubbleText, { color: isUser ? colors.primaryForeground : colors.foreground }]}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <Stack.Screen
        options={{
          headerTitle: () => (
            <View style={styles.headerTitleContainer}>
              <Text style={[styles.headerTitleMain, { color: colors.foreground }]} numberOfLines={1}>
                {displayTitle}
              </Text>
              {mode?.label ? (
                <Text style={[styles.headerTitleSub, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {mode.label}
                </Text>
              ) : null}
            </View>
          ),
          headerTitleAlign: "center",
        }}
      />
      <FlatList
        ref={flatListRef}
        data={displayMessages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 16, paddingTop: Platform.OS === "web" ? 16 : 8 },
        ]}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {loading && (
        <View style={[styles.loadingRow, { paddingHorizontal: 20 }]}>
          <View style={[styles.loadingBubble, { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border }]}>
            <ActivityIndicator size="small" color={colors.mutedForeground} />
          </View>
        </View>
      )}

      <View
        style={[
          styles.inputArea,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingBottom: insets.bottom > 0 ? insets.bottom : 16,
          },
        ]}
      >
        <TextInput
          style={[
            styles.textInput,
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
          onSubmitEditing={Platform.OS === "web" ? sendMessage : undefined}
          blurOnSubmit={Platform.OS === "web"}
        />
        <Pressable
          style={({ pressed }) => [
            styles.sendButton,
            {
              backgroundColor: input.trim() && !loading ? colors.primary : colors.tints.mint,
              borderRadius: colors.radius,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
          onPress={sendMessage}
          disabled={!input.trim() || loading}
          accessibilityLabel="Send message"
        >
          <Feather name="send" size={18} color={input.trim() && !loading ? colors.primaryForeground : colors.mutedForeground} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerTitleContainer: {
    alignItems: "center",
    maxWidth: 180,
  },
  headerTitleMain: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
  },
  headerTitleSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    marginTop: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  disclaimerBubble: {
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
  messageRow: {
    flexDirection: "row",
  },
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleText: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
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
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
    maxHeight: 120,
  },
  sendButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
