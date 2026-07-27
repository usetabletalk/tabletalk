import React from "react";
import { Platform, StyleSheet, View } from "react-native";

const MAX_CONTENT_WIDTH = 640;

/**
 * On web/desktop, centers content and constrains it to a readable max-width.
 * On iOS/Android renders children directly with no extra wrapping.
 */
export function WebContainer({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== "web") return <>{children}</>;
  return (
    <View style={styles.outer}>
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    alignItems: "center",
  },
  inner: {
    flex: 1,
    // @ts-ignore — width percentages are valid in RN Web
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
  },
});
