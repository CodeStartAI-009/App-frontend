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
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import CountryPicker from "react-native-country-picker-modal";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";

/* ---------------- PAYMENT METHODS CONFIG ---------------- */
const PAYMENT_METHODS = {
  IN: { label: "UPI ID", needsBank: false },
  US: { label: "Zelle (Email / Phone)", needsBank: false },
  EU: { label: "SEPA Instant (IBAN)", needsBank: true },
  GB: { label: "Faster Payments (Account No)", needsBank: true },
  BR: { label: "PIX Key", needsBank: false },
  SG: { label: "PayNow (Mobile / NRIC)", needsBank: false },
  AU: { label: "PayID (Email / Phone)", needsBank: false },
  CA: { label: "Interac (Email)", needsBank: false },
};

export default function ProfileSetup() {
  const router = useRouter();

  const updateProfile = useUserAuthStore((s) => s.updateProfile);
  const token = useUserAuthStore((s) => s.token);
  const hydrated = useUserAuthStore((s) => s.hydrated);
  const loading = useUserAuthStore((s) => s.loading);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) router.replace("/Authentication/Login");
  }, [hydrated, token]);

  const avatarList = [
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=Alex" },
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=Mia" },
    { uri: "https://api.dicebear.com/6.x/fun-emoji/png?seed=John" },
  ];

  const [selected, setSelected] = useState(null);
  const [name, setName] = useState("");
  const [income, setIncome] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [mobile, setMobile] = useState("");
  const [upi, setUpi] = useState("");
  const [bankNumber, setBankNumber] = useState("");

  const [country, setCountry] = useState("India");
  const [countryCode, setCountryCode] = useState("IN");
  const [callingCode, setCallingCode] = useState("91");

  const isValidPhone = () => /^[0-9]{6,15}$/.test(mobile);

  const handleContinue = async () => {
    if (selected === null) return Alert.alert("Select an avatar");
    if (!name.trim()) return Alert.alert("Enter your name");
    if (!isValidPhone()) return Alert.alert("Enter valid mobile number");
    if (!income || isNaN(income)) return Alert.alert("Enter valid monthly income");
    if (!currentBalance || isNaN(currentBalance))
      return Alert.alert("Enter valid bank balance");

    if (!upi.trim())
      return Alert.alert(`Enter ${PAYMENT_METHODS[countryCode].label}`);

    if (PAYMENT_METHODS[countryCode]?.needsBank && !bankNumber.trim())
      return Alert.alert("Enter bank account details");

    const avatarUrl = avatarList[selected].uri;
    const fullPhone = `+${callingCode}${mobile}`;

    const res = await updateProfile({
      name: name.trim(),
      avatarUrl,
      country,
      countryCode,
      callingCode: `+${callingCode}`,
      phone: fullPhone,
      monthlyIncome: Number(income),
      bankBalance: Number(currentBalance),
      upi,
      bankNumber,
    });

    if (!res.ok) {
      Alert.alert("Error", res.error || "Profile update failed");
      return;
    }

    router.replace("/Home/Home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Set Up Your Profile</Text>
        <Text style={styles.subtitle}>Customize your experience</Text>

        {/* AVATARS */}
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

        {/* NAME */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            placeholderTextColor="#6B7280"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* COUNTRY PICKER */}
        <View style={styles.inputWrapper}>
          <CountryPicker
            countryCode={countryCode}
            withFlag
            withFilter
            withCountryNameButton
            withCallingCode
            countryCodes={Object.keys(PAYMENT_METHODS)}
            onSelect={(c) => {
              setCountry(c.name.common);
              setCountryCode(c.cca2);
              setCallingCode(c.callingCode[0]);
              setUpi("");
              setBankNumber("");
            }}
          />
        </View>

        {/* PHONE */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={`Mobile Number (+${callingCode})`}
            placeholderTextColor="#6B7280"
            keyboardType="phone-pad"
            value={mobile}
            onChangeText={setMobile}
          />
        </View>

        {/* MONTHLY INCOME */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Monthly Income"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={income}
            onChangeText={setIncome}
          />
        </View>

        {/* BALANCE */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Current Bank Balance"
            placeholderTextColor="#6B7280"
            keyboardType="numeric"
            value={currentBalance}
            onChangeText={setCurrentBalance}
          />
        </View>

        {/* PAYMENT */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder={PAYMENT_METHODS[countryCode].label}
            placeholderTextColor="#6B7280"
            autoCapitalize="none"
            value={upi}
            onChangeText={setUpi}
          />
        </View>

        {PAYMENT_METHODS[countryCode].needsBank && (
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Bank Account / IBAN"
              placeholderTextColor="#6B7280"
              value={bankNumber}
              onChangeText={setBankNumber}
            />
          </View>
        )}

        {/* SAVE */}
        <TouchableOpacity
          style={[styles.btn, loading && { opacity: 0.6 }]}
          onPress={handleContinue}
          disabled={loading}
        >
          <Text style={styles.btnText}>
            {loading ? "Saving..." : "Save & Continue"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 28,
    paddingTop: 70,
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "800" },
  subtitle: { color: "#6B7280", marginBottom: 22 },
  grid: { flexDirection: "row", justifyContent: "space-between" },
  avatarWrap: {
    width: "30%",
    height: 100,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  selected: { borderColor: "#4c6ef5" },
  avatar: { width: "100%", height: "100%" },
  inputWrapper: {
    backgroundColor: "#f3f4f6",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    justifyContent: "center",
    marginVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  input: { fontSize: 16, color: "#111827" },
  btn: {
    backgroundColor: "#4c6ef5",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
