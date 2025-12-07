import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

export default function Account() {
  const router = useRouter();

  const options = [
    {
      label: "Edit Bank Details",
      icon: "wallet-outline",
      route: "/Profile/EditBank",
    },
    {
      label: "Edit Monthly Income",
      icon: "cash-outline",
      route: "/Profile/EditIncome",
    },
    {
      label: "Edit Phone Number",
      icon: "call-outline",
      route: "/Profile/EditPhone",
      note: "Requires password",
    },
    {
      label: "Edit Email",
      icon: "mail-outline",
      route: "/Profile/EditEmail",
      note: "Requires password",
    },
    {
      label: "Change Password",
      icon: "lock-closed-outline",
      route: "/Profile/ChangePassword",
      note: "Enter current password",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F7FBFA" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Account Settings</Text>
      </View>

      {/* SETTINGS LIST */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.row}
            onPress={() => router.push(item.route)}
          >
            {/* ICON CIRCLE */}
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={22} color="#196F63" />
            </View>

            {/* LABEL + NOTE */}
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              {item.note && <Text style={styles.note}>{item.note}</Text>}
            </View>

            <Ionicons
              name="chevron-forward"
              size={22}
              color="#A3A3A3"
              style={{ marginLeft: 5 }}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ------------------- STYLES ------------------- */
const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 6,
    borderRadius: 8,
  },

  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 12,
  },

  scroll: {
    padding: 20,
    paddingBottom: 120,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    borderColor: "#DDEFE8",
    borderWidth: 1,
    elevation: 2,
  },

  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#E7F5F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
  },

  note: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});
