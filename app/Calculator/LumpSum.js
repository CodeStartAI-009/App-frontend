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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lumpsum Calculator</Text>
      </View>

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
              <Text style={styles.resultLabel}>Wealth Gain</Text>
              <Text style={[styles.resultValue, { color: "#196F63" }]}>
                ₹{result.profit}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------- WALLETWAVE THEME STYLES ---------------- */

const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  backBtn: { paddingRight: 12 },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 4,
  },

  /* CONTENT */
  container: { paddingHorizontal: 24, paddingTop: 20 },

  /* CARD */
  card: {
    backgroundColor: "#F8FFFD",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
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
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 22,
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
    color: "#18493F",
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  resultLabel: {
    fontSize: 16,
    color: "#6F7E78",
    fontWeight: "600",
  },

  resultValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#196F63",
  },
});
