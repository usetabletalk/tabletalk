import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View, useColorScheme, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { useAppState } from "@/contexts/AppStateContext";
import { SCENARIOS } from "@/data/scenarios";
import { WebContainer } from "@/components/WebContainer";
import { DesktopChatbotLayout } from "@/components/DesktopChatbotLayout";


const sortKey = (title: string) =>
  title.replace(/^(a|the)\s+/i, "").toLowerCase();

const MODE_TINT_MAP: Record<string, keyof ReturnType<typeof useColors>["tints"]> = {
  mint: "mint",
  lemon: "lemon",
  rose: "rose",
};

export default function ChatbotScreen() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { state } = useAppState();
  const { width } = useWindowDimensions();
  const restrictions = state.dietaryRestrictions ?? [];

  const isDesktop = Platform.OS === "web" && width >= 768;

  const visibleScenarios = [...SCENARIOS]
    .filter((s) => {
      if (s.id === "too-much-detail") return restrictions.includes("celiac");
      return true;
    })
    .sort((a, b) => sortKey(a.title).localeCompare(sortKey(b.title)));

  const topPad = Platform.OS === "web" ? 50 : insets.top;

  if (isDesktop) {
    return (
      <DesktopChatbotLayout
        visibleScenarios={visibleScenarios}
        topPad={topPad}
      />
    );
  }

  const handleCardPress = (item: typeof SCENARIOS[0]) => {
    if (item.modes && item.modes.length > 0) {
      router.push(`/chatbot/${item.id}`);
    } else {
      router.push(`/chatbot/chat?scenarioId=${item.id}`);
    }
  };

  const handleCustomScenario = () => {
    router.push("/chatbot/custom-scenario");
  };

  const renderItem = ({ item }: { item: typeof SCENARIOS[0] }) => {
    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            borderRadius: colors.radius,
            borderColor: colors.border,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        onPress={() => handleCardPress(item)}
      >
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          {item.title}
        </Text>
        <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>
          {item.description}
        </Text>

        {item.modes && item.modes.length > 0 && (
          <View style={styles.modesRow}>
            {item.modes.map((mode) => {
              const tintKey = MODE_TINT_MAP[mode.tint] ?? "mint";
              return (
                <View
                  key={mode.id}
                  style={[
                    styles.modeChip,
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
                  <Text style={[styles.modeLabel, { color: colors.foreground }]}>
                    {mode.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <WebContainer>
      <FlatList
        style={{ flex: 1 }}
        data={visibleScenarios}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        ListHeaderComponent={
          <>
            <View style={[styles.hero, { backgroundColor: colors.primary, paddingTop: topPad + 28 }]}>
              <View style={[styles.heroBadge, { backgroundColor: colors.primaryForeground + "22" }]}>
                <Feather name="smile" size={14} color={colors.primaryForeground} style={{ marginRight: 5 }} />
                <Text style={[styles.heroBadgeText, { color: colors.primaryForeground }]}>
                  AI chatbot
                </Text>
              </View>
              <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>
                Chat Practice
              </Text>
              <Text style={[styles.heroSubtitle, { color: colors.primaryForeground }]}>
                Choose a scenario and practice with an AI that responds like a real person.
              </Text>
            </View>

            {/* Custom scenario module */}
            <Pressable
              onPress={handleCustomScenario}
              style={({ pressed }) => [
                styles.customCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.primary,
                  borderRadius: colors.radius,
                  opacity: pressed ? 0.88 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Create a custom scenario"
            >
              <View style={[styles.customIconWrapper, { backgroundColor: colors.primary + "18" }]}>
                <Feather name="edit-3" size={22} color={colors.primary} />
              </View>
              <View style={styles.customCardBody}>
                <Text style={[styles.customCardTitle, { color: colors.foreground }]}>
                  Create a custom scenario
                </Text>
                <Text style={[styles.customCardDesc, { color: colors.mutedForeground }]}>
                  Describe a real situation you're facing and we'll build a practice session around it.
                </Text>
              </View>
              <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
            </Pressable>

            {/* Section label */}
            <View style={styles.sectionLabel}>
              <Text style={[styles.sectionLabelTitle, { color: colors.foreground }]}>
                Try out these example scenarios
              </Text>
            </View>
          </>
        }
      />
      </WebContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingTop: 0,
  },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    marginBottom: 24,
    marginHorizontal: -20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  heroBadgeText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  heroTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 30,
    marginBottom: 8,
    lineHeight: 36,
  },
  heroSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.88,
  },
  customCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  customIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  customCardBody: {
    flex: 1,
    gap: 3,
  },
  customCardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  customCardDesc: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    lineHeight: 19,
  },
  sectionLabel: {
    paddingVertical: 14,
    marginTop: 8,
  },
  sectionLabelTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
  },
  card: {
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    marginBottom: 6,
  },
  cardDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 14,
  },
  modesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  modeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  modeLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
  },
});
