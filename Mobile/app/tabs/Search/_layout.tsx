// Home/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

// This layout wraps all screens in the Home folder
export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Hide default header
        animation: "slide_from_right",
      }}
    >
      {/* Default Home screen */}
      <Stack.Screen name="index" />
    </Stack>
  );
}
