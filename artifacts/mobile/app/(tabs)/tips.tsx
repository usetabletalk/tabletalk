import React, { useMemo } from "react";
import { FlatList, Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useAppState } from "@/contexts/AppStateContext";
import { CATEGORIES, TIPS, Tip } from "@/data/tips";

export default function TipsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, toggleSavedTip } = useAppState();

  const sections = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      title: cat.label,
      icon: cat.icon,
      data: TIPS.filter((t) => t.categoryId === cat.id),
    })).filter((s) => s.data.length > 0);
  }, []);

  const renderItem = ({ item }: { item: Tip }) => {
    const isSaved = state.savedTips.includes(item.id);

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: item.isImportant ? colors.primary : colors.border,
            borderWidth: item.isImportant ? 2 : 1,
            borderRadius: colors.radius,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.cardForeground }]}>
            {item.title}
          </Text>
          <Pressable
            style={styles.saveButton}
            onPress={() => toggleSavedTip(item.id)}
            hitSlop={8}
          >
            <Feather
              name="heart"
              size={20}
              color={isSaved ? colors.primary : colors.mutedForeground}
              style={isSaved ? styles.savedIcon : undefined}
            />
          </Pressable>
        </View>
        <Text style={[styles.cardContent, { color: colors.mutedForeground }]}>
          {item.content}
        </Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title, icon } }: any) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <Feather name={icon} size={20} color={colors.foreground} />
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
        stickySectionHeadersEnabled={false}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Tips & Tricks
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Essential knowledge for staying safe, written plainly.
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    flex: 1,
    paddingRight: 16,
  },
  cardContent: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 24,
  },
  saveButton: {
    padding: 4,
  },
  savedIcon: {
    fill: "currentColor",
  },
});
