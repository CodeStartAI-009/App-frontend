import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Terms() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Terms & Conditions</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Unispend – Terms & Conditions</Text>
        <Text style={styles.text}>Effective Date: 01 January 2025</Text>

        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.text}>
          By accessing or using the Unispend application, you agree to be bound by these
          Terms. If you do not agree, you must discontinue use of the App.
        </Text>

        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.text}>
          The App is intended for users aged 13 years or older. Unispend is not designed
          for children under 13.
        </Text>

        <Text style={styles.sectionTitle}>3. Nature of Service</Text>
        <Text style={styles.text}>
          Unispend is a personal finance tracking and budgeting tool. It does NOT provide
          banking, investment, tax, or financial advisory services.
        </Text>

        <Text style={styles.sectionTitle}>4. User Responsibilities</Text>
        <Text style={styles.text}>
          All financial data entered into the App is user-provided. You are solely
          responsible for the accuracy and completeness of this data.
        </Text>

        <Text style={styles.sectionTitle}>5. No Financial Liability</Text>
        <Text style={styles.text}>
          Calculations, summaries, and insights are estimates only. Unispend is not liable
          for any financial loss, decisions, or outcomes resulting from use of the App.
        </Text>

        <Text style={styles.sectionTitle}>6. Virtual Rewards</Text>
        <Text style={styles.text}>
          Coins or rewards within the App are virtual, have no monetary value, and cannot
          be redeemed or transferred.
        </Text>

        <Text style={styles.sectionTitle}>7. Account Termination</Text>
        <Text style={styles.text}>
          We reserve the right to suspend or terminate accounts that violate these Terms
          or misuse the App.
        </Text>

        <Text style={styles.sectionTitle}>8. Limitation of Liability</Text>
        <Text style={styles.text}>
          The App is provided “as is” without warranties of any kind. To the fullest extent
          permitted by law, Unispend disclaims all liability.
        </Text>

        <Text style={styles.sectionTitle}>9. Governing Law</Text>
        <Text style={styles.text}>
          These Terms are governed by the laws of India.
        </Text>

        <Text style={styles.sectionTitle}>10. Contact</Text>
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
    paddingBottom: 20,
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
    marginTop: 18,
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
    marginBottom: 6,
  },
});
