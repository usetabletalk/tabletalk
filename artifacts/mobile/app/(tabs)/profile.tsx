import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useAppState } from "@/contexts/AppStateContext";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateProfile, isLoaded } = useAppState();

  const [name, setName] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [saved, setSaved] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initialise fields once state has loaded from storage
  useEffect(() => {
    if (isLoaded) {
      setName(state.userName ?? "");
      setPronouns(state.userPronouns ?? "");
    }
  }, [isLoaded]);

  const scheduleAutoSave = (newName: string, newPronouns: string) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await updateProfile({ userName: newName, userPronouns: newPronouns });
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    }, 600);
  };

  const handleNameChange = (v: string) => {
    setName(v);
    scheduleAutoSave(v, pronouns);
  };

  const handlePronounsChange = (v: string) => {
    setPronouns(v);
    scheduleAutoSave(name, v);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + (Platform.OS === "web" ? 16 : 8),
          paddingBottom: insets.bottom + 32,
        },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.pageTitle, { color: colors.foreground }]}>Your Profile</Text>

      <View style={[styles.infoCard, { backgroundColor: colors.tints.mint, borderRadius: colors.radius }]}>
        <Feather name="info" size={14} color={colors.mutedForeground} style={{ marginTop: 2, flexShrink: 0 }} />
        <Text style={[styles.infoText, { color: colors.foreground }]}>
          This information is stored only on your device. The chatbot uses it to address you correctly during practice sessions.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              color: colors.foreground,
              fontFamily: "Inter_400Regular",
            },
          ]}
          placeholder="e.g. Jordan"
          placeholderTextColor={colors.mutedForeground}
          value={name}
          onChangeText={handleNameChange}
          autoCapitalize="words"
          autoCorrect={false}
          returnKeyType="next"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Pronouns</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderRadius: colors.radius,
              color: colors.foreground,
              fontFamily: "Inter_400Regular",
            },
          ]}
          placeholder="e.g. they/them, she/her, he/him"
          placeholderTextColor={colors.mutedForeground}
          value={pronouns}
          onChangeText={handlePronounsChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="done"
        />
      </View>

      {saved && (
        <View style={styles.savedRow}>
          <Feather name="check" size={13} color={colors.mutedForeground} />
          <Text style={[styles.savedText, { color: colors.mutedForeground }]}>Saved</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 20 },
  pageTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    marginBottom: 4,
  },
  infoCard: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
  },
  infoText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
    flex: 1,
  },
  section: { gap: 6 },
  label: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-start",
  },
  savedText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
  },
});
