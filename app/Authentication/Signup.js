// app/Authentication/Signup.js
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

export default function Signup() {
  const router = useRouter();

  const signupUser = useUserAuthStore((s) => s.signupUser);
  const loginUser = useUserAuthStore((s) => s.loginUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPwd) {
      return Alert.alert("Error", "Fill all fields");
    }
    if (password.length < 8) {
      return Alert.alert("Error", "Password must be 8+ characters");
    }
    if (password !== confirmPwd) {
      return Alert.alert("Error", "Passwords do not match");
    }

    // SIGNUP
    const res = await signupUser({ name, email, password });
    console.log("SIGNUP RESULT", res);

    if (!res.ok) {
      return Alert.alert("Signup Failed", res.error || "Try again later");
    }

    // AUTO LOGIN
    const loginRes = await loginUser({ emailOrPhone: email, password });

    if (!loginRes.ok) {
      return Alert.alert("Error", "Account created, login failed");
    }

    router.replace("/Authentication/ProfileSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your WalletWave Account</Text>

      <View style={styles.inputRow}>
        <Ionicons name="person-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputRow}>
        <Ionicons name="mail-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputRow}>
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

      <Text style={styles.hint}>Password must be 8+ characters</Text>

      <View style={styles.inputRow}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPwd}
          onChangeText={setConfirmPwd}
        />
      </View>

      <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
        <Text style={styles.signupText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/Authentication/Login")}
      >
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

// styles same as before…

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 28, paddingTop: 70, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", marginBottom: 20 },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 12,
  },
  input: { flex: 1, marginLeft: 10 },
  hint: { color: "#888", marginBottom: 6 },
  signupBtn: {
    height: 54,
    backgroundColor: "#4c6ef5",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  signupText: { color: "#fff", fontWeight: "700" },
  loginLink: { textAlign: "center", color: "#4c6ef5", marginTop: 18 },
});
