import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColors } from "@/hooks/useColors";
import { SCENARIOS } from "@/data/scenarios";

const sortKey = (title: string) =>
  title.replace(/^(a|the)\s+/i, "").toLowerCase();

const SORTED_SCENARIOS = [...SCENARIOS].sort((a, b) =>
  sortKey(a.title).localeCompare(sortKey(b.title))
);

const MODE_TINT_MAP: Record<string, keyof ReturnType<typeof useColors>["tints"]> = {
  mint: "mint",
  lemon: "lemon",
  rose: "rose",
};

export default function PracticeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();

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
        onPress={() => router.push(`/scenario/${item.id}`)}
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
                    },
                  ]}
                >
                  <Feather
                    name={mode.icon as any}
                    size={11}
                    color={colors.mutedForeground}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={[styles.modeLabel, { color: colors.mutedForeground }]}>
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

  const topPad = Platform.OS === "web" ? 50 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <FlatList
        data={SORTED_SCENARIOS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        ListHeaderComponent={
          <View style={[styles.hero, { backgroundColor: colors.primary }]}>
            <View style={[styles.heroBadge, { backgroundColor: colors.primaryForeground + "22" }]}>
              <Feather name="message-circle" size={14} color={colors.primaryForeground} style={{ marginRight: 5 }} />
              <Text style={[styles.heroBadgeText, { color: colors.primaryForeground }]}>
                Role-play practice
              </Text>
            </View>
            <Text style={[styles.heroTitle, { color: colors.primaryForeground }]}>
              Practice Conversations
            </Text>
            <Text style={[styles.heroSubtitle, { color: colors.primaryForeground }]}>
              Rehearse tricky real-life situations in a safe space — before they happen.
            </Text>
          </View>
        }
      />
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
    paddingTop: 28,
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
