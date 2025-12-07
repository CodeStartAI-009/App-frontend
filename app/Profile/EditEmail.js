// app/Profile/EditEmail.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomNav from "../components/BottomNav";
import { changeEmail } from "../../services/expenseService";

export default function EditEmail() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const updateEmail = async () => {
    setMsg("");

    if (!email || !password) {
      return setMsg("❗ All fields are required.");
    }

    try {
      const res = await changeEmail({
        newEmail: email,
        password,
      });

      if (res.data.ok) {
        setMsg("✅ Email updated successfully!");

        setTimeout(() => router.back(), 1200);
      } else {
        setMsg(res.data.error || "❌ Failed to update email.");
      }
    } catch (err) {
      setMsg("❌ Wrong password or server error.");
    }
  };

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" color="#fff" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Email</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>New Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter new email"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text style={styles.label}>Password (required)</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            value={password}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            onChangeText={setPassword}
          />

          {msg ? (
            <Text
              style={[
                styles.msg,
                { color: msg.includes("✅") ? "#16a34a" : "#dc2626" },
              ]}
            >
              {msg}
            </Text>
          ) : null}

          {/* BUTTON */}
          <TouchableOpacity style={styles.btn} onPress={updateEmail}>
            <Text style={styles.btnText}>Save Email</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------- STYLES -------------------- */
const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F7FBFA",
  },

  header: {
    paddingTop: 60,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    elevation: 3,
    shadowColor: "#00000040",
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 7,
    borderRadius: 10,
  },

  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
  },

  scroll: {
    padding: 20,
    paddingBottom: 130,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9EEE7",
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
    padding: 12,
    marginTop: 6,
    backgroundColor: "#FAFFFD",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    borderRadius: 12,
    fontSize: 16,
    color: "#0F172A",
  },

  msg: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },

  btn: {
    backgroundColor: "#196F63",
    marginTop: 26,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#00000030",
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
