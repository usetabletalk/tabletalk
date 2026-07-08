import React from "react";
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            You Are Not Alone
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            A diagnosis can feel isolating, but there is a massive, supportive community ready to help you navigate this.
          </Text>
        </View>

        <View
          style={[
            styles.encouragementCard,
            { backgroundColor: colors.secondary, borderRadius: colors.radius },
          ]}
        >
          <Feather name="heart" size={24} color={colors.primary} style={styles.encouragementIcon} />
          <Text style={[styles.encouragementText, { color: colors.secondaryForeground }]}>
            It's okay to feel overwhelmed right now. The learning curve is steep, but it becomes second nature over time. Give yourself grace.
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Trusted Organizations
        </Text>
        
        {RESOURCES.map((resource) => (
          <Pressable
            key={resource.id}
            style={({ pressed }) => [
              styles.resourceCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
            onPress={() => handleOpenLink(resource.url)}
          >
            <View style={styles.resourceHeader}>
              <Text style={[styles.resourceName, { color: colors.cardForeground }]}>
                {resource.name}
              </Text>
              <Feather name="external-link" size={16} color={colors.mutedForeground} />
            </View>
            <Text style={[styles.resourceDescription, { color: colors.mutedForeground }]}>
              {resource.description}
            </Text>
          </Pressable>
        ))}

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
  encouragementCard: {
    padding: 24,
    marginBottom: 32,
    alignItems: "center",
  },
  encouragementIcon: {
    marginBottom: 12,
  },
  encouragementText: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  sectionTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    marginBottom: 16,
  },
  resourceCard: {
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  resourceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  resourceName: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    flex: 1,
  },
  resourceDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    lineHeight: 22,
  },
});
