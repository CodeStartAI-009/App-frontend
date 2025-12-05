import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";
import { changePassword } from "../../services/expenseService";

export default function ChangePassword() {
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = async () => {
    setMessage("");

    if (!currentPassword || !newPassword || !confirm) {
      return setMessage("Please fill all fields.");
    }
    if (newPassword !== confirm) {
      return setMessage("New password and confirm password do not match.");
    }

    try {
      const res = await changePassword({
        currentPassword,
        newPassword,
      });

      if (res?.data?.ok) {
        setMessage("Password updated successfully! 🎉");
        setCurrentPassword("");
        setNewPassword("");
        setConfirm("");
      } else {
        setMessage(res?.data?.error || "Something went wrong.");
      }
    } catch (e) {
      console.log("CHANGE PASSWORD ERROR:", e);
      setMessage("Incorrect current password.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Change Password</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={styles.card}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Enter your current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Re-enter new password"
            value={confirm}
            onChangeText={setConfirm}
          />

          {message ? (
            <Text style={[styles.message, { color: message.includes("success") ? "green" : "red" }]}>
              {message}
            </Text>
          ) : null}

          <TouchableOpacity style={styles.btn} onPress={handleChange}>
            <Text style={styles.btnText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------------- STYLES -------------------------- */

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

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 15,
  },

  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CDEFE6",
    marginTop: 6,
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },

  message: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "600",
  },
});
