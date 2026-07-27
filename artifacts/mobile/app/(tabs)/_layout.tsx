import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, View, useColorScheme, useWindowDimensions } from "react-native";

import { useColors } from "@/hooks/useColors";
import { WebSidebar } from "@/components/WebSidebar";

function NativeTabLayout() {
  return (
    <NativeTabs defaultValue="chatbot">
      <NativeTabs.Trigger name="community">
        <Icon sf={{ default: "person.3", selected: "person.3.fill" }} />
        <Label>Community</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="chatbot">
        <Icon sf={{ default: "message", selected: "message.fill" }} />
        <Label>Practice</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: "face.smiling", selected: "face.smiling.inverse" }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const { width } = useWindowDimensions();
  const isDark = colorScheme === "dark";
  const isIOS = Platform.OS === "ios";
  const isWeb = Platform.OS === "web";
  // Show desktop sidebar only on wide web screens; mobile browsers get the tab bar
  const isDesktop = isWeb && width >= 768;

  return (
    <View style={{ flex: 1 }}>
      <Tabs
        initialRouteName="chatbot"
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,
          headerShown: false,
          headerStyle: {
            backgroundColor: colors.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTitleStyle: {
            fontFamily: "Inter_600SemiBold",
            color: colors.foreground,
          },
          tabBarStyle: isDesktop
            ? ({ display: "none" } as any)
            : {
                position: "absolute",
                backgroundColor: isIOS ? "transparent" : colors.background,
                borderTopWidth: isWeb ? 1 : 0,
                borderTopColor: colors.border,
                elevation: 0,
                ...(isWeb ? { height: 84 } : {}),
              },
          tabBarBackground: isDesktop
            ? undefined
            : () =>
                isIOS ? (
                  <BlurView
                    intensity={100}
                    tint={isDark ? "dark" : "light"}
                    style={StyleSheet.absoluteFill}
                  />
                ) : isWeb ? (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      { backgroundColor: colors.background },
                    ]}
                  />
                ) : null,
        }}
      >
        <Tabs.Screen
          name="tips"
          options={{
            title: "Tips & Tricks",
            href: null,
          }}
        />
        <Tabs.Screen
          name="index"
          options={{
            title: "Practice",
            href: null,
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="person.3" tintColor={color} size={24} />
              ) : (
                <Feather name="users" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="chatbot"
          options={{
            title: "Practice",
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="message" tintColor={color} size={24} />
              ) : (
                <Feather name="message-square" size={22} color={color} />
              ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) =>
              isIOS ? (
                <SymbolView name="face.smiling" tintColor={color} size={24} />
              ) : (
                <Feather name="smile" size={22} color={color} />
              ),
          }}
        />
      </Tabs>
      {isDesktop && <WebSidebar />}
    </View>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}
