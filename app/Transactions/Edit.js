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
  const [blocked, setBlocked] = useState(false); // If split group → disallow edit

  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  /* ---------------- LOAD EXISTING DATA ---------------- */
  useEffect(() => {
    load();
  }, [id]);

  const load = async () => {
    try {
      setLoading(true);
      const res = await getSingleTransaction(id);
      const data = res.data.transaction;

      if (!data) {
        Alert.alert("Error", "Transaction not found");
        return router.back();
      }

      // Block editing split group entries
      if (String(data.category).toLowerCase() === "split group") {
        setBlocked(true);
      }

      setTitle(data.title);
      setAmount(String(data.amount));
      setCategory(data.category);
      setType(data.type);
    } catch (err) {
      Alert.alert("Error", "Failed to load transaction");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SAVE CHANGES ---------------- */
  const saveChanges = async () => {
    if (blocked) {
      Alert.alert("Not Allowed", "Split Group transactions cannot be edited.");
      return;
    }

    if (!title.trim() || !amount.trim() || !category.trim()) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (isNaN(Number(amount))) {
      Alert.alert("Error", "Amount must be a valid number");
      return;
    }

    try {
      const res = await updateTransaction(id, {
        title: title.trim(),
        amount: Number(amount),
        category: category.trim(),
        type,
      });

      if (res.data.ok) {
        Alert.alert("Updated", "Transaction updated successfully");

        // Ensures TransactionsScreen reloads fresh data
        router.push("/Transactions/TransactionsScreen");
      }
    } catch (err) {
      Alert.alert("Error", "Update failed");
    }
  };

  /* ---------------- UI STATES ---------------- */
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
        <Text style={styles.headerText}>
          {blocked ? "View Transaction" : "Edit Transaction"}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={styles.card}>
          {/* TITLE */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, blocked && styles.disabled]}
            editable={!blocked}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            placeholderTextColor="#8CA19A"
          />

          {/* AMOUNT */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={[styles.input, blocked && styles.disabled]}
            editable={!blocked}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            placeholder="Enter amount"
            placeholderTextColor="#8CA19A"
          />

          {/* CATEGORY */}
          <Text style={styles.label}>Category</Text>
          <TextInput
            style={[styles.input, blocked && styles.disabled]}
            editable={!blocked}
            value={category}
            onChangeText={setCategory}
            placeholder="Food / Travel / Rent / etc."
            placeholderTextColor="#8CA19A"
          />

          {/* TYPE SELECTOR */}
          <Text style={styles.label}>Type</Text>
          <View style={styles.typeRow}>
            <TouchableOpacity
              disabled={blocked}
              style={[
                styles.typeBtn,
                type === "income" && styles.typeActive,
                blocked && styles.disabledBtn,
              ]}
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
              disabled={blocked}
              style={[
                styles.typeBtn,
                type === "expense" && styles.typeActive,
                blocked && styles.disabledBtn,
              ]}
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

          {/* SAVE BUTTON */}
          {!blocked && (
            <TouchableOpacity style={styles.saveBtn} onPress={saveChanges}>
              <Text style={styles.saveText}>Save Changes</Text>
            </TouchableOpacity>
          )}

          {blocked && (
            <Text style={styles.infoText}>
              This entry belongs to a Split Group and cannot be edited.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------ STYLES ------------------------ */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },

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

  label: { fontSize: 14, fontWeight: "600", color: "#18493F", marginTop: 16 },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D7EAE4",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
    color: "#18493F",
    elevation: 1,
  },

  disabled: {
    backgroundColor: "#E5E5E5",
    color: "#888",
  },

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

  disabledBtn: { opacity: 0.5 },

  typeActive: {
    backgroundColor: "#196F63",
  },

  typeText: { fontSize: 15, fontWeight: "700", color: "#18493F" },
  typeActiveText: { color: "#fff" },

  saveBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 26,
  },

  saveText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  infoText: {
    marginTop: 20,
    textAlign: "center",
    color: "#D9534F",
    fontWeight: "700",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
