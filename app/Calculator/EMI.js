import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
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
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan EMI Calculator</Text>
      </View>

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

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------- WALLETWAVE UI STYLES -------------------- */

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

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  /* CONTENT */
  container: { padding: 20 },

  /* INPUT CARD */
  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
    color: "#18493F",
  },

  input: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DCEFEA",
    marginTop: 6,
    fontSize: 16,
  },

  /* BUTTON */
  btn: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 14,
    marginTop: 22,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  /* RESULT CARD */
  resultCard: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  resultLabel: {
    fontSize: 17,
    fontWeight: "800",
    color: "#18493F",
  },

  resultValue: {
    fontSize: 30,
    fontWeight: "900",
    color: "#196F63",
    marginVertical: 10,
  },

  resultSub: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6F7E78",
    marginTop: 4,
  },
});
