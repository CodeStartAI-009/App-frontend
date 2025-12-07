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
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function FD_RD() {
  const router = useRouter();

  const [mode, setMode] = useState("FD");
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
      maturity = P * Math.pow(1 + R / 100, T);
      interest = maturity - P;
    } else {
      const monthlyDeposit = P;
      const monthlyRate = R / 100 / 12;
      const n = T * 12;

      maturity =
        monthlyDeposit *
        (((Math.pow(1 + monthlyRate, n) - 1) / monthlyRate) *
          (1 + monthlyRate));

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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>FD / RD Calculator</Text>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* MODE SWITCH */}
        <View style={styles.modeRow}>
          <TouchableOpacity
            onPress={() => setMode("FD")}
            style={[styles.modeBtn, mode === "FD" && styles.activeMode]}
          >
            <Text
              style={[styles.modeText, mode === "FD" && styles.activeModeText]}
            >
              Fixed Deposit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setMode("RD")}
            style={[styles.modeBtn, mode === "RD" && styles.activeMode]}
          >
            <Text
              style={[styles.modeText, mode === "RD" && styles.activeModeText]}
            >
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

      <BottomNav active="profile" />
    </View>
  );
}

/* ----------------------------- WALLETWAVE THEME ------------------------------ */

const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  backBtn: { paddingRight: 12 },

  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  /* CONTENT CONTAINER */
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  /* MODE SWITCH */
  modeRow: {
    flexDirection: "row",
    marginBottom: 20,
  },

  modeBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F8FFFD",
    alignItems: "center",
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  modeText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6F7E78",
  },

  activeMode: {
    backgroundColor: "#196F63",
    borderColor: "#196F63",
  },

  activeModeText: {
    color: "#fff",
  },

  /* CARD */
  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
  },

  input: {
    padding: 12,
    marginTop: 6,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DCEFEA",
    fontSize: 16,
  },

  /* CALC BUTTON */
  calcBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 22,
  },

  calcText: {
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
    marginBottom: 20,
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
    color: "#6F7E78",
  },

  rValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#196F63",
  },
});
