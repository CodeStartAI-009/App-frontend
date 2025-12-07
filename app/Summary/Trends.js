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
      
      {/* HEADER TITLE */}
      <Text style={styles.title}>Monthly Spending Trends</Text>

      {/* TOP CATEGORY CARD */}
      <View style={styles.card}>
        <Text style={styles.subLabel}>Top Spending Category</Text>
        <Text style={styles.catValue}>{topCategory}</Text>
      </View>

      {/* GRAPH SECTION */}
      <View style={styles.graphWrapper}>
        <Text style={styles.graphTitle}>Expense Over Months</Text>

        <LineChart
          data={{
            labels: labels.length ? labels : ["-"],
            datasets: [{ data: values.length ? values : [0] }],
          }}
          width={width - 40}
          height={260}
          yAxisLabel="₹"
          withDots={true}
          withInnerLines={false}
          withOuterLines={false}
          chartConfig={{
            backgroundGradientFrom: "#FFFFFF",
            backgroundGradientTo: "#FFFFFF",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(25,111,99,${opacity})`,
            labelColor: () => "#6B6B6B",
          }}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={{ height: 80 }} />

    </ScrollView>
  );
}

/* ------------------------ IMPROVED UI STYLES ------------------------ */

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 16,
    backgroundColor: "#FFFFFF",
  },

  /* HEADER */
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: "#18493F",
    marginBottom: 18,
  },

  /* CENTER LOADING */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  /* TOP CATEGORY CARD */
  card: {
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    marginBottom: 24,
    elevation: 2,
  },
  subLabel: {
    fontSize: 14,
    color: "#6F7E78",
    fontWeight: "600",
  },
  catValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#196F63",
    marginTop: 6,
  },

  /* GRAPH SECTION */
  graphWrapper: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    elevation: 2,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F3F36",
    marginLeft: 12,
    marginBottom: 10,
  },

  chart: {
    borderRadius: 16,
    alignSelf: "center",
  },
});
