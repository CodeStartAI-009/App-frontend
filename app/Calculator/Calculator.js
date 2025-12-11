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

export default function Calculator() {
  const router = useRouter();

  const tools = [
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

  /* --------------- AUTO REFRESH WHEN SCREEN OPENS --------------- */
  useFocusEffect(
    useCallback(() => {
      // Future: You can refresh global data here (currency, tax, etc)
      // Example: refreshCalculatorCache();
    }, [])
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <Text style={styles.header}>Financial Calculators</Text>
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

/* ---------------------- THEMED UI STYLES ---------------------- */
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

  backBtn: {
    padding: 6,
    marginRight: 12,
  },

  header: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  container: {
    paddingTop: 20,
    paddingHorizontal: 22,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
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

  label: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18493F",
  },
});
