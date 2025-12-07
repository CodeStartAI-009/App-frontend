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
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";

import {
  getMonthlySummary,
  getRecentActivity,
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
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <LinearGradient
        colors={["#196F63", "#145A52"]}
        style={styles.header}
      >
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.push("/Profile/Profile")}>
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatar}
            />
          </TouchableOpacity>

          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.greeting}>
              {topGreeting},{" "}
              <Text style={{ fontWeight: "800" }}>{user.name}</Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/Profile/Notification")}
          >
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* BALANCE CARD */}
        <View style={styles.glassCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceValue}>{currency(balance.total)}</Text>

          <View style={styles.miniRow}>
            <Text style={styles.smallLight}>
              Income: {currency(balance.income)}
            </Text>
            <Text style={[styles.smallLight, { marginLeft: 14 }]}>
              Expenses: {currency(balance.expenses)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/Home/Quick")}
            style={styles.viewBtn}
          >
            <Text style={styles.viewBtnText}>View Summary</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

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
                    size={26}
                    color={item.type === "income" ? "#28A745" : "#DC3545"}
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
                    {
                      color:
                        item.type === "income" ? "#28A745" : "#DC3545",
                    },
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
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setFabOpen(true)}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* ACTION SHEET */}
      <Modal visible={fabOpen} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setFabOpen(false)}
        >
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
                <Ionicons
                  name="remove-circle-outline"
                  size={26}
                  color="#fff"
                />
                <Text style={styles.actionText}>Add Expense</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => {
                  setFabOpen(false);
                  router.push("/Transactions/AddIncome");
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={26}
                  color="#fff"
                />
                <Text style={styles.actionText}>Add Income</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => setFabOpen(false)}
              style={{ marginTop: 12 }}
            >
              <Text style={styles.close}>Close</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <BottomNav active="home" />
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FBF9" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* HEADER */
  header: {
    paddingHorizontal: 18,
    paddingTop: 55,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },

  greeting: { color: "#fff", fontSize: 18 },

  /* GLASS CARD */
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.18)",
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.28)",
  },

  balanceLabel: { color: "#E8FFFA", fontSize: 14 },
  balanceValue: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    marginTop: 4,
  },

  miniRow: { flexDirection: "row", marginTop: 8 },
  smallLight: { color: "#E8FFFA", fontSize: 14 },

  viewBtn: {
    marginTop: 14,
    alignSelf: "flex-start",
    backgroundColor: "#145A52",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  viewBtnText: { color: "#fff", fontWeight: "700" },

  /* RECENT */
  recentBox: {
    marginTop: -10,
    padding: 18,
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 18,
    elevation: 3,
  },

  title: { fontSize: 20, fontWeight: "800", marginBottom: 12 },

  emptyText: { color: "#777", fontSize: 14 },

  row: {
    flexDirection: "row",
    paddingVertical: 12,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ECF4F2",
  },

  left: { flexDirection: "row", alignItems: "center" },

  txTitle: { fontSize: 16, fontWeight: "700", color: "#18493F" },
  time: { fontSize: 12, color: "#6F7E78" },

  amount: { fontSize: 17, fontWeight: "800" },

  /* FAB */
  fab: {
    position: "absolute",
    right: 20,
    bottom: 90,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#196F63",
    justifyContent: "center",
    alignItems: "center",
    elevation: 7,
  },

  /* MODAL */
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

  actionRow: { flexDirection: "row", justifyContent: "space-between" },

  actionBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 6,
    flex: 1,
    alignItems: "center",
  },

  actionText: {
    color: "#fff",
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
  },

  close: { color: "#196F63", fontWeight: "700", fontSize: 16 },
});
