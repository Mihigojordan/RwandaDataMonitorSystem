// app/tabs/Home/_layout.tsx
import React from "react";
import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // HomeMain handles its own header
      }}
    >
      <Stack.Screen name="index" />               {/* HomeMain */}
      <Stack.Screen name="NationalFigures" />    {/* Hidden subpage */}
      <Stack.Screen name="RwandaSDGs" />         {/* Hidden subpage */}
      <Stack.Screen name="(GDP_Form)" />         {/* Hidden subpage */}
    </Stack>
  );
}
