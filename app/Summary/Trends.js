import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getTrendBreakdown } from "../../services/expenseService";

const { width } = Dimensions.get("window");

export default function Trends() {
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState([]);
  const [topCategory, setTopCategory] = useState("None");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      setLoading(true);

      const res = await getTrendBreakdown();
      const data = res?.data?.trends || [];

      const normalized = data.map((m) => ({
        month: m.month,
        totalExpense: Number(m.totalExpense) || 0,
        totalIncome: Number(m.totalIncome) || 0,
        categories: m.categories || {},
      }));

      setTrend(normalized);

      const categoryTotals = {};

      normalized.forEach((m) => {
        Object.entries(m.categories).forEach(([cat, val]) => {
          categoryTotals[cat] = (categoryTotals[cat] || 0) + Number(val);
        });
      });

      if (Object.keys(categoryTotals).length > 0) {
        const sorted = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
        setTopCategory(sorted[0][0]);
      }
    } catch (e) {
      console.log("TREND ERROR:", e);
      setTrend([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );

  const labels = trend.map((m) => m.month.split("-")[1]);
  const values = trend.map((m) => m.totalExpense);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Monthly Spending Trends</Text>

      {/* TOP CATEGORY CARD */}
      <View style={styles.card}>
        <Text style={styles.subLabel}>Top Spending Category</Text>
        <Text style={styles.catValue}>{topCategory}</Text>
      </View>

      {/* LINE GRAPH */}
      <LineChart
        data={{
          labels: labels.length ? labels : ["-"],
          datasets: [{ data: values.length ? values : [0] }],
        }}
        width={width - 24}
        height={260}
        yAxisLabel="₹"
        withDots={true}
        withInnerLines={false}
        withOuterLines={false}
        chartConfig={{
          backgroundGradientFrom: "#F8FFFD",
          backgroundGradientTo: "#F8FFFD",
          color: (opacity = 1) => `rgba(25,111,99, ${opacity})`,
          labelColor: () => "#444",
        }}
        bezier
        style={styles.chart}
      />

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 50 },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#18493F",
    marginLeft: 12,
    marginBottom: 10,
  },

  chart: {
    borderRadius: 12,
    marginTop: 10,
    alignSelf: "center",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  card: {
    marginHorizontal: 12,
    backgroundColor: "#F8FFFD",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    marginBottom: 20,
  },

  subLabel: { fontSize: 14, color: "#777" },
  catValue: { fontSize: 20, fontWeight: "800", color: "#196F63", marginTop: 4 },
});
