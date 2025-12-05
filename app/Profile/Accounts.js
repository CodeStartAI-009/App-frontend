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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Account Settings</Text>
      </View>

      {/* OPTIONS */}
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {options.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.row}
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon} size={26} color="#196F63" />

            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.label}>{item.label}</Text>
              {item.note && (
                <Text style={styles.note}>{item.note}</Text>
              )}
            </View>

            <Ionicons
              name="chevron-forward-outline"
              size={22}
              color="#777"
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
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F1F8F6",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    marginBottom: 12,
  },

  label: {
    fontSize: 17,
    fontWeight: "700",
    color: "#18493F",
  },

  note: {
    fontSize: 12,
    color: "#777",
  },
});
