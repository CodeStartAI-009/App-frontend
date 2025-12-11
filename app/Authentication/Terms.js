import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Terms() {
  const router = useRouter();

  return (
    <View style={styles.screen}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/Authentication/Signup")}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Terms & Conditions</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Unispend Terms & Conditions</Text>
        <Text style={styles.text}>Effective Date: [Insert Date]</Text>
        <Text style={styles.text}>Last Updated: [Insert Date]</Text>

        {/* Section 1 */}
        <Text style={styles.sectionTitle}>1. Introduction</Text>
        <Text style={styles.text}>
          These Terms & Conditions (“Terms”) constitute a legally binding agreement
          between you and Unispend Technologies. By creating an account or using the
          Unispend App, you agree to be bound by these Terms.
        </Text>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>2. Eligibility</Text>
        <Text style={styles.text}>
          You must be at least 13 years of age to use the App. By using the App, you
          confirm that you have the legal capacity to enter into this agreement.
        </Text>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>3. Account Registration & Security</Text>
        <Text style={styles.text}>
          You agree to provide accurate information and maintain the confidentiality of
          your credentials. You are responsible for all activities that occur under your
          account.
        </Text>

        {/* Section 4 */}
        <Text style={styles.sectionTitle}>4. Permitted Use</Text>
        <Text style={styles.text}>
          You may use the App solely for lawful personal finance tracking and budgeting.
          Misuse, including fraudulent entries or attempts to exploit the system, is
          strictly prohibited.
        </Text>

        {/* Section 5 */}
        <Text style={styles.sectionTitle}>5. Financial Disclaimer</Text>
        <Text style={styles.text}>
          Unispend is not a bank, financial advisor, or investment service. All
          calculations, insights, and summaries are informational only. We are not liable
          for financial decisions made based on app data or insights.
        </Text>

        {/* Section 6 */}
        <Text style={styles.sectionTitle}>6. Virtual Coins & Rewards</Text>
        <Text style={styles.text}>
          Unispend may provide virtual coins or rewards. These coins have no monetary
          value and cannot be exchanged, refunded, transferred, or redeemed for cash.
        </Text>

        {/* Section 7 */}
        <Text style={styles.sectionTitle}>7. User Responsibilities</Text>
        <Text style={styles.text}>
          You are solely responsible for the accuracy of financial data you input into the
          App. Unispend is not responsible for errors resulting from inaccurate entries.
        </Text>

        {/* Section 8 */}
        <Text style={styles.sectionTitle}>8. Third-Party Services</Text>
        <Text style={styles.text}>
          The App may integrate third-party services such as Google AdMob, email providers,
          analytics tools, and AI systems. Usage of these services is governed by their
          respective policies.
        </Text>

        {/* Section 9 */}
        <Text style={styles.sectionTitle}>9. Termination</Text>
        <Text style={styles.text}>
          We reserve the right to suspend or terminate your account at any time for
          violating these Terms or engaging in harmful or fraudulent behavior.
        </Text>

        {/* Section 10 */}
        <Text style={styles.sectionTitle}>10. Limitation of Liability</Text>
        <Text style={styles.text}>
          Unispend is provided “as is,” without warranties of any kind. We are not liable
          for financial loss, data loss, or damages arising from use of the App or from
          reliance on its analytics or AI insights.
        </Text>

        {/* Section 11 */}
        <Text style={styles.sectionTitle}>11. Indemnification</Text>
        <Text style={styles.text}>
          You agree to indemnify and hold Unispend harmless from claims, damages, or
          expenses arising from misuse of the App or violation of these Terms.
        </Text>

        {/* Section 12 */}
        <Text style={styles.sectionTitle}>12. Modifications to Terms</Text>
        <Text style={styles.text}>
          We may update these Terms periodically. Continued use of the App after updates
          indicates acceptance of the revised Terms.
        </Text>

        {/* Section 13 */}
        <Text style={styles.sectionTitle}>13. Governing Law</Text>
        <Text style={styles.text}>
          These Terms are governed by the laws of India.
        </Text>

        {/* Section 14 */}
        <Text style={styles.sectionTitle}>14. Contact Information</Text>
        <Text style={styles.text}>
          For legal inquiries: support@unispend.app
        </Text>

        <View style={{ height: 50 }} />
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
