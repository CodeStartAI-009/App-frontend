// app/components/BottomNav.js
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function BottomNav({ active = "home" }) {
  const router = useRouter();

  const tabs = [
    { key: "home", label: "Home", icon: "home-outline", route: "/Home/Home" },
    { key: "tx", label: "Transactions", icon: "swap-horizontal-outline", route: "/Transactions/Transactions" },
    { key: "month", label: "Summary", icon: "pie-chart-outline", route: "/Summary/Breakdown" },
    { key: "profile", label: "Profile", icon: "person-outline", route: "/Profile/Profile" },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((t) => (
        <TouchableOpacity
          key={t.key}
          style={styles.tab}
          onPress={() => router.push(t.route)}
        >
          <Ionicons
            name={t.icon}
            size={24}
            color={active === t.key ? "#4c6ef5" : "#777"}
          />
          <Text style={[styles.label, active === t.key && styles.activeLabel]}>
            {t.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    paddingBottom: 10,
  },
  tab: {
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    color: "#777",
    marginTop: 4,
  },
  activeLabel: {
    color: "#4c6ef5",
    fontWeight: "700",
  },
});
