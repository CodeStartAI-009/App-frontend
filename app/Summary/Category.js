import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getSummary } from "../../services/expenseService";
import { useFocusEffect } from "expo-router";

export default function Category() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});

  // Load data whenever screen becomes active
  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const load = async () => {
    try {
      setLoading(true);
      const res = await getSummary();
      const data = res?.data || {};
      setCategories(data.categories || {});
    } catch (e) {
      console.log("Category Load Error:", e);
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
      
      {/* Header */}
      <View style={styles.headerBlock}>
        <Text style={styles.title}>Spending by Category</Text>
        <Text style={styles.subtitle}>This Month</Text>
      </View>

      {/* No Data */}
      {items.length === 0 && (
        <Text style={styles.noData}>
          No category data available this month.
        </Text>
      )}

      {/* Category Cards */}
      {items.map(([name, amount], index) => (
        <View key={index} style={styles.card}>
          <View style={styles.colorStrip} />

          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.amount}>
              ₹{Number(amount).toLocaleString()}
            </Text>
          </View>
        </View>
      ))}

      <View style={{ height: 90 }} />
    </ScrollView>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },

  headerBlock: { marginBottom: 20 },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#18493F",
  },

  subtitle: {
    fontSize: 14,
    color: "#6F7E78",
    marginTop: 4,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    marginBottom: 14,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  colorStrip: {
    width: 6,
    height: "100%",
    backgroundColor: "#196F63",
    borderRadius: 6,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  amount: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 4,
    color: "#196F63",
  },

  noData: {
    textAlign: "center",
    marginTop: 30,
    color: "#7A8680",
    fontSize: 15,
    fontWeight: "500",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
