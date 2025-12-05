// app/Profile/EditIncome.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

import {
  fetchUserProfile,
  updateFinance,   // <-- updates balance + income (NO PASSWORD)
} from "../../services/expenseService";

export default function EditIncome() {
  const router = useRouter();

  const [income, setIncome] = useState("");
  const [balance, setBalance] = useState("");

  // Load existing data
  const load = async () => {
    try {
      const res = await fetchUserProfile();
      const p = res.data.profile;

      setIncome(String(p.monthlyIncome || 0));
      setBalance(String(p.bankBalance || 0));
    } catch (err) {
      Alert.alert("Error", "Failed to load profile");
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Save finance changes
  const saveFinance = async () => {
    if (!income || !balance)
      return Alert.alert("Error", "Both fields are required");

    try {
      const res = await updateFinance({
        monthlyIncome: Number(income),
        bankBalance: Number(balance),
      });

      if (res.data.ok) {
        Alert.alert("Success", "Income & Balance updated");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update details");
      }
    } catch (err) {
      Alert.alert("Error", "Server error while updating finance");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Income & Balance</Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>

          {/* Monthly Income */}
          <Text style={styles.label}>Monthly Income (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
            placeholder="Enter monthly income"
          />

          {/* Current Balance */}
          <Text style={styles.label}>Current Balance (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={balance}
            onChangeText={setBalance}
            placeholder="Enter current balance"
          />

          <TouchableOpacity style={styles.btn} onPress={saveFinance}>
            <Text style={styles.btnText}>Save Changes</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------------- STYLES -------------------------- */

const styles = StyleSheet.create({
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

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginTop: 6,
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
