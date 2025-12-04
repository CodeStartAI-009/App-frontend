// app/Transactions/AddIncome.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { addIncome } from "../../services/expenseService";

export default function AddIncome() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Income"); // ✅ Default Category

  const saveIncome = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Title is required!");
      return;
    }

    if (!amount.trim() || isNaN(amount)) {
      Alert.alert("Error", "Enter a valid amount!");
      return;
    }

    try {
      const res = await addIncome({
        title,
        amount: Number(amount),
        category, // ✅ Send category
      });

      if (res.data.ok) {
        Alert.alert("Success", "Income added!");
        router.push("/Home/Home");
      }
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.error || "Something went wrong"
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Income</Text>

      <TextInput
        placeholder="Title (e.g., Salary, Pocket Money)"
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        placeholder="Amount"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      {/* CATEGORY INPUT (OPTIONAL) */}
      <TextInput
        placeholder="Category (optional — default: Income)"
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.btn} onPress={saveIncome}>
        <Text style={styles.btnText}>Save Income</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, marginTop: 50 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 20 },
  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  btn: {
    backgroundColor: "#4c6ef5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
