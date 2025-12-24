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
import { trackEvent } from "../../utils/analytics"; // ✅ ADD

export default function Signup() {
  const router = useRouter();

  const signupUser = useUserAuthStore((s) => s.signupUser);
  const loginUser = useUserAuthStore((s) => s.loginUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [agreed, setAgreed] = useState(false);

  /* ---------------------------------------------
      HANDLE SIGNUP
  --------------------------------------------- */
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

    if (!agreed) {
      return Alert.alert(
        "Agreement Required",
        "You must agree to the Terms & Conditions and Privacy Policy."
      );
    }

    // ---------------- SIGNUP ----------------
    const res = await signupUser({
      name,
      email,
      password,
      agreedToTerms: agreed,
    });

    if (!res.ok) {
      return Alert.alert("Signup Failed", res.error || "Try again later");
    }

    // ✅ ANALYTICS — SIGNUP COMPLETED (FUNNEL ENTRY)
    trackEvent("user_signup");

    // ---------------- AUTO LOGIN ----------------
    const loginRes = await loginUser({
      emailOrPhone: email,
      password,
    });

    if (!loginRes.ok) {
      return Alert.alert("Error", "Account created, but login failed");
    }

    router.replace("/Authentication/ProfileSetup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Your UniSpend Account</Text>

      {/* FULL NAME */}
      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      </View>

      {/* EMAIL */}
      <View style={styles.inputWrapper}>
        <Ionicons name="mail-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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

      <Text style={styles.hint}>Password must be at least 8 characters</Text>

      {/* CONFIRM PASSWORD */}
      <View style={styles.inputWrapper}>
        <Ionicons name="lock-closed-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPwd}
          onChangeText={setConfirmPwd}
        />
      </View>

      {/* TERMS CHECKBOX */}
      <View style={styles.checkRow}>
        <TouchableOpacity onPress={() => setAgreed(!agreed)}>
          <Ionicons
            name={agreed ? "checkbox-outline" : "square-outline"}
            size={24}
            color={agreed ? "#4c6ef5" : "#777"}
          />
        </TouchableOpacity>

        <Text style={styles.checkText}>
          I agree to the{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/Authentication/Terms")}
          >
            Terms & Conditions
          </Text>{" "}
          and{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/Authentication/Privacy")}
          >
            Privacy Policy
          </Text>.
        </Text>
      </View>

      {/* SIGNUP BUTTON */}
      <TouchableOpacity
        style={[styles.signupButton, !agreed && { opacity: 0.5 }]}
        disabled={!agreed}
        onPress={handleSignup}
      >
        <Text style={styles.signupButtonText}>Create Account</Text>
      </TouchableOpacity>

      {/* LOGIN REDIRECT */}
      <TouchableOpacity
        onPress={() => router.replace("/Authentication/Login")}
      >
        <Text style={styles.loginLink}>
          Already have an account? Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* -------------------- STYLES ------------------------ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 70,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 26,
    color: "#111",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 56,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    elevation: 2,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#111",
  },

  hint: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
    marginLeft: 4,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 18,
  },

  checkText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    color: "#444",
  },

  link: {
    color: "#4c6ef5",
    fontWeight: "700",
  },

  signupButton: {
    height: 55,
    backgroundColor: "#4c6ef5",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },

  signupButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
  },

  loginLink: {
    textAlign: "center",
    color: "#4c6ef5",
    fontWeight: "600",
    marginTop: 20,
    fontSize: 15,
  },
});
