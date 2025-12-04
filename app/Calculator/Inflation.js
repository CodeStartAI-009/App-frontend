import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";

export default function Inflation() {
  const [currentValue, setCurrentValue] = useState("");
  const [inflation, setInflation] = useState("");
  const [years, setYears] = useState("");
  const [futureValue, setFutureValue] = useState(null);

  const calculateInflation = () => {
    if (!currentValue || !inflation || !years) return;

    const P = parseFloat(currentValue);
    const r = parseFloat(inflation) / 100;
    const n = parseFloat(years);

    const FV = P * Math.pow(1 + r, n);

    setFutureValue(FV.toFixed(2));
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }}>
        {/* HEADER */}
        <LinearGradient
          colors={["#1c7c6e", "#0f4f45"]}
          style={styles.header}
        >
           <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

          <Text style={styles.headerText}>Inflation Impact</Text>
          <Text style={styles.subText}>
            Understand how inflation reduces value over time.
          </Text>
        </LinearGradient>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Current Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter current value"
            keyboardType="numeric"
            value={currentValue}
            onChangeText={setCurrentValue}
          />

          <Text style={styles.label}>Annual Inflation Rate (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 6"
            keyboardType="numeric"
            value={inflation}
            onChangeText={setInflation}
          />

          <Text style={styles.label}>Number of Years</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 10"
            keyboardType="numeric"
            value={years}
            onChangeText={setYears}
          />

          {/* BUTTON */}
          <TouchableOpacity style={styles.button} onPress={calculateInflation}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {futureValue && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Future Value After Inflation</Text>
            <Text style={styles.resultValue}>₹ {futureValue}</Text>

            <Text style={styles.note}>
              This is how much the current amount will be worth after inflation.
            </Text>
          </View>
        )}

        <View style={{ height: 90 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <BottomNav active="calculator" />
    </View>
  );
}

/* ------------------------------ STYLES ------------------------------ */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { paddingBottom: 20 },
  headerText: { fontSize: 28, fontWeight: "800", color: "#fff" },
  subText: { color: "#d6f5ef", marginTop: 5, fontSize: 14 },

  card: {
    backgroundColor: "#f8fffd",
    marginTop: -20,
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#d8ede6",
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
    borderColor: "#cfe8e2",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },

  button: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  resultCard: {
    backgroundColor: "#E8FFF7",
    padding: 20,
    margin: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#C4F1E6",
  },

  resultLabel: {
    fontSize: 16,
    color: "#0f4f45",
    fontWeight: "700",
  },

  resultValue: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 10,
    color: "#196F63",
  },

  note: {
    marginTop: 10,
    color: "#5a837c",
    fontSize: 14,
  },
});
