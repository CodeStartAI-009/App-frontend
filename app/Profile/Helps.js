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
    <View style={styles.page}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Help & Support</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* QUICK HELP SECTION */}
        <Text style={styles.sectionTitle}>Quick Help</Text>

        <View style={styles.faqCard}>
          {[
            {
              q: "How to add a transaction?",
              a: "Go to the Home page → tap “+” → choose Income or Expense.",
            },
            {
              q: "Why can't I see my bank account/UPI?",
              a: "For safety, we hide sensitive details. Edit them in Profile → Edit Bank/UPI.",
            },
            {
              q: "How do I change password?",
              a: "Go to Profile → Account Settings → Change Password.",
            },
            {
              q: "What is Monthly Income for?",
              a: "It helps calculate insights and savings for your dashboard.",
            },
            {
              q: "Why is password needed to edit email or phone?",
              a: "This prevents unauthorized changes to your account.",
            },
          ].map((item, i) => (
            <View key={i} style={styles.faqItem}>
              <Text style={styles.question}>• {item.q}</Text>
              <Text style={styles.answer}>{item.a}</Text>
            </View>
          ))}
        </View>

        {/* CONTACT SUPPORT */}
        <Text style={styles.sectionTitle}>Contact Support</Text>

        <TouchableOpacity style={styles.supportTile} onPress={openEmail}>
          <Ionicons name="mail-outline" size={24} color="#196F63" />
          <View style={{ flex: 1 }}>
            <Text style={styles.supportTitle}>Email Support</Text>
            <Text style={styles.supportSubtitle}>support@yourapp.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportTile} onPress={openWhatsApp}>
          <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
          <View style={{ flex: 1 }}>
            <Text style={styles.supportTitle}>WhatsApp Support</Text>
            <Text style={styles.supportSubtitle}>Chat with us instantly</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        {/* ABOUT SECTION */}
        <Text style={styles.sectionTitle}>About</Text>

        <View style={styles.aboutCard}>
          <Text style={styles.aboutText}>App Version: 1.0.0</Text>

          <TouchableOpacity onPress={() => Linking.openURL("https://yourapp.com/privacy")}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Linking.openURL("https://yourapp.com/terms")}>
            <Text style={styles.link}>Terms & Conditions</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 130 }} />

      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* --------------------------- PREMIUM STYLES ---------------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F7FBFA",
  },

  /* HEADER */
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    elevation: 4,
    shadowColor: "#00000040",
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 8,
    borderRadius: 10,
  },

  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 12,
    marginTop: 15,
  },

  /* FAQ */
  faqCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    elevation: 2,
    shadowColor: "#00000020",
    marginBottom: 20,
  },

  faqItem: {
    marginBottom: 12,
  },

  question: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
  },

  answer: {
    fontSize: 14,
    color: "#47645A",
    marginTop: 4,
    lineHeight: 20,
  },

  /* SUPPORT BUTTONS */
  supportTile: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    elevation: 1,
    shadowColor: "#00000010",
    marginBottom: 14,
  },

  supportTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  supportSubtitle: {
    fontSize: 13,
    color: "#6B7F7A",
    marginTop: 2,
  },

  /* ABOUT SECTION */
  aboutCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    elevation: 1,
    shadowColor: "#00000010",
    marginBottom: 20,
  },

  aboutText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
  },

  link: {
    marginTop: 12,
    fontSize: 15,
    color: "#1A7764",
    fontWeight: "700",
  },
});
