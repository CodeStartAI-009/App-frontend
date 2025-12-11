// app/Goals/CreateGoal.js
import React, { useState, useEffect, useCallback } from "react";
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
import { useRouter, useFocusEffect } from "expo-router";
import BottomNav from "../components/BottomNav";
import { createGoal } from "../../services/goalService";

// Interstitial Ads
import {
  loadInterstitial,
  showInterstitial,
} from "../../utils/InterstitialAd";

export default function CreateGoal() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const [adLoaded, setAdLoaded] = useState(false);

  // Load interstitial ad
  useEffect(() => {
    loadInterstitial(setAdLoaded);
  }, []);

  // CLEAR FORM EVERY TIME USER ENTERS THIS SCREEN
  useFocusEffect(
    useCallback(() => {
      setTitle("");
      setAmount("");
    }, [])
  );

  const saveGoal = async () => {
    if (!title || !amount)
      return Alert.alert("Missing Fields", "Title and amount are required.");

    try {
      const res = await createGoal({
        title,
        amount: Number(amount),
      });

      if (res.data.ok) {
        Alert.alert("Success", "Goal created successfully!");

        // Show ad
        if (adLoaded) showInterstitial();

        // Prepare next ad
        loadInterstitial(setAdLoaded);

        router.push("/Goals/Overview");
      }
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Failed to create goal");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Create New Goal</Text>
      </View>

      {/* FORM */}
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          
          <Text style={styles.label}>Goal Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Buy a Laptop"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Target Amount (₹)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 60000"
            placeholderTextColor="#94A3B8"
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

/* ---------------- GREEN PREMIUM UI ---------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  container: {
    padding: 20,
    paddingBottom: 150,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDEFE9",
    elevation: 3,
  },

  label: {
    fontSize: 15,
    color: "#18493F",
    fontWeight: "700",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDE7E1",
    marginTop: 6,
    fontSize: 16,
    color: "#0F172A",
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 26,
    elevation: 4,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
