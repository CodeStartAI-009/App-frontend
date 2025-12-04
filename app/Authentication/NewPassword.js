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
      <Text style={styles.title}>Create New Password</Text>

      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity
        style={styles.btn}
        onPress={handleReset}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 28, paddingTop: 80, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 30 },
  input: {
    height: 55,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  btn: {
    height: 55,
    backgroundColor: "#4c6ef5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  backText: { color: "#4c6ef5", textAlign: "center", marginTop: 20 },
});
