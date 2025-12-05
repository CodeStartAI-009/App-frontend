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
import { LinearGradient } from "expo-linear-gradient";
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

    // SIP Formula
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
      <LinearGradient
        colors={["#1FA084", "#16795A"]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>SIP Calculator</Text>
      </LinearGradient>

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
            placeholder="Enter rate"
          />

          <Text style={styles.label}>Time Period (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={years}
            onChangeText={setYears}
            placeholder="Enter years"
          />

          {/* BUTTON */}
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
              <Text style={styles.resultLabel}>Total Value</Text>
              <Text style={styles.resultValue}>₹{result.amount}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel]}>Wealth Gain</Text>
              <Text style={[styles.resultValue, { color: "#1FA084" }]}>
                ₹{result.profit}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <BottomNav active="calculator" />
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    marginTop: 10,
  },

  container: { padding: 20 },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDEEEA",
    marginBottom: 20,
    elevation: 2,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 12,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CFE8E2",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    backgroundColor: "#fff",
    fontSize: 16,
  },

  calcBtn: {
    backgroundColor: "#1FA084",
    padding: 14,
    borderRadius: 12,
    marginTop: 22,
    alignItems: "center",
  },
  calcBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  resultCard: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDEEEA",
    elevation: 2,
  },

  resultHeader: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 16,
    color: "#18493F",
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  resultLabel: { fontSize: 16, color: "#18493F" },
  resultValue: { fontSize: 18, fontWeight: "800", color: "#18493F" },
});
