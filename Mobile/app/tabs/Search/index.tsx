import { View, Text, StyleSheet } from "react-native";

export default function SearchMain() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>🔍 Search Main Page</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  text: { fontSize: 20, fontWeight: "600" },
});
