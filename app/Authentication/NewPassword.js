// app/Authentication/NewPassword.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { resetPassword } from "../../services/authService";

export default function NewPassword() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const resetToken = params.token;
  const email = params.email;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Mismatch", "Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await resetPassword({
        resetToken,
        email,
        newPassword: password,
      });

      setLoading(false);

      if (!res.data.ok) {
        Alert.alert("Error", res.data.error || "Failed to reset password");
        return;
      }

      Alert.alert("Success", "Your password has been updated!");
      router.replace("/Authentication/Login");
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Create New Password</Text>
      <Text style={styles.subText}>
        Set a strong password to secure your account
      </Text>

      {/* INPUT FIELDS */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
      </View>

      {/* RESET BUTTON */}
      <TouchableOpacity
        style={[styles.btn, loading && { opacity: 0.8 }]}
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      {/* BACK LINK */}
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

/* -------------------- UI STYLES (IMPROVED) -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    paddingTop: 80,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
    color: "#111",
  },

  subText: {
    color: "#6b7280",
    marginBottom: 30,
    fontSize: 15,
  },

  inputWrapper: {
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 55,
    justifyContent: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },

  input: {
    fontSize: 16,
    color: "#111",
  },

  btn: {
    height: 55,
    backgroundColor: "#4c6ef5",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,

    marginTop: 10,
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  backText: {
    color: "#4c6ef5",
    textAlign: "center",
    marginTop: 24,
    fontSize: 15,
    fontWeight: "600",
  },
});
