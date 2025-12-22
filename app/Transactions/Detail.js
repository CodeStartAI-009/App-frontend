import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getSingleTransaction } from "../../services/expenseService";
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatCurrencyLabel } from "../../utils/money";

/* -------- helper -------- */
const formatAmount = (value, currency) => {
  const symbol = formatCurrencyLabel(currency);
  const n = Number(value || 0);
  return `${symbol}${n.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const user = useUserAuthStore((s) => s.user);
  const currency = user?.currency || "INR";

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  /* REFRESH WHEN SCREEN FOCUSES */
  useFocusEffect(
    useCallback(() => {
      load();
    }, [id])
  );

  const load = async () => {
    try {
      setLoading(true);
      const res = await getSingleTransaction(id);
      setItem(res?.data?.transaction || null);
    } catch (err) {
      console.log("DETAIL ERROR:", err);
      setItem(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !item) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  const isIncome = item.type === "income";
  const color = isIncome ? "#198754" : "#D9534F";

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Transaction Details</Text>
      </View>

      {/* CARD */}
      <View style={styles.card}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={[styles.amount, { color }]}>
          {isIncome ? "+" : "-"}
          {formatAmount(item.amount, currency)}
        </Text>

        <View style={styles.divider} />

        {/* CATEGORY */}
        <View style={styles.row}>
          <Ionicons name="pricetag-outline" size={20} color="#196F63" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.label}>Category</Text>
            <Text style={styles.value}>
              {item.category || "Uncategorized"}
            </Text>
          </View>
        </View>

        {/* TYPE */}
        <View style={styles.row}>
          <Ionicons
            name={isIncome ? "arrow-up-circle" : "arrow-down-circle"}
            size={22}
            color={color}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.label}>Type</Text>
            <Text style={[styles.value, { color }]}>
              {isIncome ? "Income" : "Expense"}
            </Text>
          </View>
        </View>

        {/* DATE */}
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={20} color="#196F63" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.label}>Date</Text>
            <Text style={styles.value}>
              {new Date(item.createdAt).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  headerWrapper: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    padding: 6,
    marginRight: 12,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    marginTop: 20,
    marginHorizontal: 20,
    elevation: 3,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#18493F",
  },

  amount: {
    fontSize: 30,
    fontWeight: "900",
    marginTop: 10,
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#E6F3EE",
    marginVertical: 14,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  label: {
    fontSize: 13,
    color: "#6F7E78",
    fontWeight: "600",
  },

  value: {
    fontSize: 17,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 2,
  },
});
