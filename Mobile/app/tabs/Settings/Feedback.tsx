import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView 
} from "react-native";
import PhoneInput from "react-native-phone-number-input";
import { useTranslation } from "react-i18next";

export default function Feedback() {
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [feedback, setFeedback] = useState("");

  const phoneInput = useRef<PhoneInput>(null);

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim() || !feedback.trim()) {
      Alert.alert(t("errorTitle"), t("fillAllFields"));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert(t("errorTitle"), t("invalidEmail"));
      return;
    }

    const isValidPhone = phoneInput.current?.isValidNumber(phone);
    if (!isValidPhone) {
      Alert.alert(t("errorTitle"), t("invalidPhone"));
      return;
    }

    Alert.alert(t("thankYouTitle"), t("feedbackSubmitted"));

    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setFeedback("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{t("feedbackTitle")}</Text>
      <Text style={styles.description}>{t("feedbackDescription")}</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholder={t("firstName")}
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={t("lastName")}
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder={t("email")}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <PhoneInput
        ref={phoneInput}
        defaultValue={phone}
        defaultCode="RW"
        layout="first"
        onChangeFormattedText={setPhone}
        containerStyle={styles.phoneContainer}
        textContainerStyle={styles.phoneTextContainer}
      />

      <TextInput
        style={[styles.input, { minHeight: 120 }]}
        multiline
        placeholder={t("feedbackMessage")}
        value={feedback}
        onChangeText={setFeedback}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{t("submitButton")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#E6F3FF",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2563EB",
    marginBottom: 15,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#374151",
    marginBottom: 20,
    textAlign: "center",
  },
  row: { flexDirection: "row", marginBottom: 15 },
  input: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  phoneContainer: {
    width: "100%",
    height: 55,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  phoneTextContainer: {
    paddingVertical: 0,
    borderRadius: 8,
    backgroundColor: "white",
  },
  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
