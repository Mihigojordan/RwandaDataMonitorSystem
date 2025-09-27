// Updates/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

// Layout for all screens in the Updates folder
export default function UpdatesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // hides the default header
        animation: "slide_from_right", // nice animation for navigation
      }}
    >
      {/* Default Updates screen */}
      <Stack.Screen name="index" />
    </Stack>
  );
}
