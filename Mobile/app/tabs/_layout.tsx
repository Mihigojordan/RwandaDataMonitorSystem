import React, { useRef, useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import BottomSheet from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

// Main tab routes (order defines tab order)
const tabRoutes = [
  { name: "Home", href: "Home/index", labelKey: "tabs.home", icon: "home" },
  { name: "Search", href: "Search/index", labelKey: "tabs.search", icon: "search-outline" },
  { name: "Updates", href: "Updates/index", labelKey: "tabs.update", icon: "sync-outline" },
  { name: "Settings", href: "Settings", labelKey: "tabs.profile", icon: "settings-outline" },
];

// Optional BottomSheet links (can leave empty or repeat main tabs)
const bottomSheetLinks = [
  { name: "Home", href: "Home/index", labelKey: "tabs.home", icon: "home" },
  { name: "Search", href: "Search/index", labelKey: "tabs.search", icon: "search-outline" },
  { name: "Updates", href: "Updates/index", labelKey: "tabs.update", icon: "sync-outline" },
  { name: "Settings", href: "Settings", labelKey: "tabs.profile", icon: "settings-outline" },
];

export default function TabLayout() {
  const sheetRef = useRef<BottomSheet>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const snapPoints = useMemo(() => ["25%", "50%"], []);

  return (
    <>
      {/* Tabs Navigator */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#007aff",
          tabBarInactiveTintColor: "#888",
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            height: 80,
            paddingBottom: 20,
            paddingTop: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 5,
          },
        }}
      >
        {tabRoutes.map((route) => (
          <Tabs.Screen
            key={route.name}
            name={route.name}      // Tab label
            href={route.href}      // Actual route file
            options={{
              tabBarLabel: t(route.labelKey),
              tabBarIcon: ({ color, size }) => (
                <Ionicons name={route.icon as any} size={size} color={color} />
              ),
            }}
          />
        ))}
      </Tabs>

      {/* Bottom Sheet (optional) */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backgroundStyle={styles.sheetBackground}
      >
        <View style={styles.sheet}>
          {bottomSheetLinks.map((route) => (
            <TouchableOpacity
              key={route.name}
              style={styles.item}
              onPress={() => router.push(`/tabs/${route.href}`)}
            >
              <View style={styles.iconWrapper}>
                <Ionicons name={route.icon as any} size={36} color="#fff" />
              </View>
              <Text style={styles.label}>{t(route.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    borderRadius: 20,
    backgroundColor: "#007aff",
  },
  sheet: {
    flex: 1,
    padding: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  item: {
    alignItems: "center",
    marginVertical: 15,
    width: "40%",
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#005ecb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
});
