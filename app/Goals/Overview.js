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

import {
  getGoals,
  deleteGoal,
} from "../../services/goalService"; // backend connected

export default function Overview() {
  const router = useRouter();
  const [goals, setGoals] = useState([]);

  const loadGoals = async () => {
    try {
      const res = await getGoals();
      let list = res.data.goals;

      // → Mark completed
      list = list.map((g) => ({
        ...g,
        completed: g.saved >= g.amount,
      }));

      // → Sort: incomplete first, completed last
      list.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
      });

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
      style={styles.editSwipe}
      onPress={() => router.push(`/Goals/GoalEdit?id=${goal._id}`)}
    >
      <Ionicons name="create-outline" size={26} color="#fff" />
      <Text style={styles.swipeText}>Edit</Text>
    </TouchableOpacity>
  );

  const renderRightActions = (goal) => (
    <TouchableOpacity
      style={styles.deleteSwipe}
      onPress={async () => {
        await deleteGoal(goal._id);
        loadGoals();
      }}
    >
      <Ionicons name="trash-outline" size={26} color="#fff" />
      <Text style={styles.swipeText}>Delete</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Goals</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        
        {/* Create New Goal */}
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push("/Goals/Create")}
        >
          <Ionicons name="add-circle-outline" size={22} color="#fff" />
          <Text style={styles.createBtnText}>Create New Goal</Text>
        </TouchableOpacity>

        {/* Goal List */}
        {goals.length === 0 ? (
          <Text style={styles.noGoalText}>No goals created yet.</Text>
        ) : (
          goals.map((g) => (
            <Swipeable
              key={g._id}
              renderLeftActions={() => renderLeftActions(g)}
              renderRightActions={() => renderRightActions(g)}
            >
              <TouchableOpacity
                style={[
                  styles.goalCard,
                  g.completed && styles.completedGoalCard,
                ]}
                onPress={() => router.push(`/Goals/GoalDetail?id=${g._id}`)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.goalTitle}>{g.title}</Text>

                  {g.completed && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#2ECC71"
                      style={{ marginLeft: 6 }}
                    />
                  )}
                </View>

                <View style={styles.amountRow}>
                  <Text style={styles.label}>Target:</Text>
                  <Text style={styles.value}>₹{g.amount}</Text>
                </View>

                <View style={styles.amountRow}>
                  <Text style={styles.label}>Saved:</Text>
                  <Text style={[styles.value, { color: "#196F63" }]}>
                    ₹{g.saved}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarBackground}>
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${Math.min(
                          (g.saved / g.amount) * 100,
                          100
                        )}%`,
                        backgroundColor: g.completed ? "#2ECC71" : "#196F63",
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
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------------- STYLES -------------------------- */
const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    backgroundColor: "#196F63",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  createBtn: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 20,
  },
  createBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  goalCard: {
    backgroundColor: "#F8FFFD",
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    marginBottom: 16,
  },

  completedGoalCard: {
    opacity: 0.7,
    borderColor: "#2ECC71",
  },

  goalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 10,
  },

  completedText: {
    marginTop: 10,
    color: "#2ECC71",
    fontWeight: "700",
  },

  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 2,
  },
  label: {
    fontSize: 15,
    color: "#47645A",
    fontWeight: "600",
  },
  value: {
    fontSize: 15,
    color: "#18493F",
    fontWeight: "700",
  },

  progressBarBackground: {
    height: 8,
    backgroundColor: "#D9EDE6",
    borderRadius: 10,
    marginTop: 10,
  },
  progressBarFill: {
    height: 8,
    borderRadius: 10,
  },

  editSwipe: {
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
  deleteSwipe: {
    backgroundColor: "#E74C3C",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },

  swipeText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 4,
  },

  noGoalText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
    marginTop: 40,
  },
});
