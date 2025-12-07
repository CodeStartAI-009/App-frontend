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
    <View style={{ flex: 1, backgroundColor: "#F7FBFA" }}>
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Change Password</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label}>Current Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Enter your current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>New Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor="#9CA3AF"
          />

          <Text style={styles.label}>Confirm New Password</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Re-enter new password"
            value={confirm}
            onChangeText={setConfirm}
            placeholderTextColor="#9CA3AF"
          />

          {/* MESSAGE */}
          {message ? (
            <View
              style={[
                styles.messageBox,
                message.includes("success")
                  ? styles.successBox
                  : styles.errorBox,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  message.includes("success")
                    ? styles.successText
                    : styles.errorText,
                ]}
              >
                {message}
              </Text>
            </View>
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
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#00000040",
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
    paddingBottom: 130,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D8EDE6",
    elevation: 2,
    shadowColor: "#00000020",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 14,
  },

  input: {
    backgroundColor: "#FAFFFD",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDEFE6",
    marginTop: 6,
    fontSize: 16,
    color: "#0F172A",
  },

  /* MESSAGE BOX */
  messageBox: {
    marginTop: 16,
    padding: 10,
    borderRadius: 10,
  },

  successBox: {
    backgroundColor: "#E9FFF1",
    borderColor: "#8DE9B1",
    borderWidth: 1,
  },

  errorBox: {
    backgroundColor: "#FFECEC",
    borderColor: "#E39A9A",
    borderWidth: 1,
  },

  messageText: {
    fontSize: 14,
    fontWeight: "600",
  },

  successText: {
    color: "#15803D",
  },

  errorText: {
    color: "#B91C1C",
  },

  /* BUTTON */
  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 28,
    elevation: 3,
    shadowColor: "#00000030",
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
