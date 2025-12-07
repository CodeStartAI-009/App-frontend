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
import { verifyOtp } from "../../services/authService";

export default function ResetPasswordOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOtp({ email, otp });
      setLoading(false);

      if (!res.data.ok) {
        Alert.alert("Error", "OTP verification failed");
        return;
      }

      const resetToken = res.data.resetToken;

      router.push(
        `/Authentication/NewPassword?token=${resetToken}&email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", err.response?.data?.error || "Failed to verify OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>We sent a verification code to:</Text>
      <Text style={styles.email}>{email}</Text>

      {/* OTP INPUT */}
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="● ● ● ● ● ●"
          keyboardType="numeric"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
        />
      </View>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.verifyBtn, loading && { opacity: 0.7 }]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.verifyText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>← Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------------------------
        STYLES (UI IMPROVED)
---------------------------------- */
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

  subtitle: {
    fontSize: 15,
    color: "#6b7280",
  },

  email: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 26,
    color: "#4c6ef5",
  },

  /* OTP Input Wrapper */
  inputWrapper: {
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    height: 65,
    justifyContent: "center",
    paddingHorizontal: 14,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: "#e5e7eb",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  input: {
    fontSize: 22,
    textAlign: "center",
    letterSpacing: 10,
    color: "#111",
    fontWeight: "700",
  },

  verifyBtn: {
    height: 55,
    backgroundColor: "#4c6ef5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#4c6ef5",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },

  verifyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },

  backText: {
    color: "#4c6ef5",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 22,
  },
});
