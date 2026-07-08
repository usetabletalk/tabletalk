import { useRouter } from "expo-router";
import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
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

  const renderItem = ({ item }: { item: typeof SCENARIOS[0] }) => {
    const isCompleted = state.completedScenarios.includes(item.id);

    return (
      <Pressable
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderRadius: colors.radius,
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
        onPress={() => router.push(`/scenario/${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.cardForeground }]}>
            {item.title}
          </Text>
          {isCompleted && (
            <View style={[styles.completedBadge, { backgroundColor: colors.accent }]}>
              <Feather name="check" size={12} color={colors.accentForeground} />
            </View>
          )}
        </View>
        <Text style={[styles.cardDescription, { color: colors.mutedForeground }]}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <Feather name="clock" size={14} color={colors.mutedForeground} />
          <Text style={[styles.cardTime, { color: colors.mutedForeground }]}>
            {item.estimatedMinutes} mins
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={SCENARIOS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Practice Conversations
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
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
  },
  header: {
    marginBottom: 24,
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
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    flex: 1,
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
