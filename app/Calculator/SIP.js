// app/Calculator/SIP.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SIP() {
  const router = useRouter();

  const [monthly, setMonthly] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  const calculateSIP = () => {
    if (!monthly || !rate || !years) return;

    const P = Number(monthly);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;

    const amount = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);

    const invested = P * n;
    const profit = amount - invested;

    setResult({
      invested: invested.toFixed(0),
      amount: amount.toFixed(0),
      profit: profit.toFixed(0),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>SIP Calculator</Text>
      </View>

      {/* CONTENT */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Monthly Investment (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={monthly}
            onChangeText={setMonthly}
            placeholder="Enter amount"
          />

          <Text style={styles.label}>Expected Return (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rate}
            onChangeText={setRate}
            placeholder="Enter expected %"
          />

          <Text style={styles.label}>Time Period (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={years}
            onChangeText={setYears}
            placeholder="Enter years"
          />

          <TouchableOpacity style={styles.calcBtn} onPress={calculateSIP}>
            <Text style={styles.calcBtnText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultHeader}>Results</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Invested</Text>
              <Text style={styles.resultValue}>₹{result.invested}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Future Value</Text>
              <Text style={styles.resultValue}>₹{result.amount}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Wealth Gain</Text>
              <Text style={[styles.resultValue, styles.profitValue]}>
                ₹{result.profit}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------- WALLETWAVE THEME -------------------- */

const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  backBtn: { paddingRight: 12 },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  /* CONTENT */
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  /* INPUT CARD */
  card: {
    backgroundColor: "#F8FFFD",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 14,
  },

  input: {
    borderWidth: 1,
    borderColor: "#DCEFEA",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: "#fff",
    fontSize: 16,
  },

  /* BUTTON */
  calcBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 26,
  },

  calcBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  /* RESULT CARD */
  resultCard: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  resultHeader: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 16,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  resultLabel: {
    fontSize: 15,
    color: "#6F7E78",
    fontWeight: "600",
  },

  resultValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#196F63",
  },

  profitValue: {
    color: "#0EAD91",
  },
});
