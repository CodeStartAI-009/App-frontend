// app/Onboarding1.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Onboarding1() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Removed image completely */}

      <Text style={styles.title}>Smart Money Starts Here</Text>
      <Text style={styles.subtitle}>
        Track your expenses, save, and build smart habits.
      </Text>

      <TouchableOpacity
        style={styles.next}
        onPress={() => router.push("Authentication/Onboarding2")}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("Authentication/Login")}>
        <Text style={styles.skip}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 70,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginTop: 300, // Adjusted since image removed
  },

  subtitle: {
    textAlign: "center",
    color: "#555",
    marginTop: 12,
    paddingHorizontal: 10,
  },

  next: {
    marginTop: 36,
    width: "90%",
    height: 52,
    backgroundColor: "#4c6ef5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  nextText: {
    color: "#fff",
    fontWeight: "700",
  },

  skip: {
    marginTop: 18,
    color: "#777",
  },
});
