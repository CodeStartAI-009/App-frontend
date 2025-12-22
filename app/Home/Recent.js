import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

import { getRecentActivity } from "../../services/expenseService";
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatCurrencyLabel } from "../../utils/money";

export default function RecentActivity() {
  const user = useUserAuthStore((s) => s.user);
  const homeDirty = useUserAuthStore((s) => s.homeDirty);

  const currencyCode = user?.currency || "INR";
  const currencySymbol = formatCurrencyLabel(currencyCode);

  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getRecentActivity(true); // 🔥 FORCE REFRESH
      setActivity(res.data.recent?.slice(0, 10) || []);
    } catch (e) {
      console.log("Recent Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [homeDirty])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="small" color="#196F63" />
      </View>
    );
  }

  if (!activity.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.empty}>No recent activity</Text>
      </View>
    );
  }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Recent Activity</Text>

      <FlatList
        data={activity}
        keyExtractor={(item) => item._id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const isIncome = item.type === "income";

          return (
            <View style={styles.row}>
              <Ionicons
                name={isIncome ? "arrow-up-circle" : "arrow-down-circle"}
                size={24}
                color={isIncome ? "#16A34A" : "#DC2626"}
              />

              <View style={styles.middle}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleString()}
                </Text>
              </View>

              <Text
                style={[
                  styles.amount,
                  { color: isIncome ? "#16A34A" : "#DC2626" },
                ]}
              >
                {isIncome ? "+" : "-"}
                {currencySymbol}
                {item.amount}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginTop: 16,
  },
  title: { fontSize: 18, fontWeight: "800", marginBottom: 12 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  middle: { flex: 1, marginLeft: 12 },
  name: { fontWeight: "700" },
  time: { fontSize: 12, color: "#6B7280" },
  amount: { fontWeight: "800" },
  center: { padding: 20, alignItems: "center" },
  empty: { color: "#6B7280" },
});
