// app/Profile/EditEmail.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
        password: password,
      });

      if (res.data.ok) {
        setMsg("✅ Email updated successfully!");

        // Redirect back after a small delay
        setTimeout(() => router.back(), 1200);
      } else {
        setMsg(res.data.error || "❌ Failed to update email.");
      }
    } catch (err) {
      console.log("EMAIL UPDATE ERROR:", err);
      setMsg("❌ Wrong password or server error.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" color="#fff" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Email</Text>
      </View>

      {/* FORM */}
      <View style={styles.card}>

        <Text style={styles.label}>New Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter new email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password (required)</Text>
        <TextInput
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
        />

        {msg ? <Text style={styles.msg}>{msg}</Text> : null}

        <TouchableOpacity style={styles.btn} onPress={updateEmail}>
          <Text style={styles.btnText}>Save Email</Text>
        </TouchableOpacity>

      </View>

      <BottomNav active="profile" />
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  card: {
    margin: 20,
    padding: 20,
    borderRadius: 18,
    backgroundColor: "#F8FFFD",
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },

  label: {
    fontSize: 15,
    color: "#18493F",
    marginTop: 12,
    fontWeight: "600",
  },

  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#CDE7E1",
    borderRadius: 12,
    marginTop: 6,
    backgroundColor: "#fff",
  },

  btn: {
    backgroundColor: "#196F63",
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  msg: {
    marginTop: 12,
    color: "#d9534f",
    fontSize: 15,
    fontWeight: "600",
  },
});
