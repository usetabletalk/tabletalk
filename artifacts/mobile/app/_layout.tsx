import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppStateProvider } from "@/contexts/AppStateContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Hide browser scrollbars on web (showsVerticalScrollIndicator={false} alone doesn't suppress them)
if (Platform.OS === "web" && typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `* { scrollbar-width: none !important; } *::-webkit-scrollbar { display: none !important; }`;
  document.head.appendChild(style);
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back", headerTintColor: "#E0603C" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="scenario/[id]"
        options={{
          presentation: "card",
          headerTitle: "Practice",
          ...(Platform.OS === "web" && { headerStatusBarHeight: 50 }),
        } as object}
      />
      <Stack.Screen
        name="chatbot/[id]"
        options={{
          presentation: "card",
          headerTitle: "",
          headerBackTitle: "",
          ...(Platform.OS === "web" && { headerStatusBarHeight: 50 }),
        } as object}
      />
      <Stack.Screen
        name="chatbot/chat"
        options={{
          presentation: "card",
          headerTitle: "",
          headerBackTitle: "",
          ...(Platform.OS === "web" && { headerStatusBarHeight: 50 }),
        } as object}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <AppStateProvider>
            <GestureHandlerRootView>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </AppStateProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
