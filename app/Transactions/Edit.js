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
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  getSingleTransaction,
  updateTransaction,
} from "../../services/expenseService";

export default function EditTransaction() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

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
      Alert.alert("Error", "Failed to load transaction");
    } finally {
      setLoading(false);
    }
  };

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
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Transaction</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        {/* FORM WRAPPER */}
        <View style={styles.card}>

          {/* TITLE */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            placeholderTextColor="#8CA19A"
          />

          {/* AMOUNT */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#8CA19A"
          />

          {/* CATEGORY */}
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={styles.input}
            value={category}
            onChangeText={setCategory}
            placeholder="Food / Travel / Rent / etc."
            placeholderTextColor="#8CA19A"
          />

          {/* TYPE TOGGLE */}
          <Text style={styles.label}>Type</Text>

          <View style={styles.typeRow}>
            <TouchableOpacity
              style={[styles.typeBtn, type === "income" && styles.typeActive]}
              onPress={() => setType("income")}
            >
              <Text
                style={[
                  styles.typeText,
                  type === "income" && styles.typeActiveText,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.typeBtn, type === "expense" && styles.typeActive]}
              onPress={() => setType("expense")}
            >
              <Text
                style={[
                  styles.typeText,
                  type === "expense" && styles.typeActiveText,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>
          </View>

          {/* SAVE */}
          <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
            <Text style={styles.saveText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------ STYLES ------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

  /* HEADER */
  headerWrapper: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { padding: 6, marginRight: 12 },
  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /* FORM CARD */
  card: {
    marginTop: -10,
    marginHorizontal: 20,
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 16,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7EAE4",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
    color: "#18493F",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },

  /* TYPE SELECTOR */
  typeRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  typeBtn: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: "#E7F4F0",
    borderRadius: 12,
    alignItems: "center",
  },

  typeActive: {
    backgroundColor: "#196F63",
  },

  typeText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
  },

  typeActiveText: {
    color: "#FFFFFF",
  },

  /* SAVE BUTTON */
  saveBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 26,
    elevation: 2,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
