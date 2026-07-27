import { Feather } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const SIDEBAR_WIDTH = 240;

const NAV_ITEMS = [
  { path: "/chatbot", icon: "message-square", label: "Practice" },
  { path: "/community", icon: "users", label: "Community" },
  { path: "/profile", icon: "smile", label: "Profile" },
] as const;

export function WebSidebar() {
  const [open, setOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const colors = useColors();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const openDrawer = () => {
    setOpen(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 180,
      useNativeDriver: false,
    }).start(() => setOpen(false));
  };

  const navigate = (path: string) => {
    router.push(path as any);
    closeDrawer();
  };

  const topOffset = insets.top + 67 + 12;

  return (
    <>
      {/* Hamburger button — always visible */}
      <Pressable
        onPress={open ? closeDrawer : openDrawer}
        style={[
          styles.hamburger,
          {
            top: topOffset,
            backgroundColor: colors.background,
            borderColor: colors.border,
          },
        ]}
        accessibilityLabel={open ? "Close menu" : "Open menu"}
        accessibilityRole="button"
      >
        <Feather
          name={open ? "x" : "menu"}
          size={20}
          color={colors.foreground}
        />
      </Pressable>

      {/* Dim backdrop — only while open */}
      {open && (
        <Pressable
          style={styles.backdrop}
          onPress={closeDrawer}
          accessible={false}
        />
      )}

      {/* Sliding drawer */}
      <Animated.View
        style={[
          styles.drawer,
          {
            backgroundColor: colors.background,
            borderRightColor: colors.border,
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top + 67 + 24,
          },
        ]}
      >
        <Text style={[styles.appName, { color: colors.primary }]}>
          Table Talk
        </Text>

        <View style={styles.navItems}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.path ||
              (item.path === "/chatbot" && pathname.startsWith("/chatbot"));
            return (
              <Pressable
                key={item.path}
                onPress={() => navigate(item.path)}
                style={({ pressed }) => [
                  styles.navItem,
                  {
                    backgroundColor: isActive
                      ? colors.primary + "18"
                      : "transparent",
                    borderRadius: colors.radius,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={item.label}
                accessibilityState={{ selected: isActive }}
              >
                <Feather
                  name={item.icon as any}
                  size={18}
                  color={isActive ? colors.primary : colors.mutedForeground}
                />
                <Text
                  style={[
                    styles.navLabel,
                    {
                      color: isActive ? colors.primary : colors.foreground,
                      fontFamily: isActive
                        ? "Inter_600SemiBold"
                        : "Inter_400Regular",
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  hamburger: {
    position: "absolute",
    left: 16,
    zIndex: 300,
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
    // @ts-ignore — backgroundColor with opacity
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 250,
    borderRightWidth: 1,
    paddingHorizontal: 16,
    paddingBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  appName: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    marginBottom: 28,
    marginLeft: 4,
  },
  navItems: {
    gap: 4,
  },
  navItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  navLabel: {
    fontSize: 15,
  },
});
