// app/Profile/Help.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

export default function Help() {
  const router = useRouter();

  const openEmail = () => Linking.openURL("mailto:support@yourapp.com");
  const openWhatsApp = () =>
    Linking.openURL("https://wa.me/919876543210?text=Hi, I need help!");

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Help & Support</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* QUICK HELP */}
        <Text style={styles.sectionTitle}>Quick Help</Text>

        <View style={styles.card}>
          <Text style={styles.question}>• How to add a transaction?</Text>
          <Text style={styles.answer}>
            Go to the Home page → tap “+” → choose Income or Expense.
          </Text>

          <Text style={styles.question}>• Why can't I see my bank account/UPI?</Text>
          <Text style={styles.answer}>
            For your security, we do not show sensitive details. You can update
            them in Profile → Edit Bank/UPI.
          </Text>

          <Text style={styles.question}>• How do I change password?</Text>
          <Text style={styles.answer}>
            Go to Profile → Account Settings → Change Password.
          </Text>

          <Text style={styles.question}>• What is Monthly Income for?</Text>
          <Text style={styles.answer}>
            It helps your dashboard calculate spending insights and monthly
            savings.
          </Text>

          <Text style={styles.question}>• Why do I need password to edit email or phone?</Text>
          <Text style={styles.answer}>
            This protects your account from unauthorized access.
          </Text>
        </View>

        {/* CONTACT SUPPORT */}
        <Text style={styles.sectionTitle}>Contact Support</Text>

        <TouchableOpacity style={styles.supportBtn} onPress={openEmail}>
          <Ionicons name="mail-outline" size={22} color="#196F63" />
          <Text style={styles.supportText}>support@yourapp.com</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportBtn} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={22} color="#196F63" />
          <Text style={styles.supportText}>Chat on WhatsApp</Text>
        </TouchableOpacity>

        {/* ABOUT APP */}
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.card}>
          <Text style={styles.aboutText}>App Version: 1.0.0</Text>
          <TouchableOpacity onPress={() => Linking.openURL("https://yourapp.com/privacy")}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL("https://yourapp.com/terms")}>
            <Text style={styles.link}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------------------- STYLES -------------------------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 10,
    marginBottom: 8,
  },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 16,
    borderColor: "#D8EDE6",
    borderWidth: 1,
    marginBottom: 20,
  },

  question: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 10,
  },
  answer: {
    fontSize: 14,
    color: "#47645A",
    marginTop: 4,
    lineHeight: 20,
  },

  supportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#D0E9E4",
    borderRadius: 12,
    marginBottom: 12,
  },
  supportText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#196F63",
  },

  aboutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
  },
  link: {
    marginTop: 10,
    color: "#1A7764",
    fontWeight: "700",
  },
});
