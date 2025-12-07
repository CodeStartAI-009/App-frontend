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

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Simple Interest</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Principal Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={principal}
            onChangeText={setPrincipal}
          />

          <Text style={styles.label}>Rate of Interest (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter rate"
            keyboardType="numeric"
            value={rate}
            onChangeText={setRate}
          />

          <Text style={styles.label}>Time Period (Years)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter time"
            keyboardType="numeric"
            value={time}
            onChangeText={setTime}
          />

          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Text style={styles.calcBtnText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Results</Text>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Simple Interest</Text>
              <Text style={styles.resultValue}>₹{result.interest}</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Total Amount</Text>
              <Text style={styles.resultValue}>₹{result.total}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------- WALLETWAVE THEME -------------------- */

const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    backgroundColor: "#196F63",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  backBtn: { paddingRight: 12 },

  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  scroll: { padding: 20 },

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
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DCEFEA",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
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

  resultTitle: {
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
});
