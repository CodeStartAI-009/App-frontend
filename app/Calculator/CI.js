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

export default function CI() {
  const router = useRouter();

  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [n, setN] = useState("1"); // compounding frequency
  const [result, setResult] = useState(null);

  const calculateCI = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);
    const nn = parseFloat(n);

    if (isNaN(p) || isNaN(r) || isNaN(t) || isNaN(nn) || p <= 0 || r <= 0 || t <= 0 || nn <= 0) {
      setResult(null);
      return;
    }

    const amount = p * Math.pow(1 + r / nn, nn * t);
    const ci = amount - p;

    setResult({ amount, ci });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <LinearGradient colors={["#1FA084", "#16795A"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Compound Interest</Text>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Input Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Principal Amount (₹)</Text>
          <TextInput
            placeholder="Enter amount"
            keyboardType="numeric"
            style={styles.input}
            value={principal}
            onChangeText={setPrincipal}
          />

          <Text style={styles.label}>Rate (%)</Text>
          <TextInput
            placeholder="Enter rate"
            keyboardType="numeric"
            style={styles.input}
            value={rate}
            onChangeText={setRate}
          />

          <Text style={styles.label}>Time (Years)</Text>
          <TextInput
            placeholder="Enter years"
            keyboardType="numeric"
            style={styles.input}
            value={time}
            onChangeText={setTime}
          />

          <Text style={styles.label}>Compounding Frequency (n)</Text>
          <TextInput
            placeholder="1 = Yearly, 4 = Quarterly, 12 = Monthly"
            keyboardType="numeric"
            style={styles.input}
            value={n}
            onChangeText={setN}
          />

          <TouchableOpacity style={styles.btn} onPress={calculateCI}>
            <Text style={styles.btnText}>CALCULATE</Text>
          </TouchableOpacity>
        </View>

        {/* Result Card */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Compound Interest</Text>
            <Text style={styles.resultValue}>₹{result.ci.toFixed(2)}</Text>

            <Text style={[styles.resultLabel, { marginTop: 12 }]}>
              Total Amount
            </Text>
            <Text style={[styles.resultValue, { color: "#16795A" }]}>
              ₹{result.amount.toFixed(2)}
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* ---- Styles ---- */
const styles = StyleSheet.create({
  header: {
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    elevation: 6,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  card: {
    margin: 20,
    backgroundColor: "#F6FFFB",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D7F3EA",
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 10,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    marginTop: 6,
    borderRadius: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DCEFE8",
  },

  btn: {
    backgroundColor: "#1FA084",
    padding: 16,
    borderRadius: 14,
    marginTop: 20,
    elevation: 2,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },

  resultCard: {
    marginHorizontal: 20,
    backgroundColor: "#E9FFF6",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C9F2E4",
    elevation: 2,
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18493F",
  },
  resultValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1FA084",
    marginTop: 4,
  },
});
