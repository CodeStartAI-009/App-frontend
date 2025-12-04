import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from "react-native";
import { getSummary } from "../../services/expenseService";

export default function Category() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState({});

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
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

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );

  const items = Object.entries(categories);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>This Month Categories</Text>

      {items.length === 0 && (
        <Text style={styles.noData}>No category data</Text>
      )}

      {items.map(([name, amount], index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.amount}>₹{Number(amount).toLocaleString()}</Text>
        </View>
      ))}

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20, color: "#18493F" },

  card: {
    backgroundColor: "#EEF8F4",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#DCEFEA",
  },

  name: { fontSize: 16, fontWeight: "700" },
  amount: { fontSize: 18, fontWeight: "800", marginTop: 4, color: "#196F63" },

  noData: { textAlign: "center", marginTop: 30, color: "#777" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
