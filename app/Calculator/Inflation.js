// app/Calculator/Inflation.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import BottomNav from "../components/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Inflation() {
  const router = useRouter();

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
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >

        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Inflation Impact</Text>
        </View>

        <Text style={styles.subText}>
          Understand how inflation reduces the value of your money over time.
        </Text>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Current Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="numeric"
            value={currentValue}
            onChangeText={setCurrentValue}
          />

          <Text style={styles.label}>Annual Inflation Rate (%)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 6"
            keyboardType="numeric"
            value={inflation}
            onChangeText={setInflation}
          />

          <Text style={styles.label}>Number of Years</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            keyboardType="numeric"
            value={years}
            onChangeText={setYears}
          />

          <TouchableOpacity style={styles.button} onPress={calculateInflation}>
            <Text style={styles.buttonText}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT CARD */}
        {futureValue && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Future Value (After Inflation)</Text>

            <Text style={styles.resultValue}>₹ {futureValue}</Text>

            <Text style={styles.note}>
              This is what your money will be worth after adjusting for inflation.
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------------- WALLETWAVE THEME -------------------------- */

const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    elevation: 2,
  },

  backBtn: { paddingRight: 12 },

  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 6,
  },

  subText: {
    paddingHorizontal: 20,
    marginTop: 12,
    fontSize: 14,
    color: "#6F7E78",
    fontWeight: "500",
  },

  /* INPUT CARD */
  card: {
    backgroundColor: "#F8FFFD",
    marginTop: 20,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 14,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DCEFEA",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
  },

  /* BUTTON */
  button: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  /* RESULT CARD */
  resultCard: {
    backgroundColor: "#F8FFFD",
    padding: 22,
    marginHorizontal: 20,
    marginTop: 26,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    borderRadius: 16,
  },

  resultLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  resultValue: {
    fontSize: 32,
    fontWeight: "900",
    marginTop: 12,
    color: "#196F63",
  },

  note: {
    marginTop: 10,
    fontSize: 14,
    color: "#6F7E78",
    fontWeight: "500",
  },
});
