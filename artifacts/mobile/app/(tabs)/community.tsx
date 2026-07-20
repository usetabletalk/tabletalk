import React, { useState } from "react";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";

const RESOURCES = [
  {
    id: "cdf",
    name: "Celiac Disease Foundation",
    description: "Extensive resources, research updates, and a provider directory.",
    url: "https://celiac.org",
  },
  {
    id: "beyond",
    name: "Beyond Celiac",
    description: "Advocacy organization focused on research and community support.",
    url: "https://www.beyondceliac.org",
  },
  {
    id: "gig",
    name: "Gluten Intolerance Group (GIG)",
    description: "Support groups and the GFCO certification program.",
    url: "https://gluten.org",
  },
  {
    id: "findmegf",
    name: "Find Me Gluten Free",
    description: "Crowdsourced reviews of gluten-free friendly restaurants, rated by the celiac community.",
    url: "https://www.findmeglutenfree.com",
  },
];

const COMMUNITIES = [
  {
    id: "r-celiac",
    name: "r/Celiac",
    platform: "Reddit",
    description: "The main celiac subreddit — diagnosis stories, questions, venting, and real talk from people who get it. Very active and welcoming to newly diagnosed people.",
    url: "https://www.reddit.com/r/Celiac/",
    icon: "message-circle" as const,
  },
  {
    id: "r-glutenfree",
    name: "r/glutenfree",
    platform: "Reddit",
    description: "Broader gluten-free community focused on food — product finds, restaurant tips, recipes, and the occasional triumphant 'I found GF pasta that doesn't fall apart' post.",
    url: "https://www.reddit.com/r/glutenfree/",
    icon: "message-circle" as const,
  },
  {
    id: "tiktok-celiac",
    name: "#CeliacDisease on TikTok",
    platform: "TikTok",
    description: "A surprisingly vibrant corner of TikTok — creators share diagnosis journeys, product reviews, kitchen tips, and the very specific humor of accidentally getting glutened. Search #celiac or #glutenfree.",
    url: "https://www.tiktok.com/tag/celiacdisease",
    icon: "play-circle" as const,
  },
  {
    id: "instagram-gf",
    name: "#GlutenFree on Instagram",
    platform: "Instagram",
    description: "A huge and active community of celiac creators sharing safe recipes, product recommendations, restaurant finds, and day-in-the-life content. Great for discovering new products and feeling less alone.",
    url: "https://www.instagram.com/explore/tags/glutenfree/",
    icon: "camera" as const,
  },
];

function SectionHeader({
  title,
  subtitle,
  expanded,
  onToggle,
}: {
  title: string;
  subtitle?: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [styles.sectionHeader, { opacity: pressed ? 0.7 : 1 }]}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${expanded ? "collapse" : "expand"}`}
    >
      <View style={styles.sectionHeaderText}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.sectionSubtitle, { color: colors.mutedForeground }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Feather
        name={expanded ? "chevron-up" : "chevron-down"}
        size={20}
        color={colors.mutedForeground}
      />
    </Pressable>
  );
}

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [orgsExpanded, setOrgsExpanded] = useState(true);
  const [socialExpanded, setSocialExpanded] = useState(true);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: Platform.OS === "web" ? 50 : insets.top }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <View style={[styles.header, { paddingTop: 24 }]}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            You Are Not Alone
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            A diagnosis can feel isolating, but there is a massive, supportive community ready to help you navigate this.
          </Text>
        </View>

        {/* ── Trusted Organizations ─────────────────────────────────────────── */}
        <SectionHeader
          title="Trusted Organizations"
          subtitle="Research, advocacy, and support from established celiac groups."
          expanded={orgsExpanded}
          onToggle={() => setOrgsExpanded((v) => !v)}
        />

        {orgsExpanded && (
          <View style={styles.sectionContent}>
            {RESOURCES.map((resource, index) => {
              const tintOptions = [colors.tints.sky, colors.tints.mint, colors.tints.lavender];
              const tint = tintOptions[index % tintOptions.length];
              return (
                <Pressable
                  key={resource.id}
                  style={({ pressed }) => [
                    styles.resourceCard,
                    {
                      backgroundColor: tint,
                      borderRadius: colors.radius,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  onPress={() => handleOpenLink(resource.url)}
                  accessibilityRole="link"
                >
                  <View style={styles.resourceHeader}>
                    <View style={[styles.resourceIconWrapper, { backgroundColor: colors.background }]}>
                      <Feather name="bookmark" size={18} color={colors.foreground} />
                    </View>
                    <Feather name="external-link" size={18} color={colors.foreground} style={{ opacity: 0.5 }} />
                  </View>
                  <Text style={[styles.resourceName, { color: colors.foreground }]}>
                    {resource.name}
                  </Text>
                  <Text style={[styles.resourceDescription, { color: colors.foreground, opacity: 0.8 }]}>
                    {resource.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}

        {/* ── Community & Social ────────────────────────────────────────────── */}
        <SectionHeader
          title="Community & Social"
          subtitle="From practical advice to commiserating about croutons."
          expanded={socialExpanded}
          onToggle={() => setSocialExpanded((v) => !v)}
        />

        {socialExpanded && (
          <View style={styles.sectionContent}>
            {COMMUNITIES.map((community) => (
              <Pressable
                key={community.id}
                style={({ pressed }) => [
                  styles.communityCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
                onPress={() => handleOpenLink(community.url)}
                accessibilityRole="link"
                accessibilityLabel={`${community.name} on ${community.platform}`}
              >
                <View style={styles.communityHeader}>
                  <View style={styles.communityMeta}>
                    <View style={[styles.communityIconWrapper, { backgroundColor: colors.primary + "22" }]}>
                      <Feather name={community.icon} size={16} color={colors.primary} />
                    </View>
                    <Text style={[styles.platformLabel, { color: colors.mutedForeground }]}>
                      {community.platform}
                    </Text>
                  </View>
                  <Feather name="external-link" size={16} color={colors.mutedForeground} />
                </View>
                <Text style={[styles.communityName, { color: colors.foreground }]}>
                  {community.name}
                </Text>
                <Text style={[styles.communityDescription, { color: colors.mutedForeground }]}>
                  {community.description}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 24,
    paddingTop: 0,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  // Section headers
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    marginTop: 8,
  },
  sectionHeaderText: {
    flex: 1,
    marginRight: 12,
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
  },
  sectionSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    marginTop: 2,
  },
  sectionContent: {
    marginBottom: 8,
  },
  // Trusted organization cards
  resourceCard: {
    padding: 20,
    marginBottom: 16,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  resourceIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  resourceName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    marginBottom: 8,
  },
  resourceDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
  // Community & social cards
  communityCard: {
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
  },
  communityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  communityMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  communityIconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  platformLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  communityName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
    marginBottom: 6,
  },
  communityDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
  },
});
