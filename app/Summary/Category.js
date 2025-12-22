// Category.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "expo-router";

import { getSummary } from "../../services/expenseService";
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatCurrencyLabel } from "../../utils/money";

export default function Category() {
  const user = useUserAuthStore((s) => s.user);
  const currencySymbol = formatCurrencyLabel(user?.currency || "INR");

  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    try {
      setLoading(true);

      const res = await getSummary(); // ✅ cached internally
      setCategories(res?.data?.categories || {});
    } catch (err) {
      console.log("Category load error:", err);
      setCategories({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  const items = Object.entries(categories);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Spending by Category</Text>

      {items.length === 0 && (
        <Text style={styles.noData}>
          No category data available.
        </Text>
      )}

      {items.map(([name, value]) => (
        <View key={name} style={styles.card}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.amount}>
            {currencySymbol}
            {Number(value || 0).toLocaleString()}
          </Text>
        </View>
      ))}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFFFF",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 20,
    color: "#18493F",
  },

  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    backgroundColor: "#F8FFFD",
    marginBottom: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  amount: {
    fontSize: 18,
    fontWeight: "800",
    color: "#196F63",
    marginTop: 4,
  },

  noData: {
    textAlign: "center",
    marginTop: 30,
    color: "#7A8680",
    fontSize: 15,
    fontWeight: "600",
  },
});
