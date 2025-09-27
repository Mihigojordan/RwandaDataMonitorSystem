import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView, 
  Switch, 
  Modal,
  Image,
  Linking
} from "react-native";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router"; 
import { Feather, FontAwesome } from '@expo/vector-icons'; // icons
import i18n from "@/app/locales/i18n";

export default function ProfileMain() {
  const { t } = useTranslation();
  const [languageModal, setLanguageModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const router = useRouter();

  const changeLanguage = (lang: string | undefined) => {
    i18n.changeLanguage(lang);
    setLanguageModal(false);
  };

  const MenuItem = ({ icon, title, onPress, showArrow = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {icon && <Feather name={icon} size={20} color="#2563EB" style={{ marginRight: 10 }} />}
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      {showArrow && <Text style={styles.arrow}>›</Text>}
    </TouchableOpacity>
  );

  const SocialIcon = ({name, url }) => (
    <TouchableOpacity onPress={() => Linking.openURL(url)} style={{ marginHorizontal: 10 }}>
      <FontAwesome name={name} size={28} color="#2563EB" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require('../../../Assets/Images/Logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>
            <Text style={{ fontWeight: "bold" }}>Welcome to Rwanda Data Monitor</Text>
          </Text>
        </View>

        <View style={styles.menuContainer}>
          <MenuItem icon="globe" title={t("Language")} onPress={() => setLanguageModal(true)} />
          
          <View style={styles.menuItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="bell" size={20} color="#2563EB" style={{ marginRight: 10 }} />
              <Text style={styles.menuTitle}>{t("Notifications")}</Text>
            </View>
            <Switch
              trackColor={{ false: "#ccc", true: "#2563EB" }}
              thumbColor="white"
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>

          <MenuItem icon="info" title={t("About")} onPress={() => router.push("/tabs/Settings/About")} />
          <MenuItem icon="message-square" title={t("FeedbackAndDataRate")} onPress={() => router.push("/tabs/Settings/Feedback")} />
       
          <MenuItem icon="shield" title={t("PrivacyPolicy")} onPress={() => router.push("/tabs/Settings/About")} />
          <MenuItem icon="file-text" title={t("TermsOfService")} onPress={() => router.push("/tabs/Settings/Feedback")} />

       
          <View style={styles.socialContainer}>
            <SocialIcon name="facebook" url="https://facebook.com" />
            <SocialIcon name="twitter" url="https://twitter.com" />
            <SocialIcon name="linkedin" url="https://linkedin.com" />
            <SocialIcon name="instagram" url="https://instagram.com" />
          </View>
        </View>

        {/* Language Modal */}
        <Modal visible={languageModal} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Choose Language</Text>
              <TouchableOpacity style={styles.langButton} onPress={() => changeLanguage("en")}>
                <Text style={styles.langButtonText}>🇬🇧 English</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langButton} onPress={() => changeLanguage("fr")}>
                <Text style={styles.langButtonText}>🇫🇷 Français</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.langButton} onPress={() => changeLanguage("rw")}>
                <Text style={styles.langButtonText}>🇷🇼 Kinyarwanda</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.closeButton} onPress={() => setLanguageModal(false)}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#E6F3FF" },
  container: { flex: 1, paddingHorizontal: 20 },
  header: { alignItems: "center", paddingVertical: 20 },
  profileTitle: { fontSize: 28, fontWeight: "700", color: "#2563EB" },
  logo: { width: 150, height: 90, marginBottom:-10, borderRadius:50 },
  welcomeCard: { backgroundColor: "white", borderRadius: 12, padding: 20, marginBottom: 25, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  welcomeText: { fontSize: 16, color: "#374151", textAlign: "center" },
  menuContainer: { backgroundColor: "white", borderRadius: 12, marginBottom: 25, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  menuItem: { flexDirection: "row", alignItems:"center", justifyContent: "space-between", paddingVertical: 16, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: "#F3F4F6" },
  menuTitle: { fontSize: 16, color: "#374151", fontWeight: "500" },
  arrow: { fontSize: 20, color: "#9CA3AF", fontWeight: "300" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { backgroundColor: "white", borderRadius: 12, padding: 20, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, textAlign: "center" },
  langButton: { padding: 12, borderWidth: 1, borderColor: "#E2E8F0", borderRadius: 8, marginBottom: 10 },
  langButtonText: { fontSize: 16, textAlign: "center", fontWeight: "500" },
  closeButton: { marginTop: 15, padding: 12, backgroundColor: "#2563EB", borderRadius: 8 },
  closeText: { color: "white", textAlign: "center", fontWeight: "600" },
  socialContainer: { flexDirection: "row", justifyContent: "center", paddingVertical: 15 }
});
