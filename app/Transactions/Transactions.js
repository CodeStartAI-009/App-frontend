import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import {
  Swipeable,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import {
  getActivity,
  deleteTransaction,
  clearExpenseCache,
} from "../../services/expenseService";

import BottomNav from "../components/BottomNav";
import { useRouter, useFocusEffect } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatCurrencyLabel } from "../../utils/money";
import { trackEvent } from "../../utils/analytics";

/* ---------------- ICON PICKER ---------------- */
function getCategoryIcon(category, color) {
  switch ((category || "").toLowerCase()) {
    case "food":
      return <MaterialIcons name="fastfood" size={22} color={color} />;
    case "shopping":
      return <MaterialIcons name="shopping-cart" size={22} color={color} />;
    case "travel":
      return <FontAwesome5 name="bus" size={18} color={color} />;
    case "rent":
      return <Ionicons name="home" size={22} color={color} />;
    case "income":
      return <Ionicons name="arrow-up-circle" size={22} color={color} />;
    case "split group":
      return <Ionicons name="git-branch-outline" size={22} color={color} />;
    case "goal saving":
      return <Ionicons name="trophy-outline" size={22} color={color} />;
    default:
      return <Ionicons name="albums-outline" size={20} color={color} />;
  }
}

export default function TransactionsScreen() {
  const router = useRouter();
  const user = useUserAuthStore((s) => s.user);
  const markHomeDirty = useUserAuthStore((s) => s.markHomeDirty);

  const currency = user?.currency || "INR";
  const currencySymbol = formatCurrencyLabel(currency);

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);
  const deletingRef = useRef(false);

  /* ---------------- LOAD ---------------- */
  useFocusEffect(
    useCallback(() => {
      trackEvent("transaction_list_viewed");
      loadActivity();
    }, [])
  );

  const loadActivity = async () => {
    try {
      setLoading(true);
      const res = await getActivity(true);
      setActivity(res?.data?.activity || []);
    } catch (err) {
      console.log("Activity load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isProtected = (item) => {
    const cat = (item.category || "").toLowerCase();
    return cat === "split group" || cat === "goal saving";
  };

  /* ---------------- DELETE ---------------- */
  const handleDelete = async (item) => {
    if (isProtected(item)) return;

    if (deletingRef.current) return;
    deletingRef.current = true;

    Alert.alert(
      "Delete Transaction",
      "This action cannot be undone. Continue?",
      [
        { text: "Cancel", style: "cancel", onPress: () => (deletingRef.current = false) },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTransaction(item._id, item.type);

              trackEvent("transaction_deleted", {
                type: item.type,
                category: item.category,
                amount: item.amount,
              });

              clearExpenseCache();
              markHomeDirty();
              loadActivity();
            } catch (err) {
              Alert.alert("Error", "Failed to delete transaction");
            } finally {
              deletingRef.current = false;
            }
          },
        },
      ]
    );
  };

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transactions</Text>
        </View>

        {/* CREATE SPLIT */}
        <TouchableOpacity
          style={styles.splitBtn}
          onPress={() => router.push("/Group/GroupsListScreen")}
        >
          <Ionicons name="git-branch-outline" size={20} color="#fff" />
          <Text style={styles.splitText}>Create Split</Text>
        </TouchableOpacity>

        {/* LIST */}
        <FlatList
          data={activity}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 140 }}
          renderItem={({ item }) => {
            const isIncome = item.type === "income";
            const color = isIncome ? "#16A34A" : "#DC2626";

            return (
              <Swipeable
                enabled={!isProtected(item)}
                renderRightActions={() =>
                  !isProtected(item) && (
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(item)}
                    >
                      <Ionicons name="trash" size={22} color="#fff" />
                    </TouchableOpacity>
                  )
                }
              >
                <View style={styles.card}>
                  <View style={styles.left}>
                    <View
                      style={[
                        styles.iconWrap,
                        {
                          backgroundColor: isIncome
                            ? "#E8FFF2"
                            : "#FFECEC",
                        },
                      ]}
                    >
                      {getCategoryIcon(item.category, color)}
                    </View>

                    <View>
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.sub}>
                        {item.category} ·{" "}
                        {new Date(item.createdAt).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.amount, { color }]}>
                    {isIncome ? "+" : "-"}
                    {currencySymbol}
                    {Number(item.amount).toLocaleString()}
                  </Text>
                </View>
              </Swipeable>
            );
          }}
        />

        <BottomNav active="tx" />
      </View>
    </GestureHandlerRootView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FBF9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 75,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 14,
  },

  splitBtn: {
    marginHorizontal: 20,
    marginTop: -14,
    marginBottom: 16,
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  splitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },

  card: {
    marginHorizontal: 20,
    marginVertical: 6,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2F1EC",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: { flexDirection: "row", alignItems: "center", gap: 12 },

  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  title: { fontSize: 16, fontWeight: "700", color: "#18493F" },
  sub: { fontSize: 12, color: "#6F7E78", marginTop: 2 },

  amount: { fontSize: 18, fontWeight: "800" },

  deleteBtn: {
    width: 80,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginVertical: 6,
  },
});
