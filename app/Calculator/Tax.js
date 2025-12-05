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
    { key: "80C", label: "80C - Investments (PPF, ELSS, LIC)", max: 150000 },
    { key: "80D", label: "80D - Medical Insurance", max: 50000 },
    { key: "80E", label: "80E - Education Loan Interest", max: Infinity },
    { key: "80TTA", label: "80TTA - Savings Account Interest", max: 10000 },
    { key: "80G", label: "80G - Donations", max: Infinity },
  ];

  const [income, setIncome] = useState("");
  const [selectedDeductions, setSelectedDeductions] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tax, setTax] = useState(null);

  const toggleDeduction = (key) => {
    setSelectedDeductions((prev) => ({
      ...prev,
      [key]: prev[key] ? undefined : "0",
    }));
  };

  const updateDeductionAmount = (key, value, max) => {
    let numeric = Number(value);
    if (numeric > max) numeric = max;

    setSelectedDeductions((prev) => ({
      ...prev,
      [key]: numeric.toString(),
    }));
  };

  const calculateTax = () => {
    let totalDeduction = 0;

    Object.values(selectedDeductions).forEach((v) => {
      if (v) totalDeduction += Number(v);
    });

    let taxable = Number(income) - totalDeduction;
    if (taxable < 0) taxable = 0;

    let amount = taxable;
    let calculatedTax = 0;

    // ---- Old Regime Slabs ----
    if (amount <= 250000) calculatedTax = 0;
    else if (amount <= 500000)
      calculatedTax = (amount - 250000) * 0.05;
    else if (amount <= 1000000)
      calculatedTax = 250000 * 0.05 + (amount - 500000) * 0.2;
    else
      calculatedTax =
        250000 * 0.05 +
        500000 * 0.2 +
        (amount - 1000000) * 0.3;

    // 4% CESS
    calculatedTax += calculatedTax * 0.04;

    setTax({ calculatedTax, taxable, totalDeduction });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerText}>Income Tax Calculator</Text>
          <Text style={styles.headerSub}>Choose deductions easily</Text>
        </View>

        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Annual Income (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter yearly income"
            value={income}
            onChangeText={setIncome}
          />

          {/* DROPDOWN BUTTON */}
          <TouchableOpacity
            onPress={() => setDropdownOpen(!dropdownOpen)}
            style={styles.dropdown}
          >
            <Text style={styles.dropdownText}>Select Deductions</Text>
            <Ionicons
              name={dropdownOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color="#18493F"
            />
          </TouchableOpacity>

          {/* DROPDOWN LIST */}
          {dropdownOpen && (
            <View style={styles.dropdownBox}>
              {deductionOptions.map((item) => (
                <View key={item.key}>
                  {/* Section Header */} 
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

                  {/* If selected → Show amount box */}
                  {selectedDeductions[item.key] !== undefined && (
                    <TextInput
                      style={styles.deductInput}
                      keyboardType="numeric"
                      placeholder={`Max: ${
                        item.max === Infinity ? "No Limit" : item.max
                      }`}
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
          <TouchableOpacity style={styles.btn} onPress={calculateTax}>
            <Text style={styles.btnText}>Calculate Tax</Text>
          </TouchableOpacity>
        </View>

        {/* RESULT */}
        {tax && (
          <View style={styles.resultCard}>
            <Ionicons name="receipt-outline" size={40} color="#196F63" />

            <Text style={styles.taxValue}>
              ₹{tax.calculatedTax.toLocaleString()}
            </Text>

            <Text style={styles.taxLabel}>Total Tax Payable</Text>

            <Text style={styles.summaryText}>
              Taxable Income: ₹{tax.taxable.toLocaleString()}
            </Text>
            <Text style={styles.summaryText}>
              Total Deductions: ₹{tax.totalDeduction.toLocaleString()}
            </Text>
          </View>
        )}
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* ------------------- STYLES ------------------- */
const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 35,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: 10,
  },
  headerSub: {
    fontSize: 14,
    color: "#D4FAF1",
    marginTop: 4,
  },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    margin: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8EDE6",
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
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
  },

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#EAF6F3",
    padding: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18493F",
  },

  dropdownBox: {
    marginTop: 10,
    backgroundColor: "#F1FBF8",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#CDEFE6",
  },

  deductRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  deductLabel: {
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
  },
  deductInput: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDEFE6",
    padding: 10,
    borderRadius: 10,
    marginLeft: 32,
    marginBottom: 12,
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 22,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  resultCard: {
    marginHorizontal: 20,
    padding: 25,
    backgroundColor: "#EFFFFA",
    borderRadius: 18,
    alignItems: "center",
    borderColor: "#C7EDE3",
    borderWidth: 1,
  },

  taxValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#196F63",
    marginTop: 10,
  },

  taxLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 6,
  },

  summaryText: {
    fontSize: 14,
    color: "#4B6F68",
    marginTop: 6,
  },
});
