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
  updateFinance,
} from "../../services/expenseService";

import { useUserAuthStore } from "../../store/useAuthStore";
import { formatCurrencyLabel } from "../../utils/money";

export default function EditIncome() {
  const router = useRouter();
  const { user } = useUserAuthStore();

  const currency = user?.currency || "INR";
  const currencySymbol = formatCurrencyLabel(currency);

  const [income, setIncome] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await fetchUserProfile();
      const p = res.data.profile;

      setIncome(String(Number(p.monthlyIncome || 0)));
      setBalance(String(Number(p.bankBalance || 0)));
    } catch {
      Alert.alert("Error", "Failed to load profile");
    }
  };

  const saveFinance = async () => {
    const cleanIncome = income.trim();
    const cleanBalance = balance.trim();

    if (!cleanIncome || !cleanBalance) {
      return Alert.alert("Error", "Both fields are required");
    }

    if (isNaN(cleanIncome) || isNaN(cleanBalance)) {
      return Alert.alert("Error", "Enter valid numeric values");
    }

    try {
      setLoading(true);

      const res = await updateFinance({
        monthlyIncome: Number(cleanIncome),
        bankBalance: Number(cleanBalance),
      });

      if (res.data.ok) {
        Alert.alert("Success", "Income & balance updated");
        router.back();
      } else {
        Alert.alert("Error", "Failed to update details");
      }
    } catch {
      Alert.alert("Error", "Server error while updating finance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Income & Balance</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {/* MONTHLY INCOME */}
          <Text style={styles.label}>
            Monthly Income ({currencySymbol})
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
            placeholder="Enter monthly income"
            placeholderTextColor="#9CA3AF"
          />

          {/* CURRENT BALANCE */}
          <Text style={styles.label}>
            Current Balance ({currencySymbol})
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={balance}
            onChangeText={setBalance}
            placeholder="Enter current balance"
            placeholderTextColor="#9CA3AF"
          />

          {/* SAVE */}
          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.6 }]}
            onPress={saveFinance}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------------- STYLES -------------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F7FBFA",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 7,
    borderRadius: 10,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },

  scroll: {
    padding: 20,
    paddingBottom: 130,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#FAFFFD",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginTop: 6,
    color: "#0F172A",
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
