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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Simple Interest</Text>
      </View>

      {/* CONTENT */}
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

      {/* BOTTOM NAV */}
      <BottomNav active="calculator" />
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#196F63",
    paddingTop: 55,
    paddingBottom: 22,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 12,
  },

  scroll: { padding: 20 },

  card: {
    backgroundColor: "#F8FFFD",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#DDEFEA",
    elevation: 2,
    marginBottom: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFE8E2",
    borderRadius: 10,
    padding: 12,
    marginTop: 6,
    fontSize: 16,
  },

  calcBtn: {
    backgroundColor: "#196F63",
    padding: 15,
    borderRadius: 14,
    marginTop: 20,
    alignItems: "center",
  },

  calcBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  resultCard: {
    backgroundColor: "#EAF6F3",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C7E6DF",
  },

  resultTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 15,
  },

  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  resultLabel: {
    fontSize: 15,
    color: "#18493F",
  },

  resultValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#196F63",
  },
});
