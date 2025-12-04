// app/Transactions/Edit.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getSingleTransaction, updateTransaction } from "../../services/expenseService";

export default function EditTransaction() {
  const { id } = useLocalSearchParams(); // from router.push(`/Transactions/Edit?id=${item._id}`)
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  // Fetch transaction data
  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      const res = await getSingleTransaction(id);
      const data = res.data.transaction;

      setTitle(data.title);
      setAmount(String(data.amount));
      setCategory(data.category);
      setType(data.type);

    } catch (e) {
      console.log("EDIT LOAD ERROR:", e);
      Alert.alert("Error", "Failed to load transaction");
    } finally {
      setLoading(false);
    }
  };

  // Save changes
  const saveChanges = async () => {
    if (!title || !amount || !category) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    try {
      const res = await updateTransaction(id, {
        title,
        amount: Number(amount),
        category,
        type,
      });

      if (res.data.ok) {
        Alert.alert("Success", "Transaction updated!");
        router.back();
      }
    } catch (e) {
      console.log("UPDATE ERROR:", e);
      Alert.alert("Error", "Update failed");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#18493F" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Transaction</Text>
      </View>

      {/* Form */}
      <Text style={styles.label}>Title</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
      />

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholder="Enter amount"
      />

      <Text style={styles.label}>Category</Text>
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
        placeholder="Food / Travel / Rent / Income / etc."
      />

      <Text style={styles.label}>Type</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[styles.typeBtn, type === "income" && styles.activeType]}
          onPress={() => setType("income")}
        >
          <Text style={[styles.typeText, type === "income" && styles.activeTypeText]}>
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeBtn, type === "expense" && styles.activeType]}
          onPress={() => setType("expense")}
        >
          <Text style={[styles.typeText, type === "expense" && styles.activeTypeText]}>
            Expense
          </Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

// ------------------------ STYLES ------------------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" , paddingTop: 50},

  headerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  header: { fontSize: 22, fontWeight: "700", color: "#18493F", marginLeft: 10 },

  label: { fontSize: 14, fontWeight: "600", marginTop: 14, color: "#18493F" },

  input: {
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
    fontSize: 16,
  },

  typeRow: { flexDirection: "row", marginTop: 10 },
  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#E8F3EF",
    borderRadius: 8,
    marginRight: 10,
  },
  activeType: { backgroundColor: "#196F63" },
  typeText: { fontSize: 14, fontWeight: "600", color: "#18493F" },
  activeTypeText: { color: "#fff" },

  saveBtn: {
    marginTop: 24,
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
