// app/Login.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";

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

    router.replace("/Home/Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Email or Mobile"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
        />
      </View>

      <View style={styles.inputContainer}>
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

      <TouchableOpacity onPress={() => router.push("Authentication/ForgotPassword")}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/Authentication/Signup")}>
        <Text style={styles.signupLink}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 28, backgroundColor: "#fff", paddingTop: 90 },
  title: { fontSize: 30, fontWeight: "700", marginBottom: 30 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 12,
    borderRadius: 12,
    height: 54,
    marginBottom: 14,
  },
  input: { flex: 1, marginLeft: 10 },
  forgot: { textAlign: "right", color: "#4c6ef5", marginBottom: 18 },
  loginBtn: {
    height: 54,
    backgroundColor: "#4c6ef5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  loginText: { color: "#fff", fontWeight: "700" },
  signupLink: { textAlign: "center", color: "#4c6ef5", marginTop: 8 },
});
