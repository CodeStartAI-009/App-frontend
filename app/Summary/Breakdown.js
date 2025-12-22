import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import Monthly from "./Monthly";
import Category from "./Category";
import Trends from "./Trends";
import { useRouter } from "expo-router";

export default function BreakdownScreen() {
  const router = useRouter();
  const [tab, setTab] = useState("monthly");

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Breakdown</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        {["monthly", "category", "trends"].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}
          >
            <Text
              style={[styles.tabText, tab === t && styles.activeTabText]}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* AI BUTTON */}
      <View style={styles.aiWrapper}>
        <TouchableOpacity
          style={styles.aiButton}
          onPress={() => router.push("/ai-insights/chat-screen")}
        >
          <Ionicons name="sparkles" size={22} color="#fff" />
          <Text style={styles.aiButtonText}>Chat With AI</Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <View style={{ flex: 1 }}>
        {tab === "monthly" && <Monthly />}
        {tab === "category" && <Category />}
        {tab === "trends" && <Trends />}
      </View>

      <BottomNav active="month" />
    </View>
  );
}

const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: 55,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { padding: 6, marginRight: 12 },
  headerText: { fontSize: 26, fontWeight: "800", color: "#fff" },

  tabContainer: {
    flexDirection: "row",
    marginTop: -20,
    marginHorizontal: 20,
    backgroundColor: "#E7F5EF",
    borderRadius: 30,
    padding: 5,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
  },
  activeTab: { backgroundColor: "#196F63" },
  tabText: { fontSize: 15, fontWeight: "700", color: "#18493F" },
  activeTabText: { color: "#fff" },

  aiWrapper: { alignItems: "center", marginTop: 14 },
  aiButton: {
    flexDirection: "row",
    backgroundColor: "#196F63",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 32,
    alignItems: "center",
    gap: 8,
  },
  aiButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
