// app/Profile/Overview.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { getGoals, deleteGoal } from "../../services/goalService";

export default function Overview() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);

  const loadGoals = async () => {
    try {
      const res = await getGoals();
      let list = res.data.goals;

      list = list.map((g) => ({
        ...g,
        completed: g.saved >= g.amount,
      }));

      list.sort((a, b) => (a.completed ? 1 : -1));

      setGoals(list);
    } catch (e) {
      console.log("GOAL LOAD ERROR", e);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const renderLeftActions = (goal) => (
    <TouchableOpacity
      style={styles.swipeEdit}
      onPress={() => router.push(`/Goals/GoalEdit?id=${goal._id}`)}
    >
      <Ionicons name="create-outline" size={24} color="#fff" />
      <Text style={styles.swipeText}>Edit</Text>
    </TouchableOpacity>
  );

  const renderRightActions = (goal) => (
    <TouchableOpacity
      style={styles.swipeDelete}
      onPress={async () => {
        await deleteGoal(goal._id);
        loadGoals();
      }}
    >
      <Ionicons name="trash-outline" size={24} color="#fff" />
      <Text style={styles.swipeText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>
      
      {/* HEADER */}
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>My Goals</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>

        {/* Create New Goal */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push("/Goals/Create")}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.createBtnText}>Create New Goal</Text>
        </TouchableOpacity>

        {/* LIST */}
        {goals.length === 0 ? (
          <Text style={styles.noGoalsText}>No goals created yet.</Text>
        ) : (
          goals.map((g) => (
            <Swipeable
              key={g._id}
              renderLeftActions={() => renderLeftActions(g)}
              renderRightActions={() => renderRightActions(g)}
            >
              <TouchableOpacity
                style={[styles.goalCard, g.completed && styles.goalCompleted]}
                onPress={() => router.push(`/Goals/GoalDetail?id=${g._id}`)}
              >
                {/* TITLE */}
                <View style={styles.titleRow}>
                  <Text style={styles.goalTitle}>{g.title}</Text>
                  {g.completed && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#22c55e"
                    />
                  )}
                </View>

                {/* AMOUNTS */}
                <View style={styles.row}>
                  <Text style={styles.label}>Target:</Text>
                  <Text style={styles.value}>₹{g.amount}</Text>
                </View>

                <View style={styles.row}>
                  <Text style={styles.label}>Saved:</Text>
                  <Text style={[styles.value, { color: "#196F63" }]}>
                    ₹{g.saved}
                  </Text>
                </View>

                {/* PROGRESS BAR */}
                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min((g.saved / g.amount) * 100, 100)}%`,
                        backgroundColor: g.completed
                          ? "#22c55e"
                          : "#196F63",
                      },
                    ]}
                  />
                </View>

                {g.completed && (
                  <Text style={styles.completedText}>Goal Completed 🎉</Text>
                )}
              </TouchableOpacity>
            </Swipeable>
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------------- STYLES ---------------------- */

const styles = StyleSheet.create({
  headerRow: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  scrollContainer: {
    padding: 20,
    paddingBottom: 130,
  },

  /* CREATE BUTTON */
  createBtn: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
    marginBottom: 20,
  },
  createBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  /* GOAL CARD */
  goalCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  goalCompleted: {
    borderColor: "#22c55e",
    opacity: 0.9,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  goalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18493F",
  },

  /* LABELS */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 3,
  },
  label: {
    fontSize: 15,
    color: "#4B6F68",
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    color: "#18493F",
    fontWeight: "700",
  },

  /* PROGRESS BAR */
  progressBackground: {
    height: 8,
    backgroundColor: "#D9EDE6",
    borderRadius: 10,
    marginTop: 14,
  },
  progressFill: {
    height: 8,
    borderRadius: 10,
  },

  completedText: {
    marginTop: 12,
    color: "#22c55e",
    fontWeight: "700",
    fontSize: 15,
  },

  /* SWIPE STYLES */
  swipeEdit: {
    backgroundColor: "#0EA5E9",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  swipeDelete: {
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  swipeText: { color: "#fff", fontSize: 12, marginTop: 4 },

  noGoalsText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6F7E78",
    marginTop: 40,
  },
});
