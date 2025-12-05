import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

export default function Profile() {
  const router = useRouter();

  const menu = [
    { label: "Profile Details", icon: "person-circle-outline", route: "/Profile/Info" },
    { label: "Account Settings", icon: "settings-outline", route: "/Profile/Accounts" },
    { label: "Goal Creation", icon: "flag-outline", route: "/Profile/Goals" },
    { label: "Financial Calculator", icon: "calculator-outline", route: "/Calculator/Calculator" },
    { label: "Notification Settings", icon: "notifications-outline", route: "/Profile/Notifications" },
    { label: "Help Desk", icon: "help-circle-outline", route: "/Profile/Help" },
    
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      
      {/* HEADER WITH BACK BUTTON */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={26} color="#18493F" />
        </TouchableOpacity>

        <Text style={styles.header}>Settings</Text>
      </View>

      {/* SCROLL AREA */}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {menu.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.row}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon} size={26} color="#196F63" />
            <Text style={styles.label}>{item.label}</Text>

            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#777"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}

        {/* Space so bottom nav doesn’t cover last item */}
        <View style={{ height: 80 }} />
      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <BottomNav active="profile" />
    </View>
  );
}

/* ------------------ STYLES ------------------ */
const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backBtn: {
    marginRight: 12,
    padding: 6,
  },
  header: {
    fontSize: 28,
    fontWeight: "800",
    color: "#18493F",
  },

  container: {
    paddingHorizontal: 20,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8F6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#18493F",
  },
});
