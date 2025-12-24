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

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [saved, setSaved] = useState("");

  /* ---------------- LOAD GOAL ---------------- */
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
      router.replace("/Goals/GoalsList");
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- SAVE GOAL ---------------- */
  async function saveGoal() {
    if (!title.trim() || !amount.trim()) {
      return Alert.alert(
        "Missing Fields",
        "Goal title and target amount are required."
      );
    }

    if (isNaN(amount) || isNaN(saved)) {
      return Alert.alert("Invalid Input", "Amounts must be valid numbers.");
    }

    try {
      await updateGoal(id, {
        title: title.trim(),
        amount: Number(amount),
        saved: Number(saved),
      });

      Alert.alert("Success", "Goal updated successfully!", [
        {
          text: "OK",
          onPress: () => {
            // ✅ CRITICAL FIX
            router.replace(`/Goals/Overview?id=${id}`);
          },
        },
      ]);
    } catch (err) {
      Alert.alert("Error", "Could not update goal");
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  /* ---------------- PROGRESS ---------------- */
  const progress =
    Number(amount) > 0 ? (Number(saved) / Number(amount)) * 100 : 0;

  const completed = progress >= 100;

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.replace(`/Goals/Overview`)}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Goal</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {/* TITLE */}
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter goal title"
            placeholderTextColor="#92ADA7"
          />

          {/* TARGET */}
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

          {/* SAVED */}
           

          {/* SAVE */}
          <TouchableOpacity style={styles.saveBtn} onPress={saveGoal}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FBF9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

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
  },

  saveBtnText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "800",
  },
});
