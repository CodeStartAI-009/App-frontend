// app/Authentication/ProfileSetup.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";

export default function ProfileSetup() {
  const router = useRouter();

  const updateProfile = useUserAuthStore((s) => s.updateProfile);
  const token = useUserAuthStore((s) => s.token);
  const hydrated = useUserAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/Authentication/Login");
  }, [hydrated, token]);

  /* -------------------------------
        Avatar List
  ------------------------------- */
  const avatarList = [
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=Alex" },
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=Mia" },
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=John" },
  ];

  /* -------------------------------
        FORM STATES
  ------------------------------- */
  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [currentBalance, setCurrentBalance] = useState(""); // ⭐ NEW FIELD
  const [mobile, setMobile] = useState("");
  const [upi, setUpi] = useState("");
  const [bankNumber, setBankNumber] = useState("");

  /* -------------------------------
        SUBMIT PROFILE
  ------------------------------- */
  const handleContinue = async () => {
    if (!selected) return Alert.alert("Select Avatar");
    if (!name.trim()) return Alert.alert("Enter your name");

    if (!income.trim() || isNaN(income))
      return Alert.alert("Enter valid monthly income");

    if (!currentBalance.trim() || isNaN(currentBalance))
      return Alert.alert("Enter valid current balance");

    if (mobile.length < 10)
      return Alert.alert("Enter valid 10-digit mobile number");

    const avatarUrl = avatarList[selected].uri;

    const res = await updateProfile({
      name,
      avatarUrl,
      monthlyIncome: Number(income),
      bankBalance: Number(currentBalance), // ⭐ SAVE BALANCE
      phone: mobile,
      upi,
      bankNumber,
    });

    if (!res.ok) {
      Alert.alert("Error", res.error || "Update failed");
      return;
    }

    router.replace("/Home/Home");
  };

  /* -------------------------------
        UI
  ------------------------------- */
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>

      {/* Avatar Selection */}
      <View style={styles.grid}>
        {avatarList.map((a, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setSelected(i)}
            style={[styles.avatarWrap, selected === i && styles.selected]}
          >
            <Image source={{ uri: a.uri }} style={styles.avatar} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Name */}
      <TextInput
        style={styles.input}
        placeholder="Display Name"
        value={name}
        onChangeText={setName}
      />

      {/* Monthly Income */}
      <TextInput
        style={styles.input}
        placeholder="Monthly Income"
        keyboardType="numeric"
        value={income}
        onChangeText={setIncome}
      />

      {/* ⭐ NEW CURRENT BALANCE FIELD */}
      <TextInput
        style={styles.input}
        placeholder="Current Bank Balance"
        keyboardType="numeric"
        value={currentBalance}
        onChangeText={setCurrentBalance}
      />

      {/* Mobile Number */}
      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        maxLength={10}
        value={mobile}
        onChangeText={setMobile}
      />

      {/* Optional UPI */}
      <TextInput
        style={styles.input}
        placeholder="UPI ID (optional)"
        value={upi}
        onChangeText={setUpi}
      />

      {/* Optional Bank Number */}
      <TextInput
        style={styles.input}
        placeholder="Bank Account Number (optional)"
        value={bankNumber}
        keyboardType="numeric"
        onChangeText={setBankNumber}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.btn} onPress={handleContinue}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>
          Save & Continue
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* -------------------------------
        STYLES
------------------------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  avatarWrap: {
    width: "30%",
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: { borderColor: "#4c6ef5" },
  avatar: { width: "100%", height: "100%" },
  input: {
    backgroundColor: "#f3f4f6",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  btn: {
    backgroundColor: "#4c6ef5",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
});
