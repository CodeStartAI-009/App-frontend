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

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Resend timer state (optional UI)
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
      Alert.alert("Validation", "Please enter your email address.");
      return;
    }
    if (!isValidEmail(email.trim())) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);

      // ===== Replace this block with your real API call =====
      // Example:
      // const res = await fetch("https://api.yoursite.com/auth/send-reset-otp", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email: email.trim() }),
      // });
      // const data = await res.json();
      // if (!res.ok) throw new Error(data?.message || "Failed");
      // ======================================================

      // Simulated network/API delay
      await new Promise((r) => setTimeout(r, 900));

      // Simulated success response
      setSecondsLeft(45); // user must wait 45s to resend
      Alert.alert("OTP Sent", "A verification code has been sent to your email.");

      // navigate to OTP verification screen and pass email as query param
      router.push(`/Authentication/ResetPasswordOTP?email=${encodeURIComponent(email.trim())}`);
    } catch (err) {
      console.warn(err);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    sendOtp();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter the email associated with your account and we'll send a verification code.
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
        <TouchableOpacity onPress={handleResend} disabled={secondsLeft > 0}>
          <Text style={[styles.resendText, secondsLeft > 0 && styles.resendDisabled]}>
            {secondsLeft > 0 ? `Resend in ${secondsLeft}s` : "Resend"}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => router.replace("/Login")}
      >
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 80, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "700", color: "#111", marginBottom: 8 },
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
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  hintText: { color: "#6b7280" },
  resendText: { color: "#4c6ef5", fontWeight: "700" },
  resendDisabled: { color: "#94a3b8" },
  backLink: { marginTop: 28, alignItems: "center" },
  backText: { color: "#4c6ef5", fontWeight: "600" },
});
