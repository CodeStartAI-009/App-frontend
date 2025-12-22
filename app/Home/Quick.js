import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PieChart } from "react-native-chart-kit";
import { getSummary } from "../../services/expenseService";
import { useRouter, useFocusEffect } from "expo-router";
import BottomNav from "../components/BottomNav";
import { LinearGradient } from "expo-linear-gradient";
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatMoney, formatCurrencyLabel } from "../../utils/money";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const COLORS = [
  "#196F63",
  "#2E9E88",
  "#4FC3B2",
  "#9EE8D8",
  "#DFF7F1",
  "#A8D08D",
  "#F6C85F",
  "#F08A5D",
];

export default function Quick() {
  const router = useRouter();
  const { user } = useUserAuthStore();

  const currencyCode = user?.currency || "INR";
  const currencySymbol = formatCurrencyLabel(currencyCode);

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useFocusEffect(
    useCallback(() => {
      loadSummary();
    }, [])
  );

  const loadSummary = async () => {
    setLoading(true);
    try {
      const res = await getSummary();
      setSummary(res.data);
    } catch (e) {
      console.log("SUMMARY ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !summary) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  const { totalExpense = 0, totalIncome = 0, categories = {} } = summary;
  const saving = totalIncome - totalExpense;

  const pieData = Object.entries(categories).length
    ? Object.entries(categories).map(([name, amt], idx) => ({
        name,
        population: amt,
        color: COLORS[idx % COLORS.length],
        legendFontColor: "#334155",
        legendFontSize: 13,
      }))
    : [
        {
          name: "No Data",
          population: 1,
          color: "#CBD5E1",
          legendFontColor: "#555",
          legendFontSize: 12,
        },
      ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>
      {/* HEADER */}
      <LinearGradient colors={["#196F63", "#0E5C53"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Monthly Summary</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* SUMMARY CARD */}
        <View style={styles.glassCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.section}>Expense</Text>
            <Text style={[styles.value, { color: "#D9534F" }]}>
              {formatMoney(totalExpense, currencyCode)}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.section}>Income</Text>
            <Text style={[styles.value, { color: "#196F63" }]}>
              {formatMoney(totalIncome, currencyCode)}
            </Text>
          </View>

          <View style={styles.rowBetween}>
            <Text style={styles.section}>Savings</Text>
            <Text
              style={[
                styles.value,
                { color: saving >= 0 ? "#22C55E" : "#D9534F" },
              ]}
            >
              {saving < 0 && "-"}
              {currencySymbol}
              {Math.abs(saving).toLocaleString()}
            </Text>
          </View>
        </View>

        {/* CHART */}
        <Text style={styles.chartTitle}>Category Breakdown</Text>

        <PieChart
          data={pieData}
          width={SCREEN_WIDTH - 10}
          height={250}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="20"
          hasLegend
          chartConfig={{
            color: () => "#000",
          }}
          absolute
        />
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
}

/* --------------------- STYLES --------------------- */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 6,
  },

  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.65)",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    elevation: 4,
  },

  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  section: {
    color: "#475569",
    fontSize: 16,
    fontWeight: "600",
  },

  value: {
    fontSize: 24,
    fontWeight: "800",
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 15,
    alignSelf: "center",
    marginTop: 5,
  },
});
