import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import { getActivity } from "../../services/expenseService";

const SCREEN_WIDTH = Dimensions.get("window").width;

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function Monthly() {
  const currentMonth = MONTHS[new Date().getMonth()];
  const [transactions, setTransactions] = useState([]);
  const [month, setMonth] = useState(currentMonth);
  const [loading, setLoading] = useState(false);
  const [graphPoints, setGraphPoints] = useState([0,0,0,0,0,0]);
  const [openMonthPicker, setOpenMonthPicker] = useState(false);

  // ------------------ LOAD DATA ------------------
  const load = async () => {
    try {
      setLoading(true);

      const res = await getActivity();
      const all = res?.data?.activity || [];

      // Filter by month
      const filtered = all.filter((t) => {
        const d = t.date
          ? new Date(t.date)
          : t.createdAt
          ? new Date(t.createdAt)
          : null;
        if (!d) return false;
        return MONTHS[d.getMonth()] === month;
      });

      // Normalize transaction format
      const normalized = filtered.map((t) => ({
        ...t,
        amount: Number(t.amount) || 0,
        type: t.type || (Number(t.amount) >= 0 ? "income" : "expense"),
        dateObj: t.date
          ? new Date(t.date)
          : t.createdAt
          ? new Date(t.createdAt)
          : null,
      }));

      setTransactions(normalized);

      // ------------------ BUCKET LOGIC ------------------
      const buckets = [0, 0, 0, 0, 0, 0];

      normalized.forEach((tx) => {
        if (!tx.dateObj) return;

        const day = tx.dateObj.getDate();
        let index = Math.min(Math.floor((day - 1) / 5), 5);

        const change = tx.type === "income" ? tx.amount : -tx.amount;
        buckets[index] += change;
      });

      // Ensure no Infinity or NaN enters chart
      const safeBuckets = buckets.map((v) =>
        Number.isFinite(v) ? v : 0
      );

      setGraphPoints(safeBuckets);
    } catch (err) {
      console.log("MONTHLY LOAD ERROR:", err);
      setGraphPoints([0,0,0,0,0,0]);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month]);

  // ------------------ SUMMARY ------------------
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const net = totalIncome - totalExpense;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
      <View>
  
        <Text style={styles.header}>Monthly Breakdown</Text>
  
        {/* Month Selector */}
        <TouchableOpacity
          style={styles.monthSelector}
          onPress={() => setOpenMonthPicker(true)}
        >
          <Text style={styles.monthSelectorText}>{month}</Text>
        </TouchableOpacity>
  
        {/* Month Picker Modal */}
        <Modal visible={openMonthPicker} transparent animationType="fade">
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setOpenMonthPicker(false)}
          >
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Select Month</Text>
  
              {MONTHS.map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => {
                    setMonth(m);
                    setOpenMonthPicker(false);
                  }}
                  style={styles.monthOption}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      m === month && { fontWeight: "800", color: "#196F63" }
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
  
        {loading ? (
          <ActivityIndicator size="large" color="#196F63" />
        ) : (
          <View>
            {/* Summary */}
            <View style={styles.summaryCard}>
              <View style={styles.rowBetween}>
                <View>
                  <Text style={styles.label}>Income</Text>
                  <Text style={[styles.value, { color: "#198754" }]}>
                    ₹{totalIncome.toLocaleString()}
                  </Text>
                </View>
  
                <View>
                  <Text style={styles.label}>Expense</Text>
                  <Text style={[styles.value, { color: "#D9534F" }]}>
                    ₹{totalExpense.toLocaleString()}
                  </Text>
                </View>
  
                <View>
                  <Text style={styles.label}>Net</Text>
                  <Text
                    style={[
                      styles.value,
                      { color: net >= 0 ? "#196F63" : "#D9534F" }
                    ]}
                  >
                    {net >= 0 ? "+" : "-"}₹{Math.abs(net).toLocaleString()}
                  </Text>
                </View>
              </View>
            </View>
  
            {/* GRAPH */}
            <Text style={styles.sectionTitle}>Spending Pattern</Text>
  
            <LineChart
              data={{
                labels: ["1–5", "6–10", "11–15", "16–20", "21–25", "26–31"],
                datasets: [{ data: graphPoints }],
              }}
              width={SCREEN_WIDTH - 20}
              height={220}
              yAxisLabel="₹"
              withDots={true}
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={{
                backgroundGradientFrom: "#FFF",
                backgroundGradientTo: "#FFF",
                color: (o = 1) => `rgba(25,111,99,${o})`,
                labelColor: () => "#6B6B6B",
              }}
              bezier
              style={styles.chart}
            />
  
            {/* Transaction List */}
            <Text style={styles.sectionTitle}>Transactions</Text>
  
            {transactions.length === 0 && (
              <Text style={styles.noData}>No data for this month</Text>
            )}
  
            {transactions.map((tx) => (
              <View key={tx._id} style={styles.row}>
                <Text style={styles.title}>{tx.title}</Text>
  
                <Text
                  style={[
                    styles.amount,
                    { color: tx.type === "income" ? "#198754" : "#D9534F" },
                  ]}
                >
                  {tx.type === "income" ? "+" : "-"}₹
                  {tx.amount.toLocaleString()}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
  
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { padding: 14, backgroundColor: "#fff", paddingTop: 50 },
  header: { fontSize: 26, fontWeight: "800", color: "#18493F", marginBottom: 18 },

  monthSelector: {
    backgroundColor: "#EAF6F3",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFE8E2",
    marginBottom: 16,
  },
  monthSelectorText: { fontSize: 18, fontWeight: "700", color: "#18493F" },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalBox: { backgroundColor: "#fff", padding: 20, borderRadius: 15 },
  modalTitle: { fontSize: 20, fontWeight: "800", marginBottom: 12 },

  monthOption: { paddingVertical: 10 },
  monthOptionText: { fontSize: 18, color: "#18493F" },

  summaryCard: {
    backgroundColor: "#F8FFFD",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    marginBottom: 20,
  },

  rowBetween: { flexDirection: "row", justifyContent: "space-between" },

  label: { fontSize: 12, color: "#5F736D" },
  value: { fontSize: 18, fontWeight: "700", marginTop: 4 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 10,
    color: "#0F3F36",
  },

  chart: { borderRadius: 12, marginBottom: 20 },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  title: { fontSize: 16, fontWeight: "600" },
  amount: { fontSize: 16, fontWeight: "700" },

  noData: { fontSize: 14, color: "#777", marginTop: 20 },
});
