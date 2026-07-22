import React, { useMemo, useState } from "react";
import { Linking, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { useColors } from "@/hooks/useColors";
import { useAppState } from "@/contexts/AppStateContext";

type OrgResource = {
  id: string;
  name: string;
  description: string;
  url: string;
  restrictionIds: string[];
};

const ALL_9_ALLERGENS = ["dairy", "egg", "fish", "shellfish", "soy", "sesame", "wheat", "peanut", "tree-nut"];

// Canonical display order: allergies A–Z, then vegetarian, then vegan
const RESTRICTION_ORDER = [
  "celiac", "dairy", "egg", "fish", "peanut", "sesame", "shellfish", "soy", "tree-nut", "wheat",
  "vegetarian", "vegan",
];

const ORGANIZATIONS: OrgResource[] = [
  // Celiac
  {
    id: "cdf",
    name: "Celiac Disease Foundation",
    description: "Research, advocacy, and a provider directory for people with celiac disease.",
    url: "https://celiac.org",
    restrictionIds: ["celiac"],
  },
  {
    id: "beyond-celiac",
    name: "Beyond Celiac",
    description: "Patient advocacy organization focused on accelerating celiac disease research and finding a cure.",
    url: "https://www.beyondceliac.org",
    restrictionIds: ["celiac"],
  },
  // All 9 major allergens — FARE
  {
    id: "fare",
    name: "Food Allergy Research & Education (FARE)",
    description: "The leading national organization for food allergy research, education, and advocacy.",
    url: "https://www.foodallergy.org",
    restrictionIds: ALL_9_ALLERGENS,
  },
  // All 9 major allergens — KFA
  {
    id: "kfa",
    name: "Kids With Food Allergies (KFA)",
    description: "A division of FARE offering practical guidance, safe recipes, and community support for all food allergies.",
    url: "https://www.kidswithfoodallergies.org",
    restrictionIds: ALL_9_ALLERGENS,
  },
  // Per-allergen specific third resources
  {
    id: "acaai-dairy",
    name: "Dairy Allergy | ACAAI",
    description: "Board-certified allergists providing clinical guidelines and a specialist finder for milk allergy.",
    url: "https://acaai.org/allergies/allergic-conditions/food/milk/",
    restrictionIds: ["dairy"],
  },
  {
    id: "aaaai-egg",
    name: "American Academy of Allergy, Asthma & Immunology",
    description: "Patient resources, clinical guidance, and an allergist directory for egg allergy management.",
    url: "https://www.aaaai.org/conditions-treatments/allergies/food-allergies",
    restrictionIds: ["egg"],
  },
  {
    id: "acaai-fish",
    name: "Fish Allergy | ACAAI",
    description: "Clinical resources and a specialist finder for fish allergy diagnosis and management.",
    url: "https://acaai.org/allergies/allergic-conditions/food/fish/",
    restrictionIds: ["fish"],
  },
  {
    id: "aaaai-shellfish",
    name: "American Academy of Allergy, Asthma & Immunology",
    description: "Evidence-based guidance on shellfish allergy, including diagnosis, treatment, and prevention.",
    url: "https://www.aaaai.org/conditions-treatments/allergies/food-allergies",
    restrictionIds: ["shellfish"],
  },
  {
    id: "acaai-soy",
    name: "Soy Allergy | ACAAI",
    description: "Board-certified allergists providing clinical guidelines, a soy allergy overview, and a specialist finder.",
    url: "https://acaai.org/allergies/allergic-conditions/food/soy/",
    restrictionIds: ["soy"],
  },
  {
    id: "acaai-sesame",
    name: "Sesame Allergy | ACAAI",
    description: "Resources on sesame, the 9th major allergen — including labeling rules and management.",
    url: "https://acaai.org/allergies/allergic-conditions/food/sesame/",
    restrictionIds: ["sesame"],
  },
  {
    id: "gig",
    name: "Gluten Intolerance Group (GIG)",
    description: "Support groups and the GFCO certification program for gluten-free and wheat-free products.",
    url: "https://gluten.org",
    restrictionIds: ["wheat"],
  },
  {
    id: "allergy-asthma-network",
    name: "Allergy & Asthma Network",
    description: "Patient-focused education and advocacy for people living with peanut and other allergies.",
    url: "https://allergyasthmanetwork.org",
    restrictionIds: ["peanut"],
  },
  {
    id: "acaai-treenut",
    name: "Tree Nut Allergy | ACAAI",
    description: "Clinical guidance on tree nut allergy diagnosis, cross-reactivity, and emergency management.",
    url: "https://acaai.org/allergies/allergic-conditions/food/tree-nut/",
    restrictionIds: ["tree-nut"],
  },
  // Vegetarian
  {
    id: "vrg",
    name: "The Vegetarian Resource Group",
    description: "Nonprofit with recipes, nutrition guidance, and restaurant tips for vegetarians.",
    url: "https://www.vrg.org",
    restrictionIds: ["vegetarian"],
  },
  {
    id: "navs",
    name: "North American Vegetarian Society",
    description: "Advocacy and education for vegetarian living in North America since 1974.",
    url: "https://navs-online.org",
    restrictionIds: ["vegetarian"],
  },
  // Vegan
  {
    id: "vegan-society",
    name: "The Vegan Society",
    description: "The world's oldest vegan organization — nutrition guidance, recipes, and global advocacy.",
    url: "https://www.vegansociety.com",
    restrictionIds: ["vegan"],
  },
  {
    id: "vegnews",
    name: "VegNews",
    description: "Recipes, product reviews, substitution guides, and a running list of foods you wouldn't expect to be (or not be) vegan.",
    url: "https://vegnews.com",
    restrictionIds: ["vegan"],
  },
];

type CommunityResource = {
  id: string;
  name: string;
  platform: string;
  description: string;
  url: string;
  icon: "message-circle" | "play-circle" | "camera";
  restrictionIds: string[];
};

const COMMUNITIES: CommunityResource[] = [
  // Celiac
  {
    id: "r-celiac",
    name: "r/Celiac",
    platform: "Reddit",
    description: "The main celiac subreddit — diagnosis stories, questions, venting, and real talk from people who get it. Very active and welcoming to newly diagnosed people.",
    url: "https://www.reddit.com/r/Celiac/",
    icon: "message-circle",
    restrictionIds: ["celiac"],
  },
  {
    id: "tiktok-celiac",
    name: "#CeliacDisease on TikTok",
    platform: "TikTok",
    description: "Creators sharing diagnosis journeys, product reviews, kitchen tips, and the very specific humor of accidentally getting glutened. Search #celiac or #glutenfree.",
    url: "https://www.tiktok.com/tag/celiacdisease",
    icon: "play-circle",
    restrictionIds: ["celiac"],
  },
  // Per-allergen specific first communities (replacing generic r/FoodAllergies)
  {
    id: "r-dairyfree",
    name: "r/DairyFree",
    platform: "Reddit",
    description: "A community for people living dairy-free — recipes, product finds, label tips, and support for managing dairy allergies and intolerances.",
    url: "https://www.reddit.com/r/dairyfree/",
    icon: "message-circle",
    restrictionIds: ["dairy"],
  },
  {
    id: "tiktok-eggallergy",
    name: "#EggAllergy on TikTok",
    platform: "TikTok",
    description: "Creators documenting egg allergy life — safe swaps, baking without eggs, hidden egg warnings, and real stories from the community.",
    url: "https://www.tiktok.com/tag/eggallergy",
    icon: "play-circle",
    restrictionIds: ["egg"],
  },
  {
    id: "tiktok-fishallergy",
    name: "#FishAllergy on TikTok",
    platform: "TikTok",
    description: "Community content around fish allergy awareness — dining out safely, spotting hidden fish ingredients, and connecting with others who get it.",
    url: "https://www.tiktok.com/tag/fishallergy",
    icon: "play-circle",
    restrictionIds: ["fish"],
  },
  {
    id: "tiktok-shellfishallergy",
    name: "#ShellfishAllergy on TikTok",
    platform: "TikTok",
    description: "Creators sharing shellfish allergy experiences — restaurant navigation, cross-contamination tips, and support for newly diagnosed people.",
    url: "https://www.tiktok.com/tag/shellfishallergy",
    icon: "play-circle",
    restrictionIds: ["shellfish"],
  },
  {
    id: "tiktok-soyallergy",
    name: "#SoyAllergy on TikTok",
    platform: "TikTok",
    description: "Content covering soy allergy management — spotting hidden soy in ingredient lists, soy-free product reviews, and everyday workarounds.",
    url: "https://www.tiktok.com/tag/soyallergy",
    icon: "play-circle",
    restrictionIds: ["soy"],
  },
  {
    id: "tiktok-sesameallergy",
    name: "#SesameAllergy on TikTok",
    platform: "TikTok",
    description: "Raising awareness around sesame — the newest major allergen — with labeling updates, safe product finds, and community stories.",
    url: "https://www.tiktok.com/tag/sesameallergy",
    icon: "play-circle",
    restrictionIds: ["sesame"],
  },
  {
    id: "r-glutenfree",
    name: "r/glutenfree",
    platform: "Reddit",
    description: "A large gluten-free community focused on food — product finds, restaurant tips, and recipes for people avoiding wheat.",
    url: "https://www.reddit.com/r/glutenfree/",
    icon: "message-circle",
    restrictionIds: ["wheat"],
  },
  {
    id: "r-peanutallergy",
    name: "r/PeanutAllergy",
    platform: "Reddit",
    description: "A dedicated community for people with peanut allergies — safe products, cross-contamination concerns, travel tips, and emotional support.",
    url: "https://www.reddit.com/r/PeanutAllergy/",
    icon: "message-circle",
    restrictionIds: ["peanut"],
  },
  {
    id: "tiktok-nutfree",
    name: "#NutFree on TikTok",
    platform: "TikTok",
    description: "Creators navigating tree nut allergies — safe snacks, cross-reactivity awareness, school and travel tips, and allergen-friendly recipes.",
    url: "https://www.tiktok.com/tag/nutfree",
    icon: "play-circle",
    restrictionIds: ["tree-nut"],
  },
  // Per-allergen second communities
  {
    id: "instagram-dairyfree",
    name: "#DairyFree on Instagram",
    platform: "Instagram",
    description: "A large community sharing dairy-free recipes, product swaps, restaurant finds, and tips for avoiding hidden dairy in everyday foods.",
    url: "https://www.instagram.com/explore/tags/dairyfree/",
    icon: "camera",
    restrictionIds: ["dairy"],
  },
  {
    id: "instagram-eggfree",
    name: "#EggFree on Instagram",
    platform: "Instagram",
    description: "Creators sharing egg-free baking hacks, substitution guides, and recipes that prove you don't need eggs to make great food.",
    url: "https://www.instagram.com/explore/tags/eggfree/",
    icon: "camera",
    restrictionIds: ["egg"],
  },
  {
    id: "instagram-fishallergy",
    name: "#FishAllergy on Instagram",
    platform: "Instagram",
    description: "Community posts on navigating fish allergies — safe dining, label tips, and connecting with others managing the same restriction.",
    url: "https://www.instagram.com/explore/tags/fishallergy/",
    icon: "camera",
    restrictionIds: ["fish"],
  },
  {
    id: "instagram-shellfishallergy",
    name: "#ShellfishAllergy on Instagram",
    platform: "Instagram",
    description: "Tips, product finds, and community support for people navigating shellfish allergies in restaurants and at home.",
    url: "https://www.instagram.com/explore/tags/shellfishallergy/",
    icon: "camera",
    restrictionIds: ["shellfish"],
  },
  {
    id: "instagram-soyfree",
    name: "#SoyFree on Instagram",
    platform: "Instagram",
    description: "A community focused on soy-free living — recipes, product alternatives, and tips for spotting hidden soy on ingredient labels.",
    url: "https://www.instagram.com/explore/tags/soyfree/",
    icon: "camera",
    restrictionIds: ["soy"],
  },
  {
    id: "instagram-sesamefree",
    name: "#SesameFree on Instagram",
    platform: "Instagram",
    description: "Content around sesame allergy awareness, safe products, and navigating the 9th major allergen in a world where labeling is still catching up.",
    url: "https://www.instagram.com/explore/tags/sesamefree/",
    icon: "camera",
    restrictionIds: ["sesame"],
  },
  {
    id: "instagram-wheatfree",
    name: "#WheatFree on Instagram",
    platform: "Instagram",
    description: "Recipes, product finds, and label-reading tips from creators navigating wheat allergies — including spotting hidden wheat in unexpected places.",
    url: "https://www.instagram.com/explore/tags/wheatfree/",
    icon: "camera",
    restrictionIds: ["wheat"],
  },
  {
    id: "tiktok-peanutallergy",
    name: "#PeanutAllergy on TikTok",
    platform: "TikTok",
    description: "Creators sharing peanut allergy life — safe product hauls, restaurant experiences, cross-contamination warnings, and community solidarity.",
    url: "https://www.tiktok.com/tag/peanutallergy",
    icon: "play-circle",
    restrictionIds: ["peanut"],
  },
  {
    id: "instagram-treenutallergy",
    name: "#TreeNutAllergy on Instagram",
    platform: "Instagram",
    description: "Community content around tree nut allergies — navigating cross-reactivity, finding safe products, and sharing allergen-friendly recipes.",
    url: "https://www.instagram.com/explore/tags/treenutallergy/",
    icon: "camera",
    restrictionIds: ["tree-nut"],
  },
  // Vegetarian
  {
    id: "r-vegetarian",
    name: "r/vegetarian",
    platform: "Reddit",
    description: "An active community for vegetarians of all kinds — recipes, restaurant recommendations, nutrition questions, and navigating social situations.",
    url: "https://www.reddit.com/r/vegetarian/",
    icon: "message-circle",
    restrictionIds: ["vegetarian"],
  },
  {
    id: "instagram-vegetarian",
    name: "#Vegetarian on Instagram",
    platform: "Instagram",
    description: "Millions of posts from vegetarian creators worldwide — recipes, meal preps, restaurant finds, and everyday vegetarian living.",
    url: "https://www.instagram.com/explore/tags/vegetarian/",
    icon: "camera",
    restrictionIds: ["vegetarian"],
  },
  // Vegan
  {
    id: "r-vegan",
    name: "r/vegan",
    platform: "Reddit",
    description: "One of Reddit's largest diet communities — product finds, accidentally vegan discoveries, ethical discussions, recipes, and beginner support.",
    url: "https://www.reddit.com/r/vegan/",
    icon: "message-circle",
    restrictionIds: ["vegan"],
  },
  {
    id: "tiktok-vegan",
    name: "#Vegan on TikTok",
    platform: "TikTok",
    description: "A massive and creative corner of TikTok — quick recipes, product taste tests, restaurant finds, and creators making vegan living look effortless.",
    url: "https://www.tiktok.com/tag/vegan",
    icon: "play-circle",
    restrictionIds: ["vegan"],
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
  const { state } = useAppState();
  const [orgsExpanded, setOrgsExpanded] = useState(true);
  const [socialExpanded, setSocialExpanded] = useState(true);

  const selectedRestrictions = state.dietaryRestrictions ?? [];

  const sortByFirstMatch = <T extends { restrictionIds: string[] }>(items: T[]): T[] =>
    [...items].sort((a, b) => {
      const idx = (item: T) =>
        Math.min(...item.restrictionIds.map((r) => RESTRICTION_ORDER.indexOf(r)).filter((i) => i >= 0));
      return idx(a) - idx(b);
    });

  const visibleOrgs = useMemo(() => {
    if (selectedRestrictions.length === 0) return [];
    const seen = new Set<string>();
    const filtered = ORGANIZATIONS.filter((org) => {
      if (seen.has(org.id)) return false;
      const matches = org.restrictionIds.some((r) => selectedRestrictions.includes(r));
      if (matches) seen.add(org.id);
      return matches;
    });
    return sortByFirstMatch(filtered);
  }, [selectedRestrictions]);

  const visibleCommunities = useMemo(() => {
    if (selectedRestrictions.length === 0) return [];
    const seen = new Set<string>();
    const filtered = COMMUNITIES.filter((c) => {
      if (seen.has(c.id)) return false;
      const matches = c.restrictionIds.some((r) => selectedRestrictions.includes(r));
      if (matches) seen.add(c.id);
      return matches;
    });
    return sortByFirstMatch(filtered);
  }, [selectedRestrictions]);

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
        {/* ── Trusted Organizations ─────────────────────────────────────────── */}
        <SectionHeader
          title="Trusted Organizations"
          subtitle="Personalized to your dietary needs — update selections in your Profile."
          expanded={orgsExpanded}
          onToggle={() => setOrgsExpanded((v) => !v)}
        />

        {orgsExpanded && (
          <View style={styles.sectionContent}>
            {visibleOrgs.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <Feather name="user" size={22} color={colors.mutedForeground} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                  No restrictions selected
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
                  Go to your Profile and select your dietary restrictions to see relevant organizations here.
                </Text>
              </View>
            ) : (
              visibleOrgs.map((org) => (
                <Pressable
                  key={org.id}
                  style={({ pressed }) => [
                    styles.resourceCard,
                    {
                      backgroundColor: colors.primary + "22",
                      borderRadius: colors.radius,
                      opacity: pressed ? 0.9 : 1,
                    },
                  ]}
                  onPress={() => handleOpenLink(org.url)}
                  accessibilityRole="link"
                  accessibilityLabel={org.name}
                >
                  <View style={styles.resourceHeader}>
                    <View style={[styles.resourceIconWrapper, { backgroundColor: colors.primary + "33" }]}>
                      <Feather name="bookmark" size={18} color={colors.primary} />
                    </View>
                    <Feather name="external-link" size={18} color={colors.foreground} style={{ opacity: 0.5 }} />
                  </View>
                  <Text style={[styles.resourceName, { color: colors.foreground }]}>
                    {org.name}
                  </Text>
                  <Text style={[styles.resourceDescription, { color: colors.foreground, opacity: 0.8 }]}>
                    {org.description}
                  </Text>
                </Pressable>
              ))
            )}
          </View>
        )}

        {/* ── Community & Social ────────────────────────────────────────────── */}
        <SectionHeader
          title="Community & Social"
          subtitle="Personalized to your dietary needs — update selections in your Profile."
          expanded={socialExpanded}
          onToggle={() => setSocialExpanded((v) => !v)}
        />

        {socialExpanded && (
          <View style={styles.sectionContent}>
            {visibleCommunities.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <Feather name="users" size={22} color={colors.mutedForeground} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
                  No restrictions selected
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>
                  Go to your Profile and select your dietary restrictions to see relevant communities here.
                </Text>
              </View>
            ) : (
              visibleCommunities.map((community) => (
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
              ))
            )}
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
  // Empty state
  emptyState: {
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  emptyTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
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
