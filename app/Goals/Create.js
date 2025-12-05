// app/Goals/CreateGoal.js
import React, { useState } from "react";
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
import { useRouter } from "expo-router";
import BottomNav from "../components/BottomNav";

import { createGoal } from "../../services/goalService"; // backend call

export default function CreateGoal() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const saveGoal = async () => {
    if (!title || !amount) {
      return Alert.alert("Missing Fields", "Title and amount are required.");
    }

    try {
      const res = await createGoal({
        title,
        amount: Number(amount),
      });

      if (res.data.ok) {
        Alert.alert("Success", "Goal created successfully!");
        router.push("/Goals/Overview"); // go back to goals list
      }
    } catch (err) {
      console.log("GOAL CREATE ERROR:", err);
      Alert.alert("Error", "Failed to create goal");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create New Goal</Text>
      </View>

      {/* FORM */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={styles.card}>
          
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Buy a Laptop"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Target Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 60000"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <TouchableOpacity style={styles.btn} onPress={saveGoal}>
            <Text style={styles.btnText}>Create Goal</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ------------------------ STYLES ------------------------ */
const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
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
    borderColor: "#D8EDE6",
    borderWidth: 1,
  },

  label: {
    fontSize: 16,
    color: "#18493F",
    fontWeight: "600",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDE7E1",
    marginTop: 6,
    fontSize: 16,
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
