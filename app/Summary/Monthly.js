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

  const load = async () => {
    try {
      setLoading(true);

      const res = await getActivity();
      const all = res?.data?.activity || [];

      const filtered = all.filter((t) => {
        const d = t.date
          ? new Date(t.date)
          : t.createdAt
          ? new Date(t.createdAt)
          : null;
        if (!d) return false;
        return MONTHS[d.getMonth()] === month;
      });

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

      const buckets = [0, 0, 0, 0, 0, 0];
      normalized.forEach((tx) => {
        if (!tx.dateObj) return;
        const day = tx.dateObj.getDate();
        let index = Math.min(Math.floor((day - 1) / 5), 5);
        const change = tx.type === "income" ? tx.amount : -tx.amount;
        buckets[index] += change;
      });

      setGraphPoints(buckets.map((v) => (Number.isFinite(v) ? v : 0)));
    } catch (err) {
      console.log("MONTHLY LOAD ERROR:", err);
      setTransactions([]);
      setGraphPoints([0,0,0,0,0,0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [month]);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s,t) => s+t.amount,0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s,t) => s+t.amount,0);
  const net = totalIncome - totalExpense;

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>

      {/* HEADER */}
      <Text style={styles.header}>Monthly Breakdown</Text>

      {/* MONTH SELECTOR */}
      <TouchableOpacity style={styles.monthSelector} onPress={() => setOpenMonthPicker(true)}>
        <Text style={styles.monthSelectorText}>{month}</Text>
      </TouchableOpacity>

      {/* MONTH PICKER MODAL */}
      <Modal visible={openMonthPicker} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setOpenMonthPicker(false)}>
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
                    m === month && styles.selectedMonth
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
        <ActivityIndicator size="large" color="#196F63" style={{ marginTop: 40 }} />
      ) : (
        <View>

          {/* SUMMARY CARD */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryBlock}>
              <Text style={styles.label}>Income</Text>
              <Text style={[styles.value, { color: "#198754" }]}>₹{totalIncome.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryBlock}>
              <Text style={styles.label}>Expense</Text>
              <Text style={[styles.value, { color: "#D9534F" }]}>₹{totalExpense.toLocaleString()}</Text>
            </View>

            <View style={styles.summaryBlock}>
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

          {/* GRAPH */}
          <Text style={styles.sectionTitle}>Spending Pattern</Text>

          <View style={styles.chartWrapper}>
            <LineChart
              data={{
                labels: ["1–5", "6–10", "11–15", "16–20", "21–25", "26–31"],
                datasets: [{ data: graphPoints }],
              }}
              width={SCREEN_WIDTH - 40}
              height={230}
              yAxisLabel="₹"
              withInnerLines={false}
              withOuterLines={false}
              chartConfig={{
                backgroundGradientFrom: "#FFFFFF",
                backgroundGradientTo: "#FFFFFF",
                color: (o = 1) => `rgba(25,111,99,${o})`,
                labelColor: () => "#6B6B6B",
              }}
              bezier
            />
          </View>

          {/* TRANSACTIONS */}
          <Text style={styles.sectionTitle}>Transactions</Text>

          {transactions.length === 0 ? (
            <Text style={styles.noData}>No data available for this month</Text>
          ) : (
            transactions.map((tx) => (
              <View key={tx._id} style={styles.txCard}>
                <View>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txDate}>
                    {tx.dateObj.toLocaleDateString("en-IN",{ day:"numeric", month:"short" })}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.txAmount,
                    { color: tx.type === "income" ? "#198754" : "#D9534F" }
                  ]}
                >
                  {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

/* -------------------- UI-IMPROVED STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },

  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#18493F",
    marginBottom: 20,
  },

  monthSelector: {
    backgroundColor: "#F1F8F6",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D6EDE7",
    marginBottom: 20,
    elevation: 2,
  },
  monthSelectorText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#18493F",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalBox: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    color: "#18493F",
  },
  monthOption: {
    paddingVertical: 10,
  },
  monthOptionText: {
    fontSize: 17,
    color: "#18493F",
  },
  selectedMonth: {
    fontWeight: "800",
    color: "#196F63",
  },

  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    marginBottom: 22,
    elevation: 2,
  },
  summaryBlock: {
    width: "33%",
    alignItems: "center",
  },
  label: {
    fontSize: 13,
    color: "#6F7E78",
  },
  value: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F3F36",
    marginBottom: 14,
    marginTop: 10,
  },

  chartWrapper: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    marginBottom: 20,
    elevation: 1,
  },

  txCard: {
    backgroundColor: "#F8FFFD",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E1F1EC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    elevation: 1,
  },

  txTitle: { fontSize: 16, fontWeight: "700", color: "#18493F" },
  txDate: { fontSize: 12, color: "#6F7E78", marginTop: 4 },
  txAmount: { fontSize: 18, fontWeight: "900" },

  noData: {
    textAlign: "center",
    color: "#777",
    marginTop: 22,
    fontSize: 15,
    fontWeight: "600",
  },
});
