import React from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* Header / Logo */}
      <View style={styles.header}>
        <Image
          source={require('../../../Assets/Images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerText}>{t("appName")}</Text>
        <Text style={styles.subHeader}>{t("underNISR")}</Text>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.title}>{t("aboutTitle")}</Text>
        <Text style={styles.text}>{t("aboutText1")}</Text>
        <Text style={styles.text}>{t("aboutText2")}</Text>
      </View>

      {/* Mission Section */}
      <View style={styles.section}>
        <Text style={styles.title}>{t("missionTitle")}</Text>
        <Text style={styles.text}>{t("missionText")}</Text>
      </View>

      {/* Vision Section */}
      <View style={styles.section}>
        <Text style={styles.title}>{t("visionTitle")}</Text>
        <Text style={styles.text}>{t("visionText")}</Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E6F3FF",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 50,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2563EB",
    textAlign: "center",
  },
  subHeader: {
    fontSize: 16,
    color: "#374151",
    textAlign: "center",
    marginTop: 4,
  },
  section: {
    marginBottom: 25,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#374151",
    lineHeight: 22,
    textAlign: "justify",
  },
});
