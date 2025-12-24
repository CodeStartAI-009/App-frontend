import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter, useFocusEffect } from "expo-router";

import { useUserAuthStore } from "../../store/useAuthStore";
import {
  getMonthlySummary,
  getRecentActivity,
} from "../../services/expenseService";
import { formatMoney, formatCurrencyLabel } from "../../utils/money";
import BottomNav from "../components/BottomNav";
import { trackEvent } from "../../utils/analytics";

export default function Home() {
  const router = useRouter();
  const { user, hydrated, setHomeCache } = useUserAuthStore();

  const currencyCode = user?.currency || "INR";
  const currencySymbol = formatCurrencyLabel(currencyCode);

  const [balance, setBalance] = useState({
    total: 0,
    income: 0,
    expenses: 0,
  });
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fabOpen, setFabOpen] = useState(false);

  // 🔒 Prevent duplicate analytics on same focus
  const screenTrackedRef = useRef(false);

  /* =====================================================
     LOAD HOME DATA
  ===================================================== */
  const loadHomeData = async () => {
    setLoading(true);

    try {
      const [summaryRes, recentRes] = await Promise.all([
        getMonthlySummary(true),
        getRecentActivity(true),
      ]);

      const summary = summaryRes.data;
      const now = new Date();
      const monthKey = `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(2, "0")}`;

      const m = summary.monthlySummaries?.find(
        (x) => x.month === monthKey
      );

      const newBalance = {
        total: summary.bankBalance || 0,
        income: m?.totalIncome || 0,
        expenses: m?.totalExpense || 0,
      };

      const newRecent = recentRes.data.recent || [];

      setBalance(newBalance);
      setRecent(newRecent);

      setHomeCache({
        balance: newBalance,
        recent: newRecent,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.log("HOME LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SCREEN FOCUS
  ===================================================== */
  useFocusEffect(
    useCallback(() => {
      if (!hydrated || !user) return;

      if (!screenTrackedRef.current) {
        trackEvent("home_screen_viewed");
        screenTrackedRef.current = true;
      }

      loadHomeData();

      return () => {
        screenTrackedRef.current = false;
      };
    }, [hydrated, user?._id])
  );

  const greeting = useMemo(() => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good morning";
    if (hr < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  if (!hydrated || !user) {
    return (
      <View style={styles.center}>
        <Ionicons name="hourglass-outline" size={28} color="#196F63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient colors={["#196F63", "#145A52"]} style={styles.header}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => {
              trackEvent("profile_opened");
              router.push("/Profile/Profile");
            }}
          >
            <Image
              source={{
                uri: user.avatarUrl || "https://placehold.co/100x100",
              }}
              style={styles.avatar}
            />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>
              {greeting},{" "}
              <Text style={{ fontWeight: "800" }}>{user.name}</Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              trackEvent("notification_opened");
              router.push("/Profile/Notification");
            }}
          >
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* BALANCE */}
        <View style={styles.glassCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>
            {loading ? "— — —" : formatMoney(balance.total, currencyCode)}
          </Text>

          <View style={styles.miniRow}>
            <Text style={styles.smallLight}>
              Income:{" "}
              {loading ? "—" : formatMoney(balance.income, currencyCode)}
            </Text>
            <Text style={[styles.smallLight, { marginLeft: 14 }]}>
              Expenses:{" "}
              {loading ? "—" : formatMoney(balance.expenses, currencyCode)}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* RECENT ACTIVITY */}
      <View style={styles.recentBox}>
        <Text style={styles.title}>Recent Activity</Text>

        {loading ? (
          <Text style={styles.emptyText}>Loading…</Text>
        ) : !recent.length ? (
          <Text style={styles.emptyText}>No transactions yet</Text>
        ) : (
          <FlatList
            data={recent}
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
                    size={24}
                    color={item.type === "income" ? "#22c55e" : "#ef4444"}
                  />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.txTitle}>{item.title}</Text>
                    <Text style={styles.time}>
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.amount,
                    {
                      color:
                        item.type === "income" ? "#22c55e" : "#ef4444",
                    },
                  ]}
                >
                  {item.type === "income" ? "+" : "-"}
                  {currencySymbol}
                  {Math.abs(item.amount)}
                </Text>
              </View>
            )}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          trackEvent("fab_opened");
          setFabOpen(true);
        }}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* FAB MODAL */}
      <Modal visible={fabOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFabOpen(false)}
        >
          <View style={styles.actionSheet}>
            <Text style={styles.actionTitle}>Quick Actions</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  trackEvent("quick_add_expense_clicked");
                  setFabOpen(false);
                  router.push("/Transactions/AddExpense");
                }}
              >
                <Text style={styles.actionText}>Add Expense</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  trackEvent("quick_add_income_clicked");
                  setFabOpen(false);
                  router.push("/Transactions/AddIncome");
                }}
              >
                <Text style={styles.actionText}>Add Income</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <BottomNav active="home" />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FBF9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 55,
    paddingBottom: 40,
    paddingHorizontal: 18,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  topBar: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },

  greeting: { color: "#fff", fontSize: 18 },

  glassCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 18,
    borderRadius: 20,
  },

  balanceLabel: { color: "#E8FFFA", fontSize: 14 },
  balanceValue: { fontSize: 32, fontWeight: "800", color: "#fff" },
  miniRow: { flexDirection: "row", marginTop: 8 },
  smallLight: { color: "#E8FFFA" },

  recentBox: {
    marginTop: -10,
    padding: 18,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 18,
  },

  title: { fontSize: 20, fontWeight: "800", marginBottom: 12 },
  emptyText: { color: "#777" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ECF4F2",
  },

  left: { flexDirection: "row", alignItems: "center" },
  txTitle: { fontWeight: "700", color: "#18493F" },
  time: { fontSize: 12, color: "#6F7E78" },
  amount: { fontWeight: "800" },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 120,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#196F63",
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
    padding: 22,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  },

  actionTitle: { fontSize: 20, fontWeight: "800", marginBottom: 14 },
  actionRow: { flexDirection: "row" },

  actionBtn: {
    flex: 1,
    backgroundColor: "#196F63",
    padding: 15,
    borderRadius: 14,
    marginHorizontal: 6,
    alignItems: "center",
    marginBottom:40
  },

  actionText: { color: "#fff", fontWeight: "700" },
});
