import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  ActivityIndicator,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useUserAuthStore } from "../../store/useAuthStore";

// IMPORTANT: use FULL summary route
import {
  getMonthlySummary,
  getRecentActivity
} from "../../services/expenseService";

import BottomNav from "../components/BottomNav";

function currency(n) {
  if (!n) return "₹0";
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n).toFixed(2);
  return `${sign}₹${Number(v).toLocaleString()}`;
}

export default function Home() {
  const router = useRouter();
  const { user, hydrated } = useUserAuthStore();

  const [loading, setLoading] = useState(true);

  const [balance, setBalance] = useState({
    total: 0,
    income: 0,
    expenses: 0,
  });

  const [recent, setRecent] = useState([]);
  const [fabOpen, setFabOpen] = useState(false);

  useEffect(() => {
    if (hydrated) loadHomeData();
  }, [hydrated]);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // 1️⃣ Load FULL summary
      const sRes = await getMonthlySummary();
      const summary = sRes.data;

      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      const m = summary.monthlySummaries?.find((x) => x.month === monthKey);

      setBalance({
        total: summary.bankBalance || 0,
        income: m?.totalIncome || 0,
        expenses: m?.totalExpense || 0,
      });

      // 2️⃣ Load recent activity
      const rRes = await getRecentActivity();
      setRecent(rRes.data.recent || []);

    } catch (err) {
      console.log("HOME LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  const topGreeting = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  if (!hydrated || loading || !user) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#4c6ef5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/Profile/Profile")}>
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.greeting}>
            {topGreeting},{" "}
            <Text style={{ fontWeight: "800" }}>{user.name}</Text>
          </Text>
        </View>

        <TouchableOpacity onPress={() => router.push("/Profile/Notification")}>
          <Ionicons name="notifications-outline" size={26} color="#111" />
        </TouchableOpacity>
      </View>

      {/* BALANCE CARD */}
      <TouchableOpacity
        style={styles.balanceCard}
        onPress={() => router.push("/Home/Quick")}
      >
        <View>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{currency(balance.total)}</Text>

          <View style={styles.miniRow}>
            <Text style={styles.small}>Income: {currency(balance.income)}</Text>
            <Text style={[styles.small, { marginLeft: 12 }]}>
              Expenses: {currency(balance.expenses)}
            </Text>
          </View>
        </View>

        <View style={styles.viewBtn}>
          <Text style={styles.viewBtnText}>View</Text>
        </View>
      </TouchableOpacity>

      {/* RECENT ACTIVITY */}
      <View style={styles.recentBox}>
        <Text style={styles.title}>Recent Activity</Text>

        {!recent.length ? (
          <Text style={styles.emptyText}>No transactions yet</Text>
        ) : (
          <FlatList
            data={recent}
            scrollEnabled={false}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.row}>
                <View style={styles.left}>
                  <Ionicons
                    name={
                      item.type === "income"
                        ? "arrow-up-circle"
                        : "arrow-down-circle"
                    }
                    size={22}
                    color={item.type === "income" ? "#198754" : "#D9534F"}
                  />

                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.txTitle}>{item.title}</Text>
                    <Text style={styles.time}>
                      {new Date(item.createdAt).toLocaleString("en-IN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "short",
                      })}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.amount,
                    { color: item.type === "income" ? "#198754" : "#D9534F" },
                  ]}
                >
                  {item.type === "income" ? "+" : "-"}₹{item.amount}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => setFabOpen(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* ACTION SHEET */}
      <Modal visible={fabOpen} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setFabOpen(false)}>
          <View style={styles.actionSheet}>
            <Text style={styles.actionTitle}>Quick Actions</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setFabOpen(false);
                  router.push("/Transactions/AddExpense");
                }}
              >
                <Ionicons name="remove-circle-outline" size={22} color="#fff" />
                <Text style={styles.actionText}>Add Expense</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setFabOpen(false);
                  router.push("/Transactions/AddIncome");
                }}
              >
                <Ionicons name="add-circle-outline" size={22} color="#fff" />
                <Text style={styles.actionText}>Add Income</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setFabOpen(false)}
              style={{ marginTop: 10 }}
            >
              <Text style={{ color: "#4c6ef5", fontWeight: "700" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <BottomNav active="home" />
    </View>
  );
}

/* STYLES SAME… not repeating */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 48,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  avatar: { width: 48, height: 48, borderRadius: 12 },

  greeting: { fontSize: 16, color: "#111" },

  balanceCard: {
    backgroundColor: "#eef2ff",
    flexDirection: "row",
    padding: 16,
    borderRadius: 14,
    justifyContent: "space-between",
    marginBottom: 16,
  },

  balanceLabel: { color: "#334155", fontSize: 14 },
  balanceValue: { fontSize: 28, fontWeight: "800", color: "#0f172a" },
  miniRow: { flexDirection: "row", marginTop: 8 },
  small: { fontSize: 13, color: "#334155" },

  viewBtn: {
    backgroundColor: "#4c6ef5",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignSelf: "center",
  },
  viewBtnText: { color: "#fff", fontWeight: "700" },

  recentBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F8FFFD",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  emptyText: { color: "#6F7E78" },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#E8F2EF",
  },

  left: { flexDirection: "row", alignItems: "center" },

  txTitle: { fontSize: 15, fontWeight: "600", color: "#18493F" },
  time: { fontSize: 12, color: "#6F7E78" },

  amount: { fontSize: 16, fontWeight: "700" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4c6ef5",
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  actionSheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  actionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  actionRow: { flexDirection: "row", justifyContent: "space-between" },

  actionBtn: {
    backgroundColor: "#0f172a",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    flex: 1,
    alignItems: "center",
  },

  actionText: { color: "#fff", marginTop: 6, fontWeight: "700" },
});
