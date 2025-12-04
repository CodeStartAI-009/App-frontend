import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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

  const calculateSip = () => {
    if (!monthly || !rate || !years) return;

    const P = Number(monthly);
    const r = Number(rate) / 100 / 12;
    const n = Number(years) * 12;

    const maturity = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const invested = P * n;
    const gain = maturity - invested;

    setResult({
      invested: invested.toFixed(0),
      gain: gain.toFixed(0),
      total: maturity.toFixed(0),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <LinearGradient
        colors={["#0c9488", "#0f5f54"]}
        style={styles.header}
      >
         <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>SIP Calculator</Text>
      </LinearGradient>

      <ScrollView style={{ padding: 20 }}>
        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Monthly Investment (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={monthly}
            onChangeText={setMonthly}
            placeholder="e.g. 5000"
          />

          <Text style={styles.label}>Expected Return (% per year)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rate}
            onChangeText={setRate}
            placeholder="e.g. 12"
          />

          <Text style={styles.label}>Time Period (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={years}
            onChangeText={setYears}
            placeholder="e.g. 10"
          />

          <TouchableOpacity style={styles.calcBtn} onPress={calculateSip}>
            <Text style={styles.calcText}>CALCULATE</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Results</Text>

            <View style={styles.row}>
              <Text style={styles.resultLabel}>Total Invested</Text>
              <Text style={styles.resultValue}>₹{result.invested}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.resultLabel}>Total Gain</Text>
              <Text style={styles.resultValueGreen}>₹{result.gain}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.resultLabel}>Maturity Amount</Text>
              <Text style={styles.resultValueBlue}>₹{result.total}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: 8,
  },
  card: {
    backgroundColor: "#F1F8F6",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#D6EDE7",
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    color: "#18493F",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    borderWidth: 1,
    borderColor: "#E2E8E5",
    fontSize: 16,
  },
  calcBtn: {
    marginTop: 18,
    backgroundColor: "#0C7C70",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  calcText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DDEDEA",
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#18493F",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  resultLabel: { fontSize: 16, color: "#18493F" },
  resultValue: { fontSize: 18, fontWeight: "700", color: "#18493F" },
  resultValueGreen: { fontSize: 18, fontWeight: "700", color: "#0C7C70" },
  resultValueBlue: { fontSize: 18, fontWeight: "700", color: "#0C62A1" },
});
