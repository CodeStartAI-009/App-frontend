import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomNav from "../components/BottomNav";
import { formatMoney, formatCurrencyLabel } from "../../utils/money";

/* ------------------------------------
   TEMP: replace with real user currency
------------------------------------- */
const USER_CURRENCY = "USD"; // INR, USD, EUR, GBP, BRL, SGD, AUD, CAD

export default function Loan() {
  const router = useRouter();
  const symbol = formatCurrencyLabel(USER_CURRENCY);

  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalInterest, setTotalInterest] = useState(null);

  const calculateLoan = () => {
    if (!principal || !rate || !tenure) return;

    const P = Number(principal);
    const r = Number(rate) / 12 / 100; // monthly rate
    const n = Number(tenure) * 12; // months

    if (r === 0) {
      const payment = P / n;
      setMonthlyPayment(payment);
      setTotalInterest(0);
      return;
    }

    const emi =
      (P * r * Math.pow(1 + r, n)) /
      (Math.pow(1 + r, n) - 1);

    const totalPayable = emi * n;
    const interest = totalPayable - P;

    setMonthlyPayment(emi);
    setTotalInterest(interest);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Loan Calculator</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* LOAN AMOUNT */}
          <Text style={styles.label}>Loan Amount ({symbol})</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter loan amount"
            value={principal}
            onChangeText={setPrincipal}
          />

          {/* INTEREST RATE */}
          <Text style={styles.label}>Annual Interest Rate (%)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 8.5"
            value={rate}
            onChangeText={setRate}
          />

          {/* TENURE */}
          <Text style={styles.label}>Loan Tenure (Years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="e.g. 5"
            value={tenure}
            onChangeText={setTenure}
          />

          {/* BUTTON */}
          <TouchableOpacity style={styles.btn} onPress={calculateLoan}>
            <Text style={styles.btnText}>Calculate</Text>
          </TouchableOpacity>

          {/* RESULT */}
          {monthlyPayment !== null && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Monthly Payment</Text>
              <Text style={styles.resultValue}>
                {formatMoney(monthlyPayment, USER_CURRENCY)}
              </Text>

              <View style={styles.divider} />

              <Text style={styles.subLabel}>Total Interest</Text>
              <Text style={styles.subValue}>
                {formatMoney(totalInterest, USER_CURRENCY)}
              </Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backBtn: { paddingRight: 12 },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  container: {
    paddingTop: 20,
    paddingHorizontal: 22,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 20,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    fontSize: 16,
    marginTop: 8,
  },
  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 28,
  },
  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  resultCard: {
    marginTop: 26,
    backgroundColor: "#F8FFFD",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18493F",
  },
  resultValue: {
    fontSize: 30,
    fontWeight: "800",
    color: "#196F63",
    marginTop: 6,
  },
  divider: {
    height: 1,
    width: "100%",
    backgroundColor: "#E6F3EE",
    marginVertical: 16,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6F7E78",
  },
  subValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 4,
  },
});
