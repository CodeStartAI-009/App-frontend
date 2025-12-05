// app/Goals/GoalDetails.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
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

  useEffect(() => {
    loadGoal();
  }, []);

  if (!goal) {
    return (
      <View style={styles.center}>
        <Text>Loading goal...</Text>
      </View>
    );
  }

  const progress = Math.min((goal.saved / goal.amount) * 100, 100);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{goal.title}</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        
        {/* Goal Card */}
        <View style={styles.card}>
          <Text style={styles.title}>{goal.title}</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Target Amount:</Text>
            <Text style={styles.value}>₹{goal.amount}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Saved Till Now:</Text>
            <Text style={[styles.value, { color: "#196F63" }]}>
              ₹{goal.saved}
            </Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <Text style={styles.progressText}>{progress.toFixed(1)}% Completed</Text>

          {progress === 100 ? (
            <View style={styles.completedBox}>
              <Ionicons name="checkmark-circle" size={40} color="#1A8A50" />
              <Text style={styles.completedText}>Goal Completed!</Text>
            </View>
          ) : null}
        </View>

        {/* EDIT BUTTON */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push(`/Goals/GoalAdd?id=${goal._id}`)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
          <Text style={styles.editBtnText}>Add Amount</Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------------- STYLES -------------------------- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 60,
    paddingBottom: 25,
    backgroundColor: "#196F63",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#47645A",
  },
  value: {
    fontSize: 16,
    fontWeight: "800",
    color: "#18493F",
  },

  /* Progress Bar */
  progressBarBackground: {
    height: 10,
    backgroundColor: "#DCEFE6",
    borderRadius: 10,
    marginTop: 15,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: "#196F63",
    borderRadius: 10,
  },
  progressText: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
  },

  completedBox: {
    marginTop: 20,
    backgroundColor: "#E8FFF1",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C6F1D1",
  },
  completedText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "800",
    color: "#1A8A50",
  },

  editBtn: {
    backgroundColor: "#196F63",
    marginTop: 20,
    padding: 15,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
