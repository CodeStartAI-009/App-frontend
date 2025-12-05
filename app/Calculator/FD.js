// app/Calculator/FD_RD.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FD_RD() {
  const router = useRouter();

  const [mode, setMode] = useState("FD"); // FD or RD
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const R = parseFloat(rate);
    const T = parseFloat(time);

    if (!P || !R || !T) return setResult(null);

    let maturity = 0;
    let interest = 0;

    if (mode === "FD") {
      // FD — compounded annually
      maturity = P * Math.pow(1 + R / 100, T);
      interest = maturity - P;
    } else {
      // RD — corrected and proper formula
      const monthlyDeposit = P;
      const monthlyRate = R / 100 / 12;
      const n = T * 12; // number of months

      maturity =
        monthlyDeposit *
        (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) * (1 + monthlyRate));

      interest = maturity - monthlyDeposit * n;
    }

    setResult({
      maturity: maturity.toFixed(2),
      interest: interest.toFixed(2),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <LinearGradient colors={["#1A726A", "#0F4C45"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>FD / RD Calculator</Text>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* MODE SWITCH */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            onPress={() => setMode("FD")}
            style={[styles.modeBtn, mode === "FD" && styles.activeMode]}
          >
            <Text style={[styles.modeText, mode === "FD" && styles.activeModeText]}>
              Fixed Deposit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode("RD")}
            style={[styles.modeBtn, mode === "RD" && styles.activeMode]}
          >
            <Text style={[styles.modeText, mode === "RD" && styles.activeModeText]}>
              Recurring Deposit
            </Text>
          </TouchableOpacity>
        </View>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Deposit Amount (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
          />

          <Text style={styles.label}>Interest Rate (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rate}
            onChangeText={setRate}
            placeholder="Enter interest rate"
          />

          <Text style={styles.label}>Time (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={time}
            onChangeText={setTime}
            placeholder="Enter duration"
          />
        </View>

        {/* CALCULATE BUTTON */}
        <TouchableOpacity onPress={calculate} style={styles.calcBtn}>
          <Text style={styles.calcText}>Calculate</Text>
        </TouchableOpacity>

        {/* RESULT CARD */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Results</Text>

            <View style={styles.resultRow}>
              <Text style={styles.rLabel}>Maturity Value</Text>
              <Text style={styles.rValue}>₹{result.maturity}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.rLabel}>Total Interest Earned</Text>
              <Text style={styles.rValue}>₹{result.interest}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* ----------------------------- STYLES ------------------------------ */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: 10,
  },

  container: { padding: 20 },

  modeRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#E8F6F3",
    alignItems: "center",
    marginHorizontal: 5,
  },
  modeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18493F",
  },
  activeMode: { backgroundColor: "#196F63" },
  activeModeText: { color: "#fff" },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEFEA",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 12,
  },

  input: {
    padding: 12,
    marginTop: 6,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },

  calcBtn: {
    backgroundColor: "#1A726A",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 20,
  },
  calcText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  resultCard: {
    backgroundColor: "#F1FBF8",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CDEFE6",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 15,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 8,
  },
  rLabel: { fontSize: 16, fontWeight: "600", color: "#18493F" },
  rValue: { fontSize: 18, fontWeight: "700", color: "#196F63" },
});
