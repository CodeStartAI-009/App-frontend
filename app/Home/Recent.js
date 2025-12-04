import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getRecentActivity } from "../../services/expenseService";

export default function RecentActivity() {
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getRecentActivity();
      setActivity(res.data.recent?.slice(0, 10) || []);
    } catch (e) {
      console.log("Recent error:", e);
    } finally {
      setLoading(false);
    }
  };

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
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.left}>
              <Ionicons
                name={item.type === "income" ? "arrow-up-circle" : "arrow-down-circle"}
                size={22}
                color={item.type === "income" ? "#198754" : "#D9534F"}
              />

              <View style={{ marginLeft: 12 }}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#F8FFFD",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#18493F",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 10,
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#E8F2EF",
    alignItems: "center",
  },
  left: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 15, fontWeight: "600", color: "#18493F" },
  time: { fontSize: 12, color: "#6F7E78" },
  amount: { fontSize: 16, fontWeight: "700" },
  loadingBox: { padding: 16, alignItems: "center" },
  emptyBox: { padding: 16, alignItems: "center" },
  emptyText: { color: "#6F7E78" },
});
