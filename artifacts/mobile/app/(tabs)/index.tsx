import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useAppState } from "@/contexts/AppStateContext";
import { SCENARIOS } from "@/data/scenarios";

export default function PracticeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state } = useAppState();
  const router = useRouter();

  const renderItem = ({ item, index }: { item: typeof SCENARIOS[0]; index: number }) => {
    const isCompleted = state.completedScenarios.includes(item.id);
    const tintOptions = [colors.tints.lavender, colors.tints.sky, colors.tints.peach, colors.tints.mint];
    const cardTint = tintOptions[index % tintOptions.length];

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: cardTint,
            borderRadius: colors.radius,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        onPress={() => router.push(`/scenario/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
            <Feather name="message-circle" size={18} color={colors.foreground} />
          </View>
          {isCompleted && (
            <View style={[styles.completedBadge, { backgroundColor: colors.accent }]}>
              <Feather name="check" size={12} color={colors.accentForeground} />
            </View>
          )}
        </View>
        <Text style={[styles.cardTitle, { color: colors.foreground }]}>
          {item.title}
        </Text>
        <Text style={[styles.cardDescription, { color: colors.foreground, opacity: 0.8 }]}>
          {item.description}
        </Text>
        <View style={[styles.cardFooter, { backgroundColor: colors.background, borderRadius: colors.radius }]}>
          <Feather name="clock" size={14} color={colors.mutedForeground} />
          <Text style={[styles.cardTime, { color: colors.mutedForeground }]}>
            {item.estimatedMinutes} mins
          </Text>
        </View>
      </Pressable>
    );
  };

  const topPad = Platform.OS === "web" ? 50 : insets.top;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <FlatList
        data={SCENARIOS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        ListHeaderComponent={
          <View style={[styles.header, { backgroundColor: colors.secondary, paddingTop: 24 }]}>
            <Text style={[styles.title, { color: colors.secondaryForeground }]}>
              Practice Conversations
            </Text>
            <Text style={[styles.subtitle, { color: colors.secondaryForeground, opacity: 0.85 }]}>
              Rehearse difficult situations in a safe space before they happen.
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
    padding: 24,
    paddingTop: 0,
  },
  header: {
    padding: 24,
    marginBottom: 24,
    marginHorizontal: -24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    marginBottom: 8,
  },
  cardDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: "flex-start",
    gap: 6,
  },
  cardTime: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
