import React, { useEffect, useState } from "react";
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
import { useRouter } from "expo-router";
import BottomNav from "../components/BottomNav";

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
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    loadSummary();
  }, []);

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

  if (loading || !summary)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );

  const { totalExpense, totalIncome, categories } = summary;
  const saving = totalIncome - totalExpense;

  const pieData =
    Object.entries(categories).map(([name, amt], idx) => ({
      name,
      population: amt,
      color: COLORS[idx % COLORS.length],
      legendFontColor: "#333",
      legendFontSize: 12,
    })) || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#18493F" />
          </TouchableOpacity>
          <Text style={styles.title}>This Month Summary</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Expense</Text>
          <Text style={styles.value}>₹{totalExpense}</Text>

          <Text style={styles.section}>Income</Text>
          <Text style={styles.value}>₹{totalIncome}</Text>

          <Text style={styles.section}>Savings</Text>
          <Text
            style={[
              styles.value,
              { color: saving >= 0 ? "#196F63" : "#D9534F" },
            ]}
          >
            {saving >= 0 ? "₹" : "-₹"}{Math.abs(saving)}
          </Text>
        </View>

        <Text style={styles.chartTitle}>Category Breakdown</Text>

        <PieChart
          data={pieData.length ? pieData : [{
            name: "No Data",
            population: 1,
            color: "#ccc",
            legendFontColor: "#555",
            legendFontSize: 12,
          }]}
          width={SCREEN_WIDTH - 20}
          height={230}
          accessor="population"
          backgroundColor="transparent"
          absolute
          paddingLeft="15"
          chartConfig={{ color: () => "#000" }}
        />
      </ScrollView>

      <BottomNav active="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, paddingTop: 50 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  title: { fontSize: 24, fontWeight: "800", marginLeft: 10 },
  card: {
    backgroundColor: "#F8FFFD",
    borderWidth: 1,
    borderColor: "#E6F3EE",
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
  },
  section: { color: "#6F7E78", marginTop: 10 },
  value: { fontSize: 26, fontWeight: "800", marginTop: 4 },
  chartTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
});
