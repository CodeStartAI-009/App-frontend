import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import BottomNav from "../components/BottomNav";

import { getSingleGoal, updateGoal } from "../../services/goalService";

export default function EditGoal() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // goal ID from route params

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [saved, setSaved] = useState("");

  const loadGoal = async () => {
    try {
      const res = await getSingleGoal(id);
      const g = res.data.goal;

      setTitle(g.title);
      setAmount(String(g.amount));
      setSaved(String(g.saved));
    } catch (err) {
      Alert.alert("Error", "Failed to load goal");
    }
  };

  useEffect(() => {
    loadGoal();
  }, []);

  const saveGoal = async () => {
    if (!title || !amount) {
      return Alert.alert("Missing Fields", "Title and amount are required.");
    }

    try {
      const updated = {
        title,
        amount: Number(amount),
        saved: Number(saved),
      };

      await updateGoal(id, updated);

      Alert.alert("Success", "Goal updated successfully!");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Could not update goal");
    }
  };

  const progress = (Number(saved) / Number(amount)) * 100;
  const completed = progress >= 100;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Goal</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={styles.card}>
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter goal title"
          />

          <Text style={styles.label}>Target Amount (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter target amount"
          />

          <Text style={styles.label}>Saved Amount (₹)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={saved}
            onChangeText={setSaved}
            placeholder="Enter saved amount"
          />

          {/* Progress */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.progressText}>
              Progress: {progress.toFixed(1)}%
            </Text>

            <View style={styles.progressBarBackground}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(progress, 100)}%` },
                ]}
              />
            </View>

            {completed && (
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={24} color="#2ECC71" />
                <Text style={styles.completedText}>Goal Completed!</Text>
              </View>
            )}
          </View>

          {/* SAVE BUTTON */}
          <TouchableOpacity style={styles.saveBtn} onPress={saveGoal}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    backgroundColor: "#196F63",
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },
  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },
  label: {
    fontSize: 15,
    color: "#18493F",
    marginTop: 12,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
  },

  progressText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginBottom: 6,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: "#D9EDE6",
    borderRadius: 10,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: "#196F63",
    borderRadius: 10,
  },
  completedBadge: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    marginTop: 12,
  },
  completedText: {
    color: "#2ECC71",
    fontWeight: "700",
  },

  saveBtn: {
    backgroundColor: "#196F63",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
