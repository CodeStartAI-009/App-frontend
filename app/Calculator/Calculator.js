import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

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

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#18493F" />
        </TouchableOpacity>
        <Text style={styles.header}>Financial Calculators</Text>
      </View>

      {/* SCROLLABLE TOOLS LIST */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {tools.map((tool, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => router.push(tool.route)}
          >
            <Ionicons name={tool.icon} size={28} color="#196F63" />
            <Text style={styles.label}>{tool.label}</Text>

            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#999"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}

        {/* Spacing so content isn't hidden behind nav */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* BOTTOM NAV */}
      <BottomNav active="calculator" />
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 20,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },

  backBtn: { padding: 6, marginRight: 10 },

  header: {
    fontSize: 26,
    fontWeight: "800",
    color: "#18493F",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8F6",
    padding: 18,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D9ECE6",
  },

  label: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#18493F",
  },
});

