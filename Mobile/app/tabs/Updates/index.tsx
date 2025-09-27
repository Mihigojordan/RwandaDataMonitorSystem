import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { updatesData } from "./updatesData";

export default function UpdateMain() {
  const { t } = useTranslation();

  // Safe translation helper
  const safeT = (key) => (typeof key === "string" ? t(key) : "");

  // Month translation map
  const monthMap = {
    Jan: t("months.january"),
    Feb: t("months.february"),
    Mar: t("months.march"),
    Apr: t("months.april"),
    May: t("months.may"),
    Jun: t("months.june"),
    Jul: t("months.july"),
    Aug: t("months.august"),
    Sep: t("months.september"),
    Oct: t("months.october"),
    Nov: t("months.november"),
    Dec: t("months.december"),
  };

  const UpcomingReleaseItem = ({ date, title, category }) => (
    <View style={styles.upcomingItem}>
      <View style={styles.dateContainer}>
        <Text style={styles.dateMonth}>{monthMap[date.month]}</Text>
        <Text style={styles.dateDay}>{date.day}</Text>
      </View>
      <View style={styles.upcomingContent}>
        <Text style={styles.upcomingTitle}>{title}</Text>
        {category && (
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{category}</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View >
             <Image
                      source={require('../../../Assets/Images/Logo.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />
          </View>
       </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={safeT("updates.search_placeholder")}
          placeholderTextColor="#999"
        />
        <Ionicons name="mic" size={20} color="#666" style={styles.micIcon} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Latest Release */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{safeT("latest_releases")}</Text>
          <View style={styles.latestReleaseCard}>
            <Text style={styles.latestReleaseTitle}>
              {safeT(updatesData.latestRelease.titleKey)}
            </Text>
            <Text style={styles.latestReleaseDate}>
              {safeT(updatesData.latestRelease.dateKey)}
            </Text>
            {updatesData.latestRelease.categoryKey && (
              <View style={styles.statisticsTag}>
                <Text style={styles.statisticsText}>
                  {safeT(updatesData.latestRelease.categoryKey)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Upcoming Releases */}
      {/* Upcoming Releases */}
<View style={styles.section}>
  {/* Section message */}
  <Text style={styles.sectionMessage}>{safeT("upcoming_release_message")}</Text>

  {/* Statistics Release Calendar label */}
 

  {/* Upcoming releases list */}
  {updatesData.upcomingReleases.map((release, index) => (
    <UpcomingReleaseItem
      key={index}
      date={release.date}
      title={safeT(release.titleKey)}
      category={release.categoryKey ? safeT(release.categoryKey) : null}
    />
  ))}
</View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E3F2FD" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 70,
    paddingBottom: 20,
    backgroundColor: "#E3F2FD",
  },
    logo: {
    width: 150,
    height: 80,
    marginBottom: -10,

  },
  backButton: { position: "absolute", left: 16, top: 50, zIndex: 1 },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: { fontSize: 24, fontWeight: "600", color: "#1976D2" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  micIcon: { marginLeft: 10 },
  content: { flex: 1, backgroundColor: "white", borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 20 },
  section: { marginBottom: 30, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 16 },
  sectionMessage: { fontSize: 16, fontWeight: "500", color: "#1976D2", marginBottom: 12 },
  latestReleaseCard: { backgroundColor: "#F5F5F5", borderRadius: 12, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  latestReleaseTitle: { fontSize: 16, fontWeight: "600", color: "#333", lineHeight: 22, marginBottom: 8 },
  latestReleaseDate: { fontSize: 14, color: "#666", marginBottom: 12 },
  statisticsTag: { alignSelf: "flex-start", backgroundColor: "#455A64", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 6 },
  statisticsText: { color: "white", fontSize: 12, fontWeight: "500" },
  statisticsCalendarText: {
  fontSize: 14,
  fontWeight: "500",
  color: "#555",
  marginBottom: 8,
},

  upcomingItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  dateContainer: { backgroundColor: "#1976D2", borderRadius: 8, padding: 8, minWidth: 50, alignItems: "center", marginRight: 16 },
  dateMonth: { color: "white", fontSize: 12, fontWeight: "500", textTransform: "uppercase" },
  dateDay: { color: "white", fontSize: 16, fontWeight: "600" },
  upcomingContent: { flex: 1 },
  upcomingTitle: { fontSize: 16, fontWeight: "500", color: "#333", lineHeight: 20, marginBottom: 4 },
  categoryContainer: { alignSelf: "flex-start", backgroundColor: "#E8F5E8", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginTop: 4 },
  categoryText: { color: "#2E7D32", fontSize: 12, fontWeight: "500" },
});
