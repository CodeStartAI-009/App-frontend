import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { verifyOtp } from "../../services/authService";

export default function ResetPasswordOTP() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // get email passed from previous screen

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert("Invalid OTP", "OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const res = await verifyOtp({
        email,
        otp,
      });

      setLoading(false);

      if (!res.data.ok) {
        Alert.alert("Error", "OTP verification failed");
        return;
      }

      const resetToken = res.data.resetToken;

      // Navigate to set new password screen
      router.push(`/Authentication/NewPassword?token=${resetToken}&email=${encodeURIComponent(email)}`);

    } catch (err) {
      setLoading(false);
      Alert.alert("Error", err.response?.data?.error || "Failed to verify OTP");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>An OTP has been sent to:</Text>
      <Text style={styles.email}>{email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter 6-digit OTP"
        keyboardType="numeric"
        maxLength={6}
        value={otp}
        onChangeText={setOtp}
      />

      <TouchableOpacity style={styles.verifyBtn} onPress={handleVerify}>
        <Text style={styles.verifyText}>{loading ? "Verifying..." : "Verify OTP"}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 28, backgroundColor: "#fff", paddingTop: 80 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 10 },
  subtitle: { color: "#777" },
  email: { fontWeight: "700", marginBottom: 20 },
  input: {
    height: 55,
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 6,
    marginBottom: 20,
  },
  verifyBtn: {
    height: 55,
    backgroundColor: "#4c6ef5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  verifyText: { color: "#fff", fontSize: 18, fontWeight: "700" },
  backText: { color: "#4c6ef5", textAlign: "center", marginTop: 18 },
});
