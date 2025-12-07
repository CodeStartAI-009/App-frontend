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
import { useRouter } from "expo-router";

export default function Tax() {
  const router = useRouter();

  const deductionOptions = [
    { key: "80C", label: "80C — PPF, ELSS, LIC, etc", max: 150000 },
    { key: "80D", label: "80D — Medical Insurance", max: 50000 },
    { key: "80E", label: "80E — Education Loan Interest", max: Infinity },
    { key: "80TTA", label: "80TTA — Savings Interest", max: 10000 },
    { key: "80G", label: "80G — Donations", max: Infinity },
  ];

  const [income, setIncome] = useState("");
  const [selectedDeductions, setSelectedDeductions] = useState({});
  const [showDeductions, setShowDeductions] = useState(false);
  const [taxResult, setTaxResult] = useState(null);

  const toggleDeduction = (key) => {
    setSelectedDeductions((prev) => ({
      ...prev,
      [key]: prev[key] ? undefined : "0",
    }));
  };

  const updateDeductionAmount = (key, value, max) => {
    let amount = Number(value);
    if (amount > max) amount = max;

    setSelectedDeductions((prev) => ({
      ...prev,
      [key]: amount.toString(),
    }));
  };

  const calculateTax = () => {
    const yearlyIncome = Number(income);
    if (!yearlyIncome) return;

    let totalDeduction = 0;

    Object.values(selectedDeductions).forEach((v) => {
      if (v) totalDeduction += Number(v);
    });

    let taxable = yearlyIncome - totalDeduction;
    if (taxable < 0) taxable = 0;

    let tax = 0;
    let amt = taxable;

    // ------- OLD TAX SLABS -------
    if (amt <= 250000) tax = 0;
    else if (amt <= 500000) tax = (amt - 250000) * 0.05;
    else if (amt <= 1000000)
      tax = 250000 * 0.05 + (amt - 500000) * 0.2;
    else
      tax =
        250000 * 0.05 +
        500000 * 0.2 +
        (amt - 1000000) * 0.3;

    const cess = tax * 0.04;
    tax += cess;

    setTaxResult({
      yearlyIncome,
      taxableIncome: taxable,
      totalDeduction,
      tax,
      cess,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* HEADER */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Income Tax Calculator</Text>
        </View>

        {/* EXPLANATION */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={22} color="#196F63" />
          <Text style={styles.infoText}>
            Enter your income and deductions to estimate your tax under the Old Regime.
          </Text>
        </View>

        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Annual Income (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter yearly income"
            value={income}
            onChangeText={setIncome}
          />

          {/* DEDUCTION TOGGLE */}
          <TouchableOpacity
            onPress={() => setShowDeductions(!showDeductions)}
            style={styles.dropdown}
          >
            <Text style={styles.dropdownText}>Add Deductions (optional)</Text>
            <Ionicons
              name={showDeductions ? "chevron-up" : "chevron-down"}
              size={20}
              color="#18493F"
            />
          </TouchableOpacity>

          {/* DEDUCTIONS LIST */}
          {showDeductions && (
            <View style={styles.deductionBox}>
              <Text style={styles.deductHint}>
                Select applicable sections & enter the amount.
              </Text>

              {deductionOptions.map((item) => (
                <View key={item.key} style={{ marginBottom: 14 }}>
                  <TouchableOpacity
                    style={styles.deductRow}
                    onPress={() => toggleDeduction(item.key)}
                  >
                    <Ionicons
                      name={
                        selectedDeductions[item.key]
                          ? "checkbox-outline"
                          : "square-outline"
                      }
                      size={22}
                      color="#196F63"
                    />
                    <Text style={styles.deductLabel}>{item.label}</Text>
                  </TouchableOpacity>

                  {selectedDeductions[item.key] !== undefined && (
                    <TextInput
                      keyboardType="numeric"
                      style={styles.deductInput}
                      placeholder={
                        item.max === Infinity ? "No limit" : `Max: ₹${item.max}`
                      }
                      value={selectedDeductions[item.key]}
                      onChangeText={(v) =>
                        updateDeductionAmount(item.key, v, item.max)
                      }
                    />
                  )}
                </View>
              ))}
            </View>
          )}

          {/* CALCULATE BUTTON */}
          <TouchableOpacity style={styles.calcBtn} onPress={calculateTax}>
            <Text style={styles.calcText}>Calculate Tax</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT */}
        {taxResult && (
          <View style={styles.resultCard}>
            <Ionicons name="receipt-outline" size={42} color="#196F63" />

            <Text style={styles.taxValue}>
              ₹{taxResult.tax.toLocaleString()}
            </Text>
            <Text style={styles.taxLabel}>Total Tax Payable</Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>
                Taxable Income: ₹{taxResult.taxableIncome.toLocaleString()}
              </Text>
              <Text style={styles.summaryText}>
                Total Deduction: ₹{taxResult.totalDeduction.toLocaleString()}
              </Text>
              <Text style={styles.summaryTextCess}>
                Includes 4% Health & Education Cess
              </Text>
            </View>
          </View>
        )}

        {/* HOW TAX IS CALCULATED */}
        {taxResult && (
          <View style={styles.explainCard}>
            <Text style={styles.explainTitle}>How your tax was calculated</Text>
            <Text style={styles.explainText}>
              • ₹0 - ₹2.5L → No tax  
              • ₹2.5L - ₹5L → 5%  
              • ₹5L - ₹10L → 20%  
              • Above ₹10L → 30%  
              • + 4% Cess on total tax  
            </Text>
          </View>
        )}

      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ------------------- WALLETWAVE THEME ------------------- */
const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    backgroundColor: "#196F63",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  backBtn: { paddingRight: 12 },

  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  /* INFO CARD */
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#F0FFFA",
    padding: 14,
    margin: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CDECE4",
  },

  infoText: {
    marginLeft: 10,
    color: "#18493F",
    fontSize: 14,
    flex: 1,
    fontWeight: "500",
  },

  /* INPUT CARD */
  card: {
    backgroundColor: "#F8FFFD",
    margin: 20,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6F3EE",
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
    borderColor: "#DCEFEA",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
  },

  /* DEDUCTIONS */
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EFFFF9",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDECE4",
    marginTop: 20,
  },

  dropdownText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  deductionBox: {
    marginTop: 14,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#CDECE4",
  },

  deductRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },

  deductLabel: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
  },

  deductInput: {
    backgroundColor: "#F8FFFD",
    borderWidth: 1,
    borderColor: "#CDECE4",
    padding: 10,
    borderRadius: 10,
    marginLeft: 34,
    marginTop: 6,
  },

  deductHint: {
    fontSize: 13,
    color: "#6F7E78",
    marginBottom: 10,
  },

  /* CALCULATE BUTTON */
  calcBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 26,
  },

  calcText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  /* RESULT */
  resultCard: {
    marginHorizontal: 20,
    padding: 24,
    backgroundColor: "#F8FFFD",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#CDECE4",
    alignItems: "center",
  },

  taxValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#196F63",
    marginTop: 12,
  },

  taxLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  summaryBox: {
    marginTop: 14,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 14,
    width: "100%",
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  summaryText: {
    fontSize: 14,
    color: "#18493F",
    marginBottom: 4,
  },

  summaryTextCess: {
    fontSize: 13,
    color: "#6F7E78",
    marginTop: 6,
  },

  /* EXPLANATION */
  explainCard: {
    backgroundColor: "#F0FFFA",
    borderWidth: 1,
    borderColor: "#CDECE4",
    margin: 20,
    padding: 16,
    borderRadius: 14,
  },

  explainTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 10,
  },

  explainText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
});
