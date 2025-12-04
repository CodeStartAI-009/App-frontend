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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#18493F" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Breakdown</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "monthly" && styles.activeTab]}
          onPress={() => setTab("monthly")}
        >
          <Text style={[styles.tabText, tab === "monthly" && styles.activeTabText]}>
            Monthly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === "category" && styles.activeTab]}
          onPress={() => setTab("category")}
        >
          <Text style={[styles.tabText, tab === "category" && styles.activeTabText]}>
            Category
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, tab === "trends" && styles.activeTab]}
          onPress={() => setTab("trends")}
        >
          <Text style={[styles.tabText, tab === "trends" && styles.activeTabText]}>
            Trends
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT — NO SCROLLVIEW HERE */}
      <View style={{ flex: 1 }}>
        {tab === "monthly" && <Monthly />}
        {tab === "category" && <Category />}
        {tab === "trends" && <Trends />}
      </View>

      <BottomNav active="breakdown" />
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backBtn: { padding: 6, marginRight: 10 },
  headerText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#18493F",
  },
  tabsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#F3FAF8",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#E6F3EE",
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#196F63",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
  },
  activeTabText: {
    color: "#fff",
  },
});
