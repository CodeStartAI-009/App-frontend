import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";
import { fetchUserProfile } from "../../services/expenseService";

export default function Details() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const res = await fetchUserProfile();
    if (res?.data?.profile) setUser(res.data.profile);
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#555" }}>Loading profile...</Text>
      </View>
    );
  }

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
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <Text style={styles.title}>User Information</Text>

          {/* Username */}
          <View style={styles.row}>
            <Text style={styles.label}>Username</Text>
            <Text style={styles.value}>{user.username}</Text>
          </View>

          {/* Email */}
          <View style={styles.row}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user.email}</Text>
          </View>

          {/* Phone */}
          <View style={styles.row}>
            <Text style={styles.label}>Phone</Text>
            <Text style={[styles.value, !user.phone && styles.placeholder]}>
              {user.phone || "Add phone number"}
            </Text>
          </View>

          {/* UPI */}
          <View style={styles.row}>
            <Text style={styles.label}>UPI ID</Text>
            {user.hasUPI ? (
              <View style={styles.badgeSuccess}>
                <Ionicons name="checkmark-circle" size={16} color="#1A7F63" />
                <Text style={styles.badgeText}>Linked</Text>
              </View>
            ) : (
              <Text style={[styles.value, styles.placeholder]}>
                Add UPI ID
              </Text>
            )}
          </View>

          {/* Bank */}
          <View style={styles.row}>
            <Text style={styles.label}>Bank Account</Text>
            {user.hasBank ? (
              <View style={styles.badgeSuccess}>
                <Ionicons name="checkmark-circle" size={16} color="#1A7F63" />
                <Text style={styles.badgeText}>Linked</Text>
              </View>
            ) : (
              <Text style={[styles.value, styles.placeholder]}>
                Add bank account
              </Text>
            )}
          </View>

          {/* Balance */}
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Current Balance</Text>
            <Text style={styles.balanceAmount}>₹ {user.balance}</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F7FBFA",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* HEADER */
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
    shadowColor: "#00000030",
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

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    elevation: 2,
    shadowColor: "#00000015",
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#E5F2EE",
    alignItems: "center",
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

  /* SUCCESS BADGE */
  badgeSuccess: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E7FFF7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#B8E7D8",
  },

  badgeText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#1A7F63",
  },

  /* BALANCE */
  balanceAmount: {
    fontSize: 20,
    fontWeight: "900",
    color: "#196F63",
  },
});
