import React from "react";
import { Stack } from "expo-router";

export default function GDPForm() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // HomeMain handles its own header
      }}
    >
      <Stack.Screen name="index" />               {/* HomeMain */}
      <Stack.Screen name="GDPBillionRwf" />               {/* HomeMain */}
  
    </Stack>
  );
}