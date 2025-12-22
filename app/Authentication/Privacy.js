import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Privacy() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Unispend – Privacy Policy</Text>
        <Text style={styles.text}>Effective Date: 01 January 2025</Text>

        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.text}>
          We collect personal information such as name, email, phone number (optional),
          and user-entered financial data including expenses, income, goals, and balances.
        </Text>

        <Text style={styles.sectionTitle}>2. How Data Is Used</Text>
        <Text style={styles.text}>
          Data is used to provide core app functionality, account security, analytics,
          notifications, and optional insights.
        </Text>

        <Text style={styles.sectionTitle}>3. Sensitive Data</Text>
        <Text style={styles.text}>
          Sensitive identifiers such as bank or UPI details are stored only in hashed or
          masked form. We do not store raw credentials.
        </Text>

        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.text}>
          We do not sell personal data. Limited data may be shared with trusted third-party
          services (analytics, notifications, ads) solely to operate the App.
        </Text>

        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.text}>
          We apply industry-standard security practices including encryption and access
          control to protect user data.
        </Text>

        <Text style={styles.sectionTitle}>6. Data Retention & Deletion</Text>
        <Text style={styles.text}>
          Users may request account deletion. Upon deletion, personal and financial data
          is permanently removed except where legally required.
        </Text>

        <Text style={styles.sectionTitle}>7. Children’s Privacy</Text>
        <Text style={styles.text}>
          The App is not intended for children under 13. If such data is detected, it will
          be deleted.
        </Text>

        <Text style={styles.sectionTitle}>8. Contact</Text>
        <Text style={styles.text}>Email: unispend001@gmail.com</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e5e7eb",
  },

  headerText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginLeft: 12,
  },

  container: {
    padding: 20,
    paddingBottom: 100,
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    marginBottom: 18,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
    marginBottom: 6,
  },

  subTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#444",
    marginTop: 10,
    marginBottom: 4,
  },

  text: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
    marginBottom: 4,
  },
});
