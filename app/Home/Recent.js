// app/.../RecentActivity.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRecentActivity } from "../../services/expenseService";
import { useFocusEffect } from "expo-router";

export default function RecentActivity() {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getRecentActivity();
      setActivity(res.data.recent?.slice(0, 10) || []);
    } catch (e) {
      console.log("Recent Load Error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Refresh on screen focus
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator size="small" color="#196F63" />
      </View>
    );
  }

  if (!activity.length) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>No recent activity</Text>
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
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: isIncome ? "#E8FFF2" : "#FFE8E8" },
                ]}
              >
                <Ionicons
                  name={isIncome ? "arrow-up-circle" : "arrow-down-circle"}
                  size={22}
                  color={isIncome ? "#16A34A" : "#DC2626"}
                />
              </View>

              <View style={styles.middle}>
                <Text style={styles.name}>{item.title}</Text>
                <Text style={styles.time}>
                  {new Date(item.createdAt).toLocaleString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    day: "2-digit",
                    month: "short",
                  })}
                </Text>
              </View>

              <Text
                style={[
                  styles.amount,
                  { color: isIncome ? "#16A34A" : "#DC2626" },
                ]}
              >
                {isIncome ? "+" : "-"}₹{item.amount}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
}

/* ---------------- IMPROVED UI STYLES ---------------- */

const styles = StyleSheet.create({
  box: {
    marginTop: 20,
    padding: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5F2ED",
    elevation: 2,
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
    color: "#18493F",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FFFD",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EAF3EF",
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  middle: {
    flex: 1,
    marginLeft: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
  },

  time: {
    fontSize: 12,
    color: "#6F7E78",
    marginTop: 2,
  },

  amount: {
    fontSize: 17,
    fontWeight: "800",
  },

  loadingBox: { padding: 16, alignItems: "center" },

  emptyBox: { padding: 16, alignItems: "center" },

  emptyText: { color: "#6F7E78", fontStyle: "italic" },
});
