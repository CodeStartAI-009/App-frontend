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

import {
  getSingleTransaction,
  updateTransaction,
} from "../../services/expenseService";

import { useUserAuthStore } from "../../store/useAuthStore";
import { formatCurrencyLabel } from "../../utils/money";

export default function EditTransaction() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const user = useUserAuthStore((s) => s.user);
  const markHomeDirty = useUserAuthStore((s) => s.markHomeDirty);

  const currency = user?.currency || "INR";
  const symbol = formatCurrencyLabel(currency);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getSingleTransaction(id);
      const tx = res.data.transaction;
      setTitle(tx.title);
      setAmount(String(tx.amount));
      setCategory(tx.category);
      setType(tx.type);
    } catch {
      Alert.alert("Error", "Failed to load transaction");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const save = async () => {
    try {
      await updateTransaction(id, {
        title,
        amount: Number(amount),
        category,
        type,
      });

      markHomeDirty(); // 🔥 CRITICAL
      Alert.alert("Updated");
      router.replace("/Transactions/Transactions");
    } catch {
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
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        style={styles.input}
      />
      <Text style={styles.label}>Amount in {symbol}</Text>

      <TouchableOpacity style={styles.save} onPress={save}>
        <Text style={styles.saveText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#CDE7E1",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  save: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "700" },
  label: { marginBottom: 8 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
