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
import { addExpense } from "../../services/expenseService";

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
        router.push("/Home/Home");
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Expense</Text>

      <TextInput
        placeholder="Title"
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

      <Text style={styles.label}>Category</Text>

      {CATEGORIES.map((c) => (
        <TouchableOpacity
          key={c}
          style={[
            styles.catBtn,
            category === c && styles.catActive,
          ]}
          onPress={() => setCategory(c)}
        >
          <Text style={{ color: category === c ? "#fff" : "#111" }}>{c}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.btn} onPress={saveExpense}>
        <Text style={styles.btnText}>Save Expense</Text>
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

  label: { fontSize: 16, fontWeight: "600", marginVertical: 10 },

  catBtn: {
    padding: 12,
    backgroundColor: "#E9EFFD",
    borderRadius: 10,
    marginVertical: 4,
  },
  catActive: { backgroundColor: "#4c6ef5" },

  btn: {
    backgroundColor: "#4c6ef5",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
