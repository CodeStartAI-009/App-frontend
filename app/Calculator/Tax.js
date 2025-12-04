// app/Calculator/Tax.js
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

export default function Tax() {
  const [income, setIncome] = useState("");
  const [deduction, setDeduction] = useState("");
  const [tax, setTax] = useState(null);

  const calculateTax = () => {
    let taxable = Number(income) - Number(deduction);
    if (taxable < 0) taxable = 0;

    let amount = taxable;

    // OLD REGIME TAX SLABS
    let calculatedTax = 0;

    if (amount <= 250000) calculatedTax = 0;
    else if (amount <= 500000)
      calculatedTax = (amount - 250000) * 0.05;
    else if (amount <= 1000000)
      calculatedTax =
        250000 * 0.05 + (amount - 500000) * 0.2;
    else
      calculatedTax =
        250000 * 0.05 + 500000 * 0.2 + (amount - 1000000) * 0.3;

    // 4% CESS
    calculatedTax += calculatedTax * 0.04;

    setTax(calculatedTax);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
       
        {/* HEADER */}
        <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
          <Text style={styles.header}>Income Tax Calculator</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Annual Income (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
            placeholder="Enter yearly income"
          />

          <Text style={styles.label}>Deductions (80C etc.)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={deduction}
            onChangeText={setDeduction}
            placeholder="Enter deductions"
          />

          <TouchableOpacity style={styles.btn} onPress={calculateTax}>
            <Text style={styles.btnText}>Calculate Tax</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT */}
        {tax !== null && (
          <View style={styles.resultCard}>
            <Ionicons name="receipt-outline" size={32} color="#196F63" />
            <Text style={styles.resultValue}>₹{tax.toLocaleString()}</Text>
            <Text style={styles.resultLabel}>Total Tax Payable</Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* ------------------- STYLES ------------------- */
const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 60 },

  headerRow: { marginBottom: 20 },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#18493F",
  },

  card: {
    backgroundColor: "#F1F8F6",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    marginBottom: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    color: "#18493F",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
  },

  btn: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },

  resultCard: {
    backgroundColor: "#F8FFFD",
    padding: 24,
    borderRadius: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },
  resultValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#196F63",
    marginTop: 10,
  },
  resultLabel: { fontSize: 16, marginTop: 4, color: "#18493F" },
});
