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
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

export default function EMI() {
  const router = useRouter();

  const [p, setP] = useState("");
  const [r, setR] = useState("");
  const [t, setT] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const P = Number(p);
    const R = Number(r);
    const T = Number(t);

    if (!P || !R || !T) return;

    const monthlyRate = R / (12 * 100);
    const months = T * 12;

    const emi =
      (P * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    const totalAmount = emi * months;
    const totalInterest = totalAmount - P;

    setResult({ emi, totalAmount, totalInterest });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <LinearGradient colors={["#1E9C87", "#0F5F52"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Loan EMI Calculator</Text>
      </LinearGradient>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Loan Amount (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={p}
            onChangeText={setP}
          />

          <Text style={styles.label}>Interest Rate (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={r}
            onChangeText={setR}
          />

          <Text style={styles.label}>Tenure (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={t}
            onChangeText={setT}
          />

          <TouchableOpacity style={styles.btn} onPress={calculate}>
            <Text style={styles.btnText}>Calculate EMI</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Monthly EMI</Text>
            <Text style={styles.resultValue}>₹{result.emi.toFixed(2)}</Text>

            <Text style={styles.resultSub}>
              Total Interest: ₹{result.totalInterest.toFixed(2)}
            </Text>

            <Text style={styles.resultSub}>
              Total Amount: ₹{result.totalAmount.toFixed(2)}
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: { padding: 16 },

  header: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: 10,
  },

  card: {
    backgroundColor: "#F0FAF7",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#CDEEE5",
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#18493F",
  },

  input: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDF0EA",
    marginTop: 6,
  },

  btn: {
    backgroundColor: "#1E9C87",
    padding: 14,
    borderRadius: 14,
    marginTop: 20,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  resultCard: {
    backgroundColor: "#E8FFF4",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C5EDE0",
  },

  resultLabel: { fontSize: 18, fontWeight: "700", color: "#18493F" },

  resultValue: {
    fontSize: 30,
    fontWeight: "900",
    color: "#1E9C87",
    marginVertical: 10,
  },

  resultSub: { fontSize: 15, fontWeight: "600", color: "#196F63", marginTop: 4 },
});
