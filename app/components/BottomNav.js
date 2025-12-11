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
    <View style={styles.navContainer}>
      {tabs.map((t) => {
        const isActive = active === t.key;

        return (
          <TouchableOpacity
            key={t.key}
            style={styles.tab}
            onPress={() => router.push(t.route)}
            activeOpacity={0.7}
          >
            {/* Icon */}
            <Ionicons
              name={t.icon}
              size={26}
              color={isActive ? "#196F63" : "#8BA39C"}
              style={isActive && styles.activeIcon}
            />

            {/* Label */}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {t.label}
            </Text>

            {/* Active Indicator */}
            {isActive && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

/* ---------------------- WALLETWAVE THEME ---------------------- */

const styles = StyleSheet.create({
  navContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",

    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#DCEFEA",

    // Floating feel
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,

    // Soft rounded edges
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,

    paddingBottom: 50,
  },

  tab: {
    alignItems: "center",
    justifyContent: "center",
    width: 80,
  },

  label: {
    marginTop: 3,
    fontSize: 12,
    color: "#8BA39C",
    fontWeight: "500",
  },

  activeLabel: {
    color: "#196F63",
    fontWeight: "700",
  },

  activeIcon: {
    transform: [{ scale: 1.15 }],
  },

  indicator: {
    width: 30,
    height: 3.5,
    backgroundColor: "#196F63",
    borderRadius: 10,
    marginTop: 4,
  },
});
