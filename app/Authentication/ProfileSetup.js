// app/Authentication/ProfileSetup.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";

export default function ProfileSetup() {
  const router = useRouter();
  const updateProfile = useUserAuthStore((s) => s.updateProfile);
  const token = useUserAuthStore((s) => s.token);
  const hydrated = useUserAuthStore((s) => s.hydrated);
  
  useEffect(() => {
    if (!hydrated) return;   // WAIT UNTIL STORE READY
  
    if (!token) {
      console.log("❌ No token — redirecting...");
      router.replace("/Authentication/Login");
    }
  }, [hydrated, token]);
  
  const avatarList = [
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=Alex" },
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=Mia" },
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=John" },
  ];

  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [mobile, setMobile] = useState("");
  const [upi, setUpi] = useState("");
  const [bankNumber, setBankNumber] = useState("");

  const handleContinue = async () => {
    if (!selected) return Alert.alert("Select Avatar");
    if (!name.trim()) return Alert.alert("Name required");
    if (!income.trim() || isNaN(income)) return Alert.alert("Enter valid income");
    if (mobile.length < 10) return Alert.alert("Enter valid mobile number");

    const avatarUrl = avatarList[selected].uri;

    const res = await updateProfile({
      name,
      avatarUrl,
      monthlyIncome: Number(income),
      phone: mobile,
      upi: upi || null,
      bankNumber: bankNumber || null,
    });

    if (!res.ok) {
      return Alert.alert("Error", res.error || "Failed to update profile");
    }

    router.replace("/Home/Home");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Up Your Profile</Text>

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

      <TextInput style={styles.input} placeholder="Display Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Monthly Income" keyboardType="numeric" value={income} onChangeText={setIncome} />
      <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" maxLength={10} value={mobile} onChangeText={setMobile} />
      <TextInput style={styles.input} placeholder="UPI ID (optional)" value={upi} onChangeText={setUpi} />
      <TextInput style={styles.input} placeholder="Bank Account Number (optional)" keyboardType="numeric" value={bankNumber} onChangeText={setBankNumber} />

      <TouchableOpacity style={styles.btn} onPress={handleContinue}>
        <Text style={{ color: "#fff", fontWeight: "700" }}>Save & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// styles unchanged...


// ------------ Styles ------------
const styles = StyleSheet.create({
  container: { flex: 1, padding: 28, backgroundColor: "#fff", paddingTop: 60 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  grid: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
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
