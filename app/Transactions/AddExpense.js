import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addExpense } from "../../services/expenseService";

// ⭐ Import Interstitial Ads
import { loadInterstitial, showInterstitial } from "../../utils/InterstitialAd";

export default function AddExpense() {
  const router = useRouter();

  const CATEGORIES = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Rent",
    "Health",
    "Other",
  ];

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [adLoaded, setAdLoaded] = useState(false);

  // ⭐ Load ad when screen opens
  useEffect(() => {
    loadInterstitial(setAdLoaded);
  }, []);

  const saveExpense = async () => {
    if (!title || !amount) {
      Alert.alert("Error", "All fields required!");
      return;
    }

    try {
      const res = await addExpense({
        title,
        amount: Number(amount),
        category,
      });

      if (res.data.ok) {
        Alert.alert("Success", "Expense added!");

        // ⭐ Increase expense counter
        let count = Number(await AsyncStorage.getItem("expense_count")) || 0;
        count += 1;
        await AsyncStorage.setItem("expense_count", String(count));

        console.log("Expense Count =", count);

        // 🎯 Show Ad After Every 4 Expenses
        if (count >= 4 && adLoaded) {
          showInterstitial();
          loadInterstitial(setAdLoaded); // Load next ad
          await AsyncStorage.setItem("expense_count", "0"); // Reset counter
        }

        router.push("/Home/Home");
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 80 }}>
      
      {/* HEADER */}
      <Text style={styles.header}>Add New Expense</Text>

      {/* INPUT CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          placeholder="Eg: Lunch, Auto Fare"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Choose Category</Text>

        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => {
            const active = category === c;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.catItem, active && styles.catActive]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.catText, active && styles.catTextActive]}>
                  {c}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={saveExpense}>
          <Text style={styles.saveText}>Save Expense</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: 50 },

  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#18493F",
    marginLeft: 20,
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    marginHorizontal: 20,
    elevation: 2,
  },

  label: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  input: {
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CFE8E2",
    marginTop: 6,
    fontSize: 16,
  },

  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },

  catItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#EAF6F3",
    borderRadius: 20,
    margin: 4,
    borderWidth: 1,
    borderColor: "#CFE8E2",
  },

  catActive: {
    backgroundColor: "#196F63",
    borderColor: "#196F63",
  },

  catText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#18493F",
  },

  catTextActive: { color: "#FFFFFF" },

  saveBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
