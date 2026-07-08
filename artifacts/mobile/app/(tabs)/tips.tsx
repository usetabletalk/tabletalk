import React, { useEffect, useMemo, useState } from "react";
import {
  AccessibilityInfo,
  LayoutAnimation,
  Platform,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useAppState } from "@/contexts/AppStateContext";
import { CATEGORIES, TIPS, Tip } from "@/data/tips";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function TipsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { state, toggleSavedTip } = useAppState();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) setReduceMotion(enabled);
      })
      .catch(() => {});
    const sub = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      setReduceMotion
    );
    return () => {
      mounted = false;
      sub.remove();
    };
  }, []);

  const toggleSection = (categoryId: string) => {
    if (Platform.OS !== "web" && !reduceMotion) {
      LayoutAnimation.configureNext(
        LayoutAnimation.create(200, "easeInEaseOut", "opacity")
      );
    }
    setCollapsed((prev) => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const sections = useMemo(() => {
    return CATEGORIES.map((cat, index) => {
      const tintOptions = [colors.tints.rose, colors.tints.lemon, colors.tints.lavender, colors.tints.mint];
      const tint = tintOptions[index % tintOptions.length];
      const allTips = TIPS.filter((t) => t.categoryId === cat.id);
      const isCollapsed = !!collapsed[cat.id];
      return {
        categoryId: cat.id,
        title: cat.label,
        icon: cat.icon,
        tint,
        tipCount: allTips.length,
        isCollapsed,
        data: isCollapsed ? [] : allTips,
      };
    }).filter((s) => s.tipCount > 0);
  }, [colors.tints, collapsed]);

  const renderItem = ({ item }: { item: Tip }) => {
    const isSaved = state.savedTips.includes(item.id);

    return (
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
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

  const renderSectionHeader = ({
    section: { categoryId, title, icon, tint, tipCount, isCollapsed },
  }: any) => (
    <Pressable
      onPress={() => toggleSection(categoryId)}
      accessibilityRole="button"
      accessibilityState={{ expanded: !isCollapsed }}
      accessibilityLabel={`${title}, ${tipCount} tips, ${isCollapsed ? "collapsed" : "expanded"}`}
      style={({ pressed }) => [
        styles.sectionHeader,
        {
          backgroundColor: tint,
          borderRadius: colors.radius,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <View style={[styles.sectionIconContainer, { backgroundColor: colors.background }]}>
        <Feather name={icon} size={18} color={colors.foreground} />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      <View style={styles.sectionHeaderRight}>
        {isCollapsed && (
          <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
            {tipCount}
          </Text>
        )}
        <Feather
          name={isCollapsed ? "chevron-down" : "chevron-up"}
          size={20}
          color={colors.foreground}
        />
      </View>
    </Pressable>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, paddingTop: insets.top },
      ]}
    >
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
          <View style={[styles.header, { paddingTop: 24 }]}>
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
    flex: 1,
  },
  sectionHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionCount: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
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
