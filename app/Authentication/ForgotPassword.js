// app/ForgotPassword.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { forgotPassword } from "../../services/authService";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    let timer;
    if (secondsLeft > 0) {
      timer = setInterval(() => setSecondsLeft((s) => s - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [secondsLeft]);

  const isValidEmail = (e) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e);

  const sendOtp = async () => {
    if (!email.trim()) {
      return Alert.alert("Validation", "Please enter your email address.");
    }

    if (!isValidEmail(email.trim())) {
      return Alert.alert("Invalid Email", "Please enter a valid email.");
    }

    try {
      setLoading(true);

      // ⭐ REAL API CALL ⭐
      const res = await forgotPassword({ email: email.trim() });

      console.log("OTP API Response:", res.data);

      setSecondsLeft(45);
      Alert.alert("OTP Sent", "A verification code has been sent to your email.");

      // Navigate to OTP screen
      router.push(
        `/Authentication/ResetPasswordOTP?email=${encodeURIComponent(
          email.trim()
        )}`
      );
    } catch (err) {
      console.log("Forgot password error:", err);
      Alert.alert(
        "Error",
        err.response?.data?.error || "Failed to send OTP. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we will send you a verification code.
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={[styles.btn, loading && styles.btnDisabled]}
        onPress={sendOtp}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.btnText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      <View style={styles.row}>
        <Text style={styles.hintText}>Didn't receive the email?</Text>

        <TouchableOpacity
          onPress={sendOtp}
          disabled={secondsLeft > 0}
        >
          <Text
            style={[
              styles.resendText,
              secondsLeft > 0 && styles.resendDisabled,
            ]}
          >
            {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => router.replace("/Authentication/Login")}
      >
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { color: "#6b7280", marginBottom: 24 },
  inputRow: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    justifyContent: "center",
    marginBottom: 18,
  },
  input: { fontSize: 16 },
  btn: {
    height: 52,
    backgroundColor: "#4c6ef5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  row: { marginTop: 6, flexDirection: "row", justifyContent: "space-between" },
  hintText: { color: "#6b7280" },
  resendText: { color: "#4c6ef5", fontWeight: "700" },
  resendDisabled: { color: "#94a3b8" },
  backLink: { marginTop: 28, alignItems: "center" },
  backText: { color: "#4c6ef5", fontWeight: "600" },
});
