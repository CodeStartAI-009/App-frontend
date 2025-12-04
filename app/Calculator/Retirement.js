import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

// Retirement Formula:
// Required Monthly SIP = [ FV × r ] / [ (1+r)^n – 1 ]
// FV = Final Retirement Corpus
// r = Monthly Interest Rate
// n = Number of months investing

export default function Retirement() {
  const [corpus, setCorpus] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("12"); // default return like equity MF
  const [result, setResult] = useState(null);

  const calculate = () => {
    const FV = Number(corpus);
    const R = Number(rate) / 100 / 12;
    const N = Number(years) * 12;

    if (!FV || !R || !N) {
      setResult("Please fill all fields correctly.");
      return;
    }

    const SIP = (FV * R) / (Math.pow(1 + R, N) - 1);

    setResult(SIP.toFixed(2));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
          <Text style={styles.headerTitle}>Retirement Planner</Text>
          <Text style={styles.headerSub}>Plan your future wealth</Text>
        </View>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Target Retirement Corpus (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={corpus}
            onChangeText={setCorpus}
            placeholder="e.g., 2,00,00,000"
          />

          <Text style={styles.label}>Years to Invest</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={years}
            onChangeText={setYears}
            placeholder="e.g., 25"
          />

          <Text style={styles.label}>Expected Return (% per year)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={rate}
            onChangeText={setRate}
            placeholder="e.g., 12"
          />

          {/* CALCULATE BUTTON */}
          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Text style={styles.calcBtnText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT */}
        {result && (
          <View style={styles.resultCard}>
            <Ionicons name="trending-up-outline" size={32} color="#196F63" />
            <Text style={styles.resultTitle}>Monthly SIP Required</Text>
            <Text style={styles.resultValue}>₹{result}</Text>
            <Text style={styles.resultNote}>
              Invest this amount monthly to reach your goal 🎯
            </Text>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* -------------------------- STYLES -------------------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  headerSub: {
    fontSize: 15,
    color: "#E5FFFA",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#F7FFFD",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    borderColor: "#D1F0E8",
    borderWidth: 1,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 10,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDEEEA",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    fontSize: 16,
  },

  calcBtn: {
    marginTop: 20,
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  calcBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  resultCard: {
    margin: 16,
    padding: 22,
    backgroundColor: "#EFFFFA",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C7EDE3",
    alignItems: "center",
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 8,
  },
  resultValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#196F63",
    marginVertical: 8,
  },
  resultNote: {
    fontSize: 14,
    color: "#4B6F68",
    marginTop: 4,
  },
});
