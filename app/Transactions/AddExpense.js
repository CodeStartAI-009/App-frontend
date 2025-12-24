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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { addExpense } from "../../services/expenseService";
import { useUserAuthStore } from "../../store/useAuthStore";
import { trackEvent } from "../../utils/analytics";

// Interstitial Ads
import { loadInterstitial, showInterstitial } from "../../utils/InterstitialAd";

export default function AddExpense() {
  const router = useRouter();
  const markHomeDirty = useUserAuthStore((s) => s.markHomeDirty);

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
  const [customCategory, setCustomCategory] = useState("");
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    loadInterstitial(setAdLoaded);
  }, []);

  const saveExpense = async () => {
    if (!title.trim() || !amount.trim()) {
      return Alert.alert("Error", "All fields are required");
    }

    if (Number(amount) <= 0) {
      return Alert.alert("Invalid amount", "Enter a valid amount");
    }

    if (category === "Other" && !customCategory.trim()) {
      return Alert.alert("Category required", "Please specify the category");
    }

    const finalCategory =
      category === "Other" ? customCategory.trim() : category;

    try {
      const res = await addExpense({
        title: title.trim(),
        amount: Number(amount),
        category: finalCategory,
      });

      if (res.data.ok) {
        // 🔥 mark cache dirty
        markHomeDirty();

        // 🔥 analytics
        trackEvent("expense_added", {
          category: finalCategory,
        });

        // 🔥 ad logic (unchanged)
        let count = Number(await AsyncStorage.getItem("expense_count")) || 0;
        count += 1;
        await AsyncStorage.setItem("expense_count", String(count));

        if (count >= 4 && adLoaded) {
          showInterstitial();
          loadInterstitial(setAdLoaded);
          await AsyncStorage.setItem("expense_count", "0");
        }

        router.replace("/Home/Home");
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Failed to add expense"
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Add Expense</Text>

      <View style={styles.card}>
        {/* TITLE */}
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Lunch, Taxi"
        />

        {/* AMOUNT */}
        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          placeholder="Enter amount"
        />

        <View style={styles.infoNote}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#196F63"
          />
          <Text style={styles.infoText}>Enter the total amount spent.</Text>
        </View>

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.catItem,
                category === c && styles.catActive,
              ]}
              onPress={() => setCategory(c)}
            >
              <Text
                style={[
                  styles.catText,
                  category === c && styles.catTextActive,
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* OTHER CATEGORY INPUT */}
        {category === "Other" && (
          <>
            <Text style={styles.label}>Specify Category</Text>
            <TextInput
              style={styles.input}
              value={customCategory}
              onChangeText={setCustomCategory}
              placeholder="e.g. Gifts, Education, Pet care"
            />
          </>
        )}

        {/* SAVE */}
        <TouchableOpacity style={styles.saveBtn} onPress={saveExpense}>
          <Text style={styles.saveText}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: { fontSize: 28, fontWeight: "900", marginLeft: 20 },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    margin: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCEFEA",
  },

  label: { marginTop: 12, fontSize: 16, fontWeight: "700" },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CFE8E2",
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },

  infoNote: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#EAF6F3",
    padding: 10,
    borderRadius: 10,
  },

  infoText: { fontSize: 13, marginLeft: 6 },

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
  },

  catActive: { backgroundColor: "#196F63" },
  catText: { fontWeight: "600" },
  catTextActive: { color: "#fff" },

  saveBtn: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 14,
    marginTop: 26,
    alignItems: "center",
  },

  saveText: { color: "#fff", fontSize: 18, fontWeight: "700" },
});
