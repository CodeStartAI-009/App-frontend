// app/Goals/GoalDetails.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import BottomNav from "../components/BottomNav";
import { getSingleGoal } from "../../services/goalService";

export default function GoalDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const [goal, setGoal] = useState(null);

  const loadGoal = async () => {
    try {
      const res = await getSingleGoal(id);
      setGoal(res.data.goal);
    } catch (err) {
      console.log("GOAL DETAILS ERROR:", err);
    }
  };

  // REFRESH GOAL WHENEVER SCREEN IS FOCUSED
  useFocusEffect(
    useCallback(() => {
      loadGoal();
    }, [id])
  );

  if (!goal) {
    return (
      <View style={styles.center}>
        <Text>Loading goal...</Text>
      </View>
    );
  }

  const progress = Math.min((goal.saved / goal.amount) * 100, 100);

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{goal.title}</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Goal Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{goal.title}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Target Amount</Text>
            <Text style={styles.value}>₹{goal.amount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Saved So Far</Text>
            <Text style={[styles.value, { color: "#196F63" }]}>
              ₹{goal.saved}
            </Text>
          </View>

          {/* Progress */}
          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? "#22c55e" : "#196F63",
                },
              ]}
            />
          </View>

          <Text style={styles.progressText}>
            {progress.toFixed(1)}% Completed
          </Text>

          {/* Completed Badge */}
          {progress === 100 && (
            <View style={styles.completedBox}>
              <Ionicons name="checkmark-circle" size={40} color="#22c55e" />
              <Text style={styles.completedText}>Goal Completed!</Text>
            </View>
          )}
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push(`/Goals/GoalAdd?id=${goal._id}`)}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.addBtnText}>Add Amount</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ------------------- STYLES ------------------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

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

  scroll: {
    padding: 20,
    paddingBottom: 150,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#DDEFE9",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 16,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: "#47645A",
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    color: "#18493F",
    fontWeight: "800",
  },

  progressBackground: {
    height: 12,
    backgroundColor: "#DCEFE6",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 16,
  },
  progressFill: {
    height: 12,
    borderRadius: 12,
  },
  progressText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
  },

  completedBox: {
    marginTop: 20,
    backgroundColor: "#E8FFF1",
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#C6F1D1",
    alignItems: "center",
  },
  completedText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    color: "#15803d",
  },

  addBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 25,
    elevation: 4,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
