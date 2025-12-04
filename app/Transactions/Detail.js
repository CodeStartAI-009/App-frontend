// app/Transactions/Detail.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getSingleTransaction } from "../../services/expenseService";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getSingleTransaction(id);
      setItem(res.data.transaction);
    } catch (err) {
      console.log("DETAIL ERROR:", err);
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
      {/* TOP BAR */}
      <View style={styles.topRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#18493F" />
        </TouchableOpacity>

        <Text style={styles.header}>Transaction Detail</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.box}>
        <Text style={styles.title}>{item.title}</Text>

        <Text style={[styles.amount, { color }]}>
          {isIncome ? "+" : "-"}₹{item.amount}
        </Text>

        <View style={styles.line} />

        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{item.category}</Text>

        <Text style={styles.label}>Type</Text>
        <Text style={styles.value}>{item.type}</Text>

        <Text style={styles.label}>Date</Text>
        <Text style={styles.value}>
          {new Date(item.createdAt).toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center"},

  container: { flex: 1, padding: 20, backgroundColor: "#fff",paddingTop: 50},

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },

  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#18493F",
    marginLeft: 12,
  },

  box: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E6F3EE",
  },

  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#18493F",
  },

  amount: {
    fontSize: 26,
    fontWeight: "800",
    marginVertical: 10,
  },

  line: {
    height: 1,
    backgroundColor: "#E6F3EE",
    marginVertical: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 6,
    color: "#6F7E78",
  },

  value: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
    marginBottom: 4,
  },
});
