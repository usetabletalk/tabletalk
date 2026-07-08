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
    return CATEGORIES.map((cat, index) => {
      const tintOptions = [colors.tints.rose, colors.tints.lemon, colors.tints.lavender, colors.tints.mint];
      const tint = tintOptions[index % tintOptions.length];
      return {
        title: cat.label,
        icon: cat.icon,
        tint,
        data: TIPS.filter((t) => t.categoryId === cat.id),
      };
    }).filter((s) => s.data.length > 0);
  }, [colors.tints]);

  const renderItem = ({ item }: { item: Tip }) => {
    const isSaved = state.savedTips.includes(item.id);

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: item.isImportant ? colors.primary : "transparent",
            borderWidth: item.isImportant ? 2 : 0,
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
            />
          </Pressable>
        </View>
        <Text style={[styles.cardContent, { color: colors.mutedForeground }]}>
          {item.content}
        </Text>
      </View>
    );
  };

  const renderSectionHeader = ({ section: { title, icon, tint } }: any) => (
    <View style={[styles.sectionHeader, { backgroundColor: tint, borderRadius: colors.radius }]}>
      <View style={[styles.sectionIconContainer, { backgroundColor: colors.background }]}>
        <Feather name={icon} size={18} color={colors.foreground} />
      </View>
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
          <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
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
    paddingTop: 0,
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
    gap: 12,
    marginTop: 24,
    marginBottom: 16,
    padding: 12,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
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
});
