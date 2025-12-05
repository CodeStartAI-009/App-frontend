// app/Calculator/Retirement.js
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
import { useRouter } from "expo-router";

export default function Retirement() {
  const router = useRouter();            // ✅ FIXED (router missing)
  const [corpus, setCorpus] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("12");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const FV = Number(corpus);
    const R = Number(rate) / 100 / 12;
    const N = Number(years) * 12;

    if (!FV || !R || !N) {
      setResult(null);
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
            placeholder="e.g., 20000000"
            value={corpus}
            onChangeText={setCorpus}
          />

          <Text style={styles.label}>Years to Invest</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g., 25"
            value={years}
            onChangeText={setYears}
          />

          <Text style={styles.label}>Expected Return per year (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g., 12"
            value={rate}
            onChangeText={setRate}
          />

          {/* BUTTON */}
          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Text style={styles.calcBtnText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT SECTION */}
        {result && (
          <View style={styles.resultCard}>
            <Ionicons name="trending-up-outline" size={40} color="#196F63" />
            <Text style={styles.resultTitle}>Monthly SIP Required</Text>
            <Text style={styles.resultValue}>₹{result}</Text>
            <Text style={styles.resultNote}>
              Invest this amount monthly to reach your retirement goal 🎯
            </Text>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */
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
    marginTop: 10,
  },
  headerSub: {
    fontSize: 15,
    color: "#E5FFFA",
    marginTop: 5,
  },

  card: {
    backgroundColor: "#F7FFFD",
    margin: 16,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1F0E8",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
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
    paddingVertical: 16,
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
    marginTop: 10,
    color: "#18493F",
  },
  resultValue: {
    fontSize: 32,
    fontWeight: "900",
    color: "#196F63",
    marginVertical: 8,
  },
  resultNote: {
    fontSize: 14,
    color: "#4B6F68",
    textAlign: "center",
  },
});
