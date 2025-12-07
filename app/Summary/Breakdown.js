import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
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

      {/* SEGMENTED TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "monthly" && styles.activeTab]}
          onPress={() => setTab("monthly")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "monthly" && styles.activeTabText
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === "category" && styles.activeTab]}
          onPress={() => setTab("category")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "category" && styles.activeTabText
            ]}
          >
            Category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === "trends" && styles.activeTab]}
          onPress={() => setTab("trends")}
        >
          <Text
            style={[
              styles.tabText,
              tab === "trends" && styles.activeTabText
            ]}
          >
            Trends
          </Text>
        </TouchableOpacity>
      </View>

      {/* ⭐ AI BUTTON */}
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

/* -------------------------------- STYLES -------------------------------- */

const styles = StyleSheet.create({
  /* HEADER */
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
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  /* TABS DESIGN (Floating segmented style) */
  tabContainer: {
    flexDirection: "row",
    marginTop: -20,
    marginHorizontal: 20,
    backgroundColor: "#E7F5EF",
    borderRadius: 30,
    padding: 5,
    justifyContent: "space-between",
    elevation: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 24,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#196F63",
    elevation: 3,
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
  },
  activeTabText: {
    color: "#FFFFFF",
  },

  /* AI BUTTON */
  aiWrapper: {
    alignItems: "center",
    marginTop: 14,
  },
  aiButton: {
    flexDirection: "row",
    backgroundColor: "#196F63",
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 32,
    alignItems: "center",
    gap: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.13,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  aiButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
