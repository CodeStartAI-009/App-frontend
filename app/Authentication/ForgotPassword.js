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

      const res = await forgotPassword({ email: email.trim() });
      console.log("OTP API Response:", res.data);

      setSecondsLeft(45);
      Alert.alert("OTP Sent", "A verification code has been sent to your email.");

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

      {/* HEADER */}
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email and we will send you a verification code.
      </Text>

      {/* INPUT */}
      <View style={styles.inputWrapper}>
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

      {/* BUTTON */}
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

      {/* RESEND ROW */}
      <View style={styles.row}>
        <Text style={styles.hintText}>Didn't receive the email?</Text>

        <TouchableOpacity onPress={sendOtp} disabled={secondsLeft > 0}>
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

      {/* BACK LINK */}
      <TouchableOpacity
        style={styles.backLink}
        onPress={() => router.replace("/Authentication/Login")}
      >
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>

    </View>
  );
}

/* ---------------- STYLES (Improved UI Only) ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 26,
    paddingTop: 90,
    backgroundColor: "#fff",
  },

  /* TITLE */
  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
    color: "#000",
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 28,
  },

  /* INPUT */
  inputWrapper: {
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  input: {
    fontSize: 16,
    color: "#111",
  },

  /* BUTTON */
  btn: {
    height: 52,
    backgroundColor: "#4c6ef5",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 14,
  },
  btnDisabled: { opacity: 0.6 },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.3,
  },

  /* RESEND ROW */
  row: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hintText: { color: "#6b7280", fontSize: 14 },
  resendText: { color: "#4c6ef5", fontWeight: "700", fontSize: 15 },
  resendDisabled: { color: "#94a3b8" },

  /* BACK LINK */
  backLink: {
    marginTop: 32,
    alignItems: "center",
  },
  backText: {
    color: "#4c6ef5",
    fontWeight: "700",
    fontSize: 15,
  },
});
