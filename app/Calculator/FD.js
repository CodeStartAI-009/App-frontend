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

  const [mode, setMode] = useState("FD"); // FD / RD
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState(""); // in years
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseFloat(amount);
    const R = parseFloat(rate);
    const T = parseFloat(time);

    if (!P || !R || !T) {
      setResult(null);
      return;
    }

    let maturity = 0;
    let interest = 0;

    if (mode === "FD") {
      // FD compound interest annually
      maturity = P * Math.pow(1 + R / 100, T);
      interest = maturity - P;
    } else {
      // RD monthly deposit compounded quarterly
      const n = T * 12; // number of months
      const monthlyRate = R / (4 * 100);
      const quarters = T * 4;

      maturity =
        P *
        (((1 + monthlyRate) ** quarters - 1) / (1 - (1 + monthlyRate) ** -1));

      interest = maturity - P * n;
    }

    setResult({
      maturity: maturity.toFixed(2),
      interest: interest.toFixed(2),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <LinearGradient
        colors={["#1A726A", "#0F4C45"]}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>FD / RD Calculator</Text>
      </LinearGradient>

      {/* CONTENT */}
      <ScrollView style={styles.container}>
        {/* Mode Switch */}
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
            placeholder="Enter rate"
          />

          <Text style={styles.label}>Time (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={time}
            onChangeText={setTime}
            placeholder="Enter time"
          />
        </View>

        {/* Calculate Button */}
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
              <Text style={styles.rLabel}>Total Interest</Text>
              <Text style={styles.rValue}>₹{result.interest}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* ----------------------------- STYLES ------------------------------ */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 10,
  },

  container: { padding: 20 },

  /* Mode Switch */
  modeRow: {
    flexDirection: "row",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    backgroundColor: "#E8F6F3",
    borderRadius: 10,
    alignItems: "center",
  },
  modeText: {
    fontSize: 16,
    color: "#18493F",
    fontWeight: "600",
  },
  activeMode: { backgroundColor: "#196F63" },
  activeModeText: { color: "#fff" },

  /* Card */
  card: {
    backgroundColor: "#F8FFFD",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
    marginBottom: 6,
    marginTop: 10,
  },

  input: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D9E8E4",
    fontSize: 16,
  },

  calcBtn: {
    backgroundColor: "#1A726A",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 20,
  },
  calcText: { color: "#fff", fontSize: 18, fontWeight: "700" },

  /* Result Card */
  resultCard: {
    backgroundColor: "#F1FBF8",
    borderRadius: 16,
    padding: 18,
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
  rLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18493F",
  },
  rValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#196F63",
  },
});
