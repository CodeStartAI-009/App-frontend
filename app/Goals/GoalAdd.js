import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getSingleGoal, addGoalSaving } from "../../services/goalService";

export default function GoalAdd() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [goal, setGoal] = useState(null);
  const [amount, setAmount] = useState("");

  // Load goal for display
  const loadGoal = async () => {
    try {
      const res = await getSingleGoal(id);
      setGoal(res.data.goal);
    } catch (err) {
      Alert.alert("Error", "Failed to load goal");
    }
  };

  useEffect(() => {
    loadGoal();
  }, []);

  const handleAddSaving = async () => {
    if (!amount || Number(amount) <= 0)
      return Alert.alert("Error", "Enter a valid amount");

    try {
      const res = await addGoalSaving(id, Number(amount));

      if (res.data.ok) {
        Alert.alert(
          "Success",
          res.data.completed ? "🎉 Goal Completed!" : "Saving added"
        );
        router.push(`/Goals/GoalDetail?id=${id}`);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to add saving");
    }
  };

  if (!goal) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Savings</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.container}>
        <Text style={styles.goalTitle}>{goal.title}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Target:</Text>
          <Text style={styles.value}>₹{goal.amount}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Saved:</Text>
          <Text style={[styles.value, { color: "#196F63" }]}>
            ₹{goal.saved}
          </Text>
        </View>

        <Text style={styles.label}>Add Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter amount to save"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity style={styles.btn} onPress={handleAddSaving}>
          <Text style={styles.btnText}>Add Savings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },
  container: { padding: 20 },
  goalTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 20,
    color: "#18493F",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: { fontSize: 16, color: "#47645A", fontWeight: "600" },
  value: { fontSize: 16, fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    backgroundColor: "#fff",
  },
  btn: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 18 },
});
