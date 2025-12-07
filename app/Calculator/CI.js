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

export default function CI() {
  const router = useRouter();

  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [n, setN] = useState("1");
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

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Compound Interest</Text>
      </View>

      {/* CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* INPUT CARD */}
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
            <Text style={styles.btnText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {result && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Compound Interest</Text>
            <Text style={styles.resultValue}>₹{result.ci.toFixed(2)}</Text>

            <Text style={[styles.resultLabel, { marginTop: 14 }]}>Total Amount</Text>
            <Text style={[styles.resultValue, { color: "#196F63" }]}>
              ₹{result.amount.toFixed(2)}
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------------- WALLETWAVE THEMED STYLES ---------------------- */
const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  backBtn: { paddingRight: 12 },

  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },

  /* INPUT CARD */
  card: {
    marginTop: 24,
    marginHorizontal: 24,
    backgroundColor: "#F8FFFD",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    marginTop: 6,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DCEFEA",
  },

  /* BUTTON */
  btn: {
    backgroundColor: "#196F63",
    padding: 16,
    borderRadius: 14,
    marginTop: 22,
  },

  btnText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  /* RESULT CARD */
  resultCard: {
    marginTop: 20,
    marginHorizontal: 24,
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
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
    color: "#196F63",
    marginTop: 4,
  },
});
