// app/Goals/GoalAdd.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

import { getSingleGoal, addGoalSaving } from "../../services/goalService";
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatMoney } from "../../utils/money";

export default function GoalAdd() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const user = useUserAuthStore((s) => s.user);
  const currency = user?.currency || "INR";

  const [goal, setGoal] = useState(null);
  const [amount, setAmount] = useState("");

  /* ---------------- LOAD GOAL ---------------- */
  useEffect(() => {
    loadGoal();
  }, [id]);

  const loadGoal = async () => {
    try {
      const res = await getSingleGoal(id);
      setGoal(res.data.goal);
    } catch {
      Alert.alert("Error", "Failed to load goal");
    }
  };

  /* ---------------- ADD SAVING ---------------- */
  const handleAddSaving = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return Alert.alert("Invalid Input", "Enter a valid amount");
    }

    try {
      const res = await addGoalSaving(id, Number(amount));

      Alert.alert(
        "Success",
        res.data.completed ? "🎉 Goal Completed!" : "Saving Added!"
      );

      // ✅ ALWAYS go back to GoalDetails (deterministic)
      router.replace(`/Goals/Overview`);
    } catch {
      Alert.alert("Error", "Failed to add saving");
    }
  };

  if (!goal) {
    return <Text style={{ padding: 20 }}>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.replace(`/Goals/Overview`)
          }
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Savings</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* GOAL CARD */}
        <View style={styles.goalCard}>
          <Text style={styles.goalTitle}>{goal.title}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Target Amount</Text>
            <Text style={styles.value}>
              {formatMoney(goal.amount, currency)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Saved So Far</Text>
            <Text style={[styles.value, { color: "#196F63" }]}>
              {formatMoney(goal.saved, currency)}
            </Text>
          </View>
        </View>

        {/* INPUT */}
        <Text style={styles.inputLabel}>Add Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter amount to save"
          value={amount}
          onChangeText={setAmount}
        />

        {/* BUTTON */}
        <TouchableOpacity style={styles.btn} onPress={handleAddSaving}>
          <Text style={styles.btnText}>Add Savings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },

  container: {
    padding: 20,
    paddingBottom: 150,
  },

  goalCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDEFE9",
    marginBottom: 20,
    elevation: 3,
  },

  goalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
    color: "#18493F",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },

  label: {
    fontSize: 15,
    color: "#47645A",
    fontWeight: "600",
  },

  value: {
    fontSize: 16,
    fontWeight: "800",
    color: "#18493F",
  },

  inputLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#47645A",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 14,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 22,
    elevation: 4,
  },

  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
