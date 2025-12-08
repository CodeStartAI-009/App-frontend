// app/Transactions/AddIncome.js
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
import { addIncome } from "../../services/expenseService";

// ⭐ Import Interstitial Ads
import { loadInterstitial, showInterstitial } from "../../utils/InterstitialAd";

export default function AddIncome() {
  const router = useRouter();

  const INCOME_CATEGORIES = [
    "Salary",
    "Business",
    "Gift",
    "Freelance",
    "Allowance",
    "Bonus",
    "Other",
  ];

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [adLoaded, setAdLoaded] = useState(false);

  // ⭐ Load ad once on screen open
  useEffect(() => {
    loadInterstitial(setAdLoaded);
  }, []);

  const saveIncome = async () => {
    if (!title.trim()) return Alert.alert("Error", "Title is required!");
    if (!amount.trim() || isNaN(amount))
      return Alert.alert("Error", "Enter a valid amount!");

    try {
      const res = await addIncome({
        title,
        amount: Number(amount),
        category,
      });

      if (res.data.ok) {
        Alert.alert("Success", "Income added!");

        // ⭐ Increase income counter
        let count = Number(await AsyncStorage.getItem("income_count")) || 0;
        count += 1;

        await AsyncStorage.setItem("income_count", String(count));
        console.log("Income Count =", count);

        // 🎯 Show ad after every 4 incomes
        if (count >= 4 && adLoaded) {
          showInterstitial();
          loadInterstitial(setAdLoaded); // load next ad
          await AsyncStorage.setItem("income_count", "0"); // reset
        }

        router.push("/Home/Home");
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <Text style={styles.header}>Add Income</Text>

      <View style={styles.card}>
        {/* TITLE */}
        <Text style={styles.label}>Income Title</Text>
        <TextInput
          placeholder="Eg: Salary, Pocket Money"
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />

        {/* AMOUNT */}
        <Text style={styles.label}>Amount (₹)</Text>
        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          style={styles.input}
          value={amount}
          onChangeText={setAmount}
        />

        {/* CATEGORY */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.catGrid}>
          {INCOME_CATEGORIES.map((c) => {
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

        {/* SAVE BUTTON */}
        <TouchableOpacity style={styles.btn} onPress={saveIncome}>
          <Text style={styles.btnText}>Save Income</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/* --------------------- STYLES --------------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", paddingTop: 50 },

  header: {
    fontSize: 28,
    fontWeight: "900",
    color: "#18493F",
    marginLeft: 22,
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

  catGrid: {
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

  catTextActive: {
    color: "#FFFFFF",
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 24,
  },

  btnText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
