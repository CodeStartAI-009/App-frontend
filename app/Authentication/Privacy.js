import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Privacy() {
  const router = useRouter();

  return (
    <View style={styles.screen}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/Authentication/Signup")}>
          <Ionicons name="arrow-back" size={26} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Privacy Policy</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>

        <Text style={styles.title}>Unispend Privacy Policy</Text>
        <Text style={styles.text}>Effective Date: [Insert Date]</Text>
        <Text style={styles.text}>Last Updated: [Insert Date]</Text>

        {/* Section 1 */}
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>

        <Text style={styles.subTitle}>A. Personal Information</Text>
        <Text style={styles.text}>
          • Name{"\n"}
          • Email{"\n"}
          • Password (hashed){"\n"}
          • Optional: Phone number{"\n"}
          • Optional: Avatar image{"\n"}
        </Text>

        <Text style={styles.subTitle}>B. Financial Information</Text>
        <Text style={styles.text}>
          • Expenses and incomes{"\n"}
          • Spending categories{"\n"}
          • Savings goals{"\n"}
          • Monthly summaries{"\n"}
          • Bank balance (user-entered){"\n"}
          • UPI ID / bank number (securely hashed){"\n"}
        </Text>

        <Text style={styles.subTitle}>C. Technical Data</Text>
        <Text style={styles.text}>
          • Device type and OS{"\n"}
          • Crash logs{"\n"}
          • Usage patterns{"\n"}
          • IP addresses (server logs){"\n"}
          • Approximate location via Google AdMob{"\n"}
        </Text>

        {/* Section 2 */}
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.text}>
          Your data is used to operate and enhance Unispend, including:
        </Text>
        <Text style={styles.text}>
          • Authentication & account security{"\n"}
          • Processing transactions{"\n"}
          • Providing AI-based insights{"\n"}
          • Displaying ads (AdMob){"\n"}
          • Fraud prevention{"\n"}
          • Notifications{"\n"}
        </Text>

        {/* Section 3 */}
        <Text style={styles.sectionTitle}>3. Legal Basis for Processing</Text>
        <Text style={styles.text}>
          We process data based on: consent, contractual necessity, legitimate interest,
          and legal compliance.
        </Text>

        {/* Section 4 */}
        <Text style={styles.sectionTitle}>4. Data Sharing</Text>
        <Text style={styles.text}>
          Unispend does NOT sell your data. Limited data may be shared with:
        </Text>
        <Text style={styles.text}>
          • Google AdMob (ads){"\n"}
          • Email/OTP service providers{"\n"}
          • Crash reporting tools{"\n"}
          • AI processing services{"\n"}
        </Text>

        {/* Section 5 */}
        <Text style={styles.sectionTitle}>5. Data Security</Text>
        <Text style={styles.text}>
          We use encryption, hashing, and secure communication to protect your data and
          prevent unauthorized access.
        </Text>

        {/* Section 6 */}
        <Text style={styles.sectionTitle}>6. Data Retention</Text>
        <Text style={styles.text}>
          Your data is retained while your account is active. After deletion, your financial
          and personal data are permanently erased, except minimal legal backups.
        </Text>

        {/* Section 7 */}
        <Text style={styles.sectionTitle}>7. User Rights</Text>
        <Text style={styles.text}>
          You may request:
        </Text>
        <Text style={styles.text}>
          • Data access{"\n"}
          • Correction of data{"\n"}
          • Account deletion{"\n"}
          • Restriction of processing{"\n"}
          • Withdrawal of consent{"\n"}
        </Text>

        {/* Section 8 */}
        <Text style={styles.sectionTitle}>8. Children’s Privacy</Text>
        <Text style={styles.text}>
          Unispend is not intended for users under age 13. Such data will be deleted if
          discovered.
        </Text>

        {/* Section 9 */}
        <Text style={styles.sectionTitle}>9. International Transfers</Text>
        <Text style={styles.text}>
          Your data may be stored or processed internationally. Safeguards are applied to
          ensure compliance with privacy laws.
        </Text>

        {/* Section 10 */}
        <Text style={styles.sectionTitle}>10. Updates to This Policy</Text>
        <Text style={styles.text}>
          We may update this Privacy Policy periodically. Continued use of the App signifies
          acceptance of changes.
        </Text>

        {/* Section 11 */}
        <Text style={styles.sectionTitle}>11. Contact Information</Text>
        <Text style={styles.text}>
          For privacy inquiries:{"\n"}support@unispend.app
        </Text>

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
