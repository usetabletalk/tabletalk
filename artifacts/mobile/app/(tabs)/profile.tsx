import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  Pressable,
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
import type { ThemeMode } from "@/contexts/AppStateContext";
import { WebContainer } from "@/components/WebContainer";

import { ACCENT_OPTIONS } from "@/constants/colors";
import type { AccentKey } from "@/constants/colors";

type DietaryOption = { id: string; label: string };

const DIETARY_OPTIONS: DietaryOption[] = [
  { id: "celiac", label: "Celiac" },
  { id: "dairy", label: "Dairy Allergy" },
  { id: "egg", label: "Egg Allergy" },
  { id: "fish", label: "Fish Allergy" },
  { id: "shellfish", label: "Shellfish Allergy" },
  { id: "soy", label: "Soy Allergy" },
  { id: "sesame", label: "Sesame Allergy" },
  { id: "wheat", label: "Wheat Allergy" },
  { id: "peanut", label: "Peanut Allergy" },
  { id: "tree-nut", label: "Tree Nut Allergy" },
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
];

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: "sun" | "moon" | "monitor" }[] = [
  { value: "light", label: "Light", icon: "sun" },
  { value: "dark", label: "Dark", icon: "moon" },
  { value: "system", label: "System", icon: "monitor" },
];

const ACCENT_KEYS = Object.keys(ACCENT_OPTIONS) as AccentKey[];

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, updateProfile, updateThemeMode, updateAccentColor, toggleDietaryRestriction, isLoaded } = useAppState();

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
    saveTimer.current = setTimeout(() => {
      updateProfile({ userName: newName, userPronouns: newPronouns });
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

  const handleThemeChange = (mode: ThemeMode) => {
    updateThemeMode(mode);
  };

  const handleAccentChange = (key: AccentKey) => {
    updateAccentColor(key);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
    <WebContainer>
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: (Platform.OS === "web" ? 50 : insets.top) + 24,
          paddingBottom: insets.bottom + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
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

      {/* Dietary restrictions section */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Dietary Restrictions</Text>
        <View
          style={[
            styles.checkboxCard,
            { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          ]}
        >
          {DIETARY_OPTIONS.map((option, index) => {
            const isChecked = (state.dietaryRestrictions ?? []).includes(option.id);
            const isLast = index === DIETARY_OPTIONS.length - 1;
            return (
              <Pressable
                key={option.id}
                onPress={() => toggleDietaryRestriction(option.id)}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isChecked }}
                accessibilityLabel={option.label}
                style={[
                  styles.checkboxRow,
                  !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
                ]}
              >
                <View
                  style={[
                    styles.checkbox,
                    {
                      borderColor: isChecked ? colors.primary : colors.border,
                      backgroundColor: isChecked ? colors.primary : "transparent",
                      borderRadius: colors.radius - 4,
                    },
                  ]}
                >
                  {isChecked && <Feather name="check" size={13} color="#fff" />}
                </View>
                <Text
                  style={[
                    styles.checkboxLabel,
                    {
                      color: colors.foreground,
                      fontFamily: isChecked ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Appearance section */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Appearance</Text>
        <View
          style={[
            styles.segmentedControl,
            {
              backgroundColor: colors.muted,
              borderRadius: colors.radius,
              borderColor: colors.border,
            },
          ]}
        >
          {THEME_OPTIONS.map((option) => {
            const isActive = state.themeMode === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => handleThemeChange(option.value)}
                style={[
                  styles.segment,
                  {
                    borderRadius: colors.radius - 2,
                    backgroundColor: isActive ? colors.card : "transparent",
                  },
                  isActive && styles.segmentActive,
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${option.label} theme`}
              >
                <Feather
                  name={option.icon}
                  size={14}
                  color={isActive ? colors.primary : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.segmentLabel,
                    {
                      color: isActive ? colors.foreground : colors.mutedForeground,
                      fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Accent color section */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.mutedForeground }]}>Accent Color</Text>
        <View style={styles.swatchRow}>
          {ACCENT_KEYS.map((key) => {
            const accent = ACCENT_OPTIONS[key];
            const isActive = state.accentColor === key;
            return (
              <Pressable
                key={key}
                onPress={() => handleAccentChange(key)}
                accessibilityRole="radio"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`${accent.label} accent color`}
                style={styles.swatchWrapper}
              >
                <View
                  style={[
                    styles.swatch,
                    { backgroundColor: accent.light },
                    isActive && {
                      borderWidth: 3,
                      borderColor: colors.foreground,
                    },
                  ]}
                >
                  {isActive && (
                    <Feather name="check" size={14} color={accent.foreground} />
                  )}
                </View>
                <Text
                  style={[
                    styles.swatchLabel,
                    {
                      color: isActive ? colors.foreground : colors.mutedForeground,
                      fontFamily: isActive ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {accent.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </ScrollView>
    </WebContainer>
    </View>
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
  segmentedControl: {
    flexDirection: "row",
    borderWidth: 1,
    padding: 3,
    gap: 2,
  },
  segment: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  segmentActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  segmentLabel: {
    fontSize: 14,
  },
  swatchRow: {
    flexDirection: "row",
    gap: 12,
  },
  swatchWrapper: {
    alignItems: "center",
    gap: 6,
  },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  swatchLabel: {
    fontSize: 12,
  },
  checkboxCard: {
    borderWidth: 1,
    overflow: "hidden",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  checkboxLabel: {
    fontSize: 15,
    flex: 1,
  },
});
