import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity
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
    if (res?.data?.profile) {
      setUser(res.data.profile);
    }
  };

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile Details</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
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
            <Text style={styles.value}>{user.phone || "Add phone number"}</Text>
          </View>

          {/* UPI */}
          <View style={styles.row}>
            <Text style={styles.label}>UPI ID</Text>
            <Text style={styles.value}>
              {user.hasUPI ? "Linked ✔" : "Add your UPI ID"}
            </Text>
          </View>

          {/* Bank Account */}
          <View style={styles.row}>
            <Text style={styles.label}>Bank Account</Text>
            <Text style={styles.value}>
              {user.hasBank ? "Bank Linked ✔" : "Add bank account"}
            </Text>
          </View>

          {/* Balance */}
          <View style={[styles.row, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>Current Balance</Text>
            <Text style={[styles.value, { fontSize: 20, color: "#196F63" }]}>
              ₹ {user.balance}
            </Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18493F",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
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
});
