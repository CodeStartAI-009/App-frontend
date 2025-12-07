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
  const router = useRouter();

  const [corpus, setCorpus] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("12");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const FV = Number(corpus);
    const R = Number(rate) / 100 / 12;
    const N = Number(years) * 12;

    if (!FV || !R || !N) return setResult(null);

    const SIP = (FV * R) / (Math.pow(1 + R, N) - 1);
    setResult(SIP.toFixed(2));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Retirement Planner</Text>
        </View>

        <Text style={styles.headerSubText}>
          Estimate the monthly SIP required to reach your retirement wealth goal.
        </Text>

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

          <TouchableOpacity style={styles.calcBtn} onPress={calculate}>
            <Text style={styles.calcBtnText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {result && (
          <View style={styles.resultCard}>
            <Ionicons name="trending-up-outline" size={44} color="#196F63" />

            <Text style={styles.resultTitle}>Monthly SIP Required</Text>
            <Text style={styles.resultValue}>₹{result}</Text>

            <Text style={styles.resultNote}>
              Invest this amount every month to reach your retirement goal 🎯
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------------- WALLETWAVE THEME STYLES ---------------------- */

const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  backBtn: { paddingRight: 12 },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 4,
  },

  headerSubText: {
    paddingHorizontal: 20,
    marginTop: 10,
    fontSize: 15,
    color: "#6F7E78",
  },

  /* INPUT CARD */
  card: {
    backgroundColor: "#F8FFFD",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
    color: "#18493F",
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
    marginTop: 22,
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  calcBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  /* RESULT CARD */
  resultCard: {
    marginHorizontal: 20,
    marginTop: 26,
    padding: 26,
    backgroundColor: "#F8FFFD",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    alignItems: "center",
  },

  resultTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    color: "#18493F",
  },

  resultValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#196F63",
    marginVertical: 10,
  },

  resultNote: {
    fontSize: 14,
    textAlign: "center",
    color: "#6F7E78",
    marginTop: 6,
  },
});
