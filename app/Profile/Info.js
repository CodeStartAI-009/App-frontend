import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

import { fetchUserProfile } from "../../services/expenseService";
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatMoney } from "../../utils/money";

/* ---------------- PAYMENT LABELS ---------------- */
const PAYMENT_LABEL = {
  IN: "UPI ID",
  US: "Zelle",
  EU: "SEPA Instant",
  GB: "Faster Payments",
  BR: "PIX",
  SG: "PayNow",
  AU: "PayID",
  CA: "Interac",
};

export default function Details() {
  const router = useRouter();
  const logout = useUserAuthStore((s) => s.logout);
  const authUser = useUserAuthStore((s) => s.user);

  const [user, setUser] = useState(null);

  const currency = authUser?.currency || "INR";
  const countryCode = authUser?.countryCode || "IN";

  const paymentLabel =
    PAYMENT_LABEL[countryCode] || "Payment ID";

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await fetchUserProfile();
      if (res?.data?.profile) setUser(res.data.profile);
    } catch {
      Alert.alert("Error", "Failed to load profile");
    }
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
          router.replace("/Authentication/Login");
        },
      },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#555" }}>Loading profile...</Text>
      </View>
    );
  }

  /* SAFE FLAGS */
  const hasPayment = Boolean(user.hasUPI);
const hasBank = Boolean(user.hasBankAccount);

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile Details</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={styles.card}>
          <Text style={styles.title}>User Information</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{user.name}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={[styles.value, !user.phone && styles.placeholder]}>
              {user.phone || "Not added"}
            </Text>
          </View>

          {/* PAYMENT METHOD */}
          <View style={styles.row}>
            <Text style={styles.label}>{paymentLabel}</Text>
            <Text style={[styles.value, !hasPayment && styles.placeholder]}>
              {hasPayment ? "Linked" : "Not linked"}
            </Text>
          </View>

          {/* BANK ACCOUNT (OPTIONAL) */}
          {hasBank && (
            <View style={styles.row}>
              <Text style={styles.label}>Bank Account</Text>
              <Text style={styles.value}>Linked</Text>
            </View>
          )}

          {/* BALANCE */}
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Current Balance</Text>
            <Text style={styles.balanceAmount}>
              {formatMoney(user.bankBalance || 0, currency)}
            </Text>
          </View>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------- STYLES (UNCHANGED) -------------------- */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FBFA" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    elevation: 4,
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

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    elevation: 2,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5F2EE",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#47645A",
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  placeholder: {
    color: "#9AA5A0",
    fontWeight: "600",
  },

  balanceAmount: {
    fontSize: 20,
    fontWeight: "900",
    color: "#196F63",
  },

  logoutBtn: {
    backgroundColor: "#DC3545",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },

  logoutText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
