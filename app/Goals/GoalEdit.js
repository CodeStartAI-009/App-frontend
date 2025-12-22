// app/Goals/EditGoal.js
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
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatCurrencyLabel } from "../../utils/money";

export default function EditGoal() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const user = useUserAuthStore((s) => s.user);
  const currency = user?.currency || "INR";
  const currencySymbol = formatCurrencyLabel(currency);

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [saved, setSaved] = useState("");

  useEffect(() => {
    loadGoal();
  }, []);

  async function loadGoal() {
    try {
      const res = await getSingleGoal(id);
      const g = res.data.goal;

      setTitle(g.title);
      setAmount(String(g.amount));
      setSaved(String(g.saved));
    } catch (err) {
      Alert.alert("Error", "Failed to load goal");
    }
  }

  async function saveGoal() {
    if (!title || !amount)
      return Alert.alert("Missing Fields", "Title and amount are required.");

    if (isNaN(amount) || isNaN(saved))
      return Alert.alert("Invalid Input", "Amounts must be numbers.");

    try {
      await updateGoal(id, {
        title,
        amount: Number(amount),
        saved: Number(saved),
      });

      Alert.alert("Success", "Goal updated successfully!");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Could not update goal");
    }
  }

  const progress =
    Number(amount) > 0 ? (Number(saved) / Number(amount)) * 100 : 0;
  const completed = progress >= 100;

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Goal</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter goal title"
            placeholderTextColor="#92ADA7"
          />

          <Text style={styles.label}>
            Target Amount ({currencySymbol})
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter target amount"
            placeholderTextColor="#92ADA7"
          />

          <Text style={styles.label}>
            Saved Amount ({currencySymbol})
          </Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={saved}
            onChangeText={setSaved}
            placeholder="Enter saved amount"
            placeholderTextColor="#92ADA7"
          />

          {/* Progress */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.progressText}>
              Progress: {progress.toFixed(1)}%
            </Text>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(progress, 100)}%`,
                    backgroundColor: completed
                      ? "#22c55e"
                      : "#196F63",
                  },
                ]}
              />
            </View>

            {completed && (
              <View style={styles.completedBadge}>
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color="#22c55e"
                />
                <Text style={styles.completedText}>
                  Goal Completed!
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.saveBtn} onPress={saveGoal}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------------- GREEN UI ---------------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 25,
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
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  scroll: {
    padding: 20,
    paddingBottom: 140,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDEFE9",
    elevation: 4,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#F6FBF9",
    borderWidth: 1,
    borderColor: "#CFE7E1",
    padding: 14,
    borderRadius: 12,
    marginTop: 6,
    fontSize: 16,
    color: "#18493F",
  },

  progressText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginBottom: 8,
  },
  progressBackground: {
    height: 10,
    backgroundColor: "#DCEFE6",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: 10,
    borderRadius: 10,
  },

  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    backgroundColor: "#E8FFF1",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C5F0D3",
  },
  completedText: {
    fontSize: 15,
    color: "#15803d",
    fontWeight: "700",
  },

  saveBtn: {
    backgroundColor: "#196F63",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "800",
  },
});
