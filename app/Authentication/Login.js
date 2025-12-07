// app/Login.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";
import { registerForPushNotifications } from "../../utils/notifications";  // <-- ADD
import api from "../../services/api"; // <-- ADD

export default function Login() {
  const router = useRouter();
  const loginUser = useUserAuthStore((s) => s.loginUser);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleLogin = async () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both fields");
      return;
    }

    const res = await loginUser({
      emailOrPhone: emailOrPhone.trim(),
      password,
    });

    if (!res.ok) {
      Alert.alert("Login Failed", res.error);
      return;
    }

    /* ---------------------------------------------------
        🔥 Register Push Notification Token After Login
    --------------------------------------------------- */
    try {
      const token = await registerForPushNotifications();

      if (token) {
        await api.post("/notifications/save-token", { token });
        console.log("Expo push token saved ✔");
      }
    } catch (err) {
      console.log("❌ Failed to save push token", err);
    }

    router.replace("/Home/Home");
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>Welcome Back 👋</Text>
      <Text style={styles.subTitle}>Log in to continue to your dashboard</Text>

      {/* EMAIL / PHONE */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Email or Mobile"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
        />
      </View>

      {/* PASSWORD */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPwd}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPwd(!showPwd)}>
          <Ionicons
            name={showPwd ? "eye-off-outline" : "eye-outline"}
            size={20}
            color="#777"
          />
        </TouchableOpacity>
      </View>

      {/* FORGOT PASSWORD */}
      <TouchableOpacity
        onPress={() => router.push("Authentication/ForgotPassword")}
      >
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      {/* LOGIN BUTTON */}
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      {/* SIGNUP LINK */}
      <TouchableOpacity onPress={() => router.push("/Authentication/Signup")}>
        <Text style={styles.signupLink}>
          Don't have an account?{" "}
          <Text style={styles.signupStrong}>Create Account</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- IMPROVED UI STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: "#fff",
    paddingTop: 90,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 6,
    color: "#000",
  },

  subTitle: {
    fontSize: 15,
    color: "#6b7280",
    marginBottom: 28,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 14,
    borderRadius: 14,
    height: 54,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111",
  },

  forgot: {
    textAlign: "right",
    color: "#4c6ef5",
    fontWeight: "600",
    marginBottom: 20,
    fontSize: 14,
  },

  loginBtn: {
    height: 54,
    backgroundColor: "#4c6ef5",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  loginText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  signupLink: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 22,
    fontSize: 15,
  },

  signupStrong: {
    color: "#4c6ef5",
    fontWeight: "700",
  },
});
