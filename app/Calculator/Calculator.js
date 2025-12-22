import React, { useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter, useFocusEffect } from "expo-router";
import { formatCurrencyLabel } from "../../utils/money";

/* --------------------------------------------
   CHANGE THIS TO REAL USER CURRENCY SOURCE
   e.g. from user profile / context / async storage
--------------------------------------------- */
const USER_CURRENCY = "USD"; // INR, USD, EUR, GBP, BRL, SGD, AUD, CAD

export default function Calculator() {
  const router = useRouter();
  const symbol = formatCurrencyLabel(USER_CURRENCY);

  /* ---------- COUNTRY-BASED TOOL LIST ---------- */
  const getToolsByCurrency = (currency) => {
    switch (currency) {
      /* 🇮🇳 INDIA */
      case "INR":
        return [
          { label: "Simple Interest", icon: "calculator-outline", route: "/Calculator/SI" },
          { label: "Compound Interest", icon: "trending-up-outline", route: "/Calculator/CI" },
          { label: "EMI Calculator", icon: "cash-outline", route: "/Calculator/EMI" },
          { label: "SIP Calculator", icon: "bar-chart-outline", route: "/Calculator/SIP" },
          { label: "Lumpsum Calculator", icon: "stats-chart-outline", route: "/Calculator/LumpSum" },
          { label: "FD / RD Calculator", icon: "wallet-outline", route: "/Calculator/FD" },
          { label: "Tax Calculator", icon: "receipt-outline", route: "/Calculator/Tax" },
          { label: "Inflation Impact", icon: "trending-down-outline", route: "/Calculator/Inflation" },
          { label: "Currency Converter", icon: "swap-horizontal-outline", route: "/Calculator/Currency" },
          { label: "Retirement Planner", icon: "person-outline", route: "/Calculator/Retirement" },
        ];

      /* 🇺🇸 🇨🇦 🇦🇺 */
      case "USD":
      case "CAD":
      case "AUD":
        return [
          { label: "Compound Interest", icon: "trending-up-outline", route: "/Calculator/CI" },
          { label: "Loan Payment", icon: "cash-outline", route: "/Calculator/Loan" },
          { label: "Monthly Investment", icon: "bar-chart-outline", route: "/Calculator/Investment" },
          { label: "Lumpsum Investment", icon: "stats-chart-outline", route: "/Calculator/LumpSum" },
          { label: "Inflation Impact", icon: "trending-down-outline", route: "/Calculator/Inflation" },
          { label: "Currency Converter", icon: "swap-horizontal-outline", route: "/Calculator/Currency" },
          { label: "Retirement Planner", icon: "person-outline", route: "/Calculator/Retirement" },
        ];

      /* 🇪🇺 🇬🇧 */
      case "EUR":
      case "GBP":
        return [
          { label: "Compound Interest (AER)", icon: "trending-up-outline", route: "/Calculator/CI" },
          { label: "Monthly Repayment", icon: "cash-outline", route: "/Calculator/Loan" },
          { label: "Lumpsum Investment", icon: "stats-chart-outline", route: "/Calculator/LumpSum" },
          { label: "Inflation Impact", icon: "trending-down-outline", route: "/Calculator/Inflation" },
          { label: "Currency Converter", icon: "swap-horizontal-outline", route: "/Calculator/Currency" },
          { label: "Retirement Planner", icon: "person-outline", route: "/Calculator/Retirement" },
        ];

      /* 🇧🇷 BRAZIL */
      case "BRL":
        return [
          { label: "Compound Interest", icon: "trending-up-outline", route: "/Calculator/CI" },
          { label: "Loan Payment", icon: "cash-outline", route: "/Calculator/Loan" },
          { label: "Inflation Impact", icon: "trending-down-outline", route: "/Calculator/Inflation" },
          { label: "Currency Converter", icon: "swap-horizontal-outline", route: "/Calculator/Currency" },
        ];

      /* 🇸🇬 SINGAPORE */
      case "SGD":
        return [
          { label: "Compound Interest", icon: "trending-up-outline", route: "/Calculator/CI" },
          { label: "Monthly Investment", icon: "bar-chart-outline", route: "/Calculator/Investment" },
          { label: "Lumpsum Investment", icon: "stats-chart-outline", route: "/Calculator/LumpSum" },
          { label: "Inflation Impact", icon: "trending-down-outline", route: "/Calculator/Inflation" },
          { label: "Currency Converter", icon: "swap-horizontal-outline", route: "/Calculator/Currency" },
          { label: "Retirement Planner", icon: "person-outline", route: "/Calculator/Retirement" },
        ];

      /* 🌍 FALLBACK */
      default:
        return [
          { label: "Compound Interest", icon: "trending-up-outline", route: "/Calculator/CI" },
          { label: "Inflation Impact", icon: "trending-down-outline", route: "/Calculator/Inflation" },
          { label: "Currency Converter", icon: "swap-horizontal-outline", route: "/Calculator/Currency" },
        ];
    }
  };

  const tools = getToolsByCurrency(USER_CURRENCY);

  useFocusEffect(
    useCallback(() => {
      // placeholder for future refresh
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.header}>
          Financial Calculator  
        </Text>
      </View>

      {/* TOOL LIST */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {tools.map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(tool.route)}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={tool.icon} size={30} color="#196F63" />
            </View>

            <Text style={styles.label}>{tool.label}</Text>

            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#6F7E78"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

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
  backBtn: { padding: 6, marginRight: 12 },
  header: { fontSize: 24, fontWeight: "800", color: "#FFFFFF" },
  container: { paddingTop: 20, paddingHorizontal: 22 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    elevation: 2,
  },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EAF6F3",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  label: { fontSize: 18, fontWeight: "700", color: "#18493F" },
});
