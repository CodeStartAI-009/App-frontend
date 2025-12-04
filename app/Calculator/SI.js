// app/Calculator/SI.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

export default function SI() {
  const router = useRouter();

  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = parseFloat(principal);
    const R = parseFloat(rate);
    const T = parseFloat(time);

    if (!P || !R || !T) {
      setResult(null);
      return;
    }

    const SI = (P * R * T) / 100;
    const total = P + SI;

    setResult({
      interest: SI.toFixed(2),
      total: total.toFixed(2),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ------- HEADER ------- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Simple Interest</Text>
      </View>

      {/* ------- SCROLL AREA ------- */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* --- INPUT CARD --- */}
        <View style={styles.card}>
          <Text style={styles.label}>Principal Amount (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter amount"
            value={principal}
            onChangeText={setPrincipal}
          />

          <Text style={styles.label}>Rate of Interest (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter rate"
            value={rate}
            onChangeText={setRate}
          />

          <Text style={styles.label}>Time Period (years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter time"
            value={time}
            onChangeText={setTime}
          />

          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Text style={styles.calcBtnText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* ---- RESULT ---- */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Result</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Simple Interest:</Text>
              <Text style={styles.resultValue}>₹{result.interest}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Amount:</Text>
              <Text style={styles.resultValue}>₹{result.total}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <BottomNav active="calculator" />
    </View>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#196F63",
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 15,
  },

  scroll: { padding: 20 },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDEFEA",
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
  },

  calcBtn: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  calcBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  resultCard: {
    backgroundColor: "#EAF6F3",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C7E6DF",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 15,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  resultLabel: { fontSize: 15, color: "#18493F" },
  resultValue: { fontSize: 16, fontWeight: "800", color: "#196F63" },
});
