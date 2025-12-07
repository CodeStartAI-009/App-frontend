import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const router = useRouter();

  const menu = [
    { label: "Profile Details", icon: "person-circle-outline", route: "/Profile/Info" },
    { label: "Account Settings", icon: "settings-outline", route: "/Profile/Accounts" },
    { label: "Goal Creation", icon: "flag-outline", route: "/Goals/Overview" },
    { label: "Financial Calculator", icon: "calculator-outline", route: "/Calculator/Calculator" },
    { label: "Notification Settings", icon: "notifications-outline", route: "/Profile/Notification" },
    { label: "Help Desk", icon: "help-circle-outline", route: "/Profile/Helps" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>

      {/* HEADER */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Settings</Text>
      </View>

      {/* MENU LIST */}
      <ScrollView
        style={{ paddingHorizontal: 20, marginTop: 15 }}
        showsVerticalScrollIndicator={false}
      >
        {menu.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuRow}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name={item.icon} size={24} color="#196F63" />
            </View>

            <Text style={styles.menuLabel}>{item.label}</Text>

            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#9CA3AF"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    flexDirection: "row",
    alignItems: "center",
  },

  backBtn: {
    padding: 6,
    marginRight: 10,
  },

  headerText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F8FFFD",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E2EFEA",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  iconWrapper: {
    padding: 10,
    backgroundColor: "#EAF6F3",
    borderRadius: 12,
  },

  menuLabel: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 14,
    color: "#18493F",
  },
});
