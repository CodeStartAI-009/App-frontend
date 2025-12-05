// app/Calculator/LumpSum.js
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

export default function LumpSum() {
  const router = useRouter();

  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState(null);

  const calculateLumpSum = () => {
    if (!principal || !rate || !years) return;

    const P = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const n = parseFloat(years);

    // Lumpsum Formula → A = P(1+r)^n
    const amount = P * Math.pow(1 + r, n);
    const profit = amount - P;

    setResult({
      invested: P.toFixed(0),
      amount: amount.toFixed(0),
      profit: profit.toFixed(0),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <LinearGradient
        colors={["#196F63", "#0F3F36"]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lumpsum Calculator</Text>
      </LinearGradient>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Investment Amount (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={principal}
            onChangeText={setPrincipal}
            placeholder="Enter amount"
          />

          <Text style={styles.label}>Expected Return (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rate}
            onChangeText={setRate}
            placeholder="Enter annual return %"
          />

          <Text style={styles.label}>Time Period (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={years}
            onChangeText={setYears}
            placeholder="Enter duration"
          />

          <TouchableOpacity style={styles.calcBtn} onPress={calculateLumpSum}>
            <Text style={styles.calcBtnText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Results</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Invested</Text>
              <Text style={styles.resultValue}>₹{result.invested}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Future Value</Text>
              <Text style={styles.resultValue}>₹{result.amount}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={[styles.resultLabel]}>Wealth Gain</Text>
              <Text style={[styles.resultValue, { color: "#198754" }]}>
                ₹{result.profit}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 70,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
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
    marginTop: 10,
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
    backgroundColor: "#196F63",
    padding: 16,
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
  },

  resultTitle: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#18493F" },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  resultLabel: { fontSize: 16, color: "#18493F" },
  resultValue: { fontSize: 18, fontWeight: "700" },
});

 
