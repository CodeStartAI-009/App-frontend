// app/Profile/EditPhone.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
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
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Phone Number</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* New Phone */}
          <Text style={styles.label}>New Phone Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter new phone number"
            value={phone}
            onChangeText={setPhone}
          />

          {/* Password */}
          <Text style={styles.label}>Password (required)</Text>
          <TextInput
            secureTextEntry
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
          />

          {/* MESSAGE */}
          {msg ? (
            <Text style={[styles.msg, { color: msg.includes("✅") ? "green" : "red" }]}>
              {msg}
            </Text>
          ) : null}

          {/* BUTTON */}
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

/* ------------------------- STYLES ------------------------- */
const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 26,
    color: "#fff",
    fontWeight: "800",
    marginLeft: 10,
  },

  container: { padding: 20 },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },

  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 12,
    color: "#18493F",
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 10,
    marginTop: 6,
  },

  msg: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },

  btn: {
    backgroundColor: "#196F63",
    padding: 14,
    marginTop: 20,
    borderRadius: 12,
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },
});
