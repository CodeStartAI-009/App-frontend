// app/Profile/EditPhone.js
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
import { changePhone } from "../../services/expenseService";

export default function EditPhone() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleUpdate = async () => {
    setMsg("");

    if (!phone || !password) {
      return setMsg("Both fields are required.");
    }

    try {
      const res = await changePhone({
        newPhone: phone,
        password,
      });

      if (res.data.ok) {
        setMsg("✅ Phone updated successfully!");
        setTimeout(() => router.back(), 1200);
      } else {
        setMsg(res.data.error || "Update failed");
      }
    } catch (err) {
      setMsg("❌ Incorrect password or server error.");
    }
  };

  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Edit Phone Number</Text>
      </View>

      {/* FORM CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {/* Phone Field */}
          <Text style={styles.label}>New Phone Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter new phone number"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Password */}
          <Text style={styles.label}>Password (required)</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
          />

          {/* Message */}
          {msg ? (
            <Text
              style={[
                styles.msg,
                { color: msg.includes("✅") ? "#15803D" : "#D92D20" },
              ]}
            >
              {msg}
            </Text>
          ) : null}

          {/* Button */}
          <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
            <Text style={styles.btnText}>Update Phone</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ------------------------- PREMIUM UI STYLES ------------------------- */

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F7FBFA",
  },

  /* HEADER */
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
    elevation: 4,
    shadowColor: "#00000040",
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 8,
    borderRadius: 10,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },

  scroll: {
    padding: 20,
    paddingBottom: 140,
  },

  /* CARD */
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
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FAFFFD",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#0F172A",
  },

  msg: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "600",
  },

  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 28,
    elevation: 3,
    shadowColor: "#00000035",
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
