import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import BottomNav from "../components/BottomNav";
import { secureUpdate } from "../../services/expenseService";

export default function EditBank() {
  const router = useRouter();

  const [upi, setUpi] = useState("");
  const [bankNumber, setBankNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!upi && !bankNumber) {
      return Alert.alert("Nothing to Update", "Enter UPI or Bank Account Number.");
    }
    if (!password) {
      return Alert.alert("Password Required", "Enter password to update sensitive info.");
    }

    try {
      setLoading(true);
      const res = await secureUpdate({ upi, bankNumber, password });

      if (res.data.ok) {
        Alert.alert("Success", "UPI / Bank Account updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", res.data.error || "Failed to update details.");
      }
    } catch (error) {
      Alert.alert("Error", "Wrong password or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F7FBFA" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Bank / UPI</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          <Text style={styles.label}>UPI ID</Text>
          <TextInput
            style={styles.input}
            placeholder="example@upi"
            placeholderTextColor="#9CA3AF"
            value={upi}
            onChangeText={setUpi}
          />

          <Text style={styles.label}>Bank Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter bank account number"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={bankNumber}
            onChangeText={setBankNumber}
          />

          <Text style={styles.label}>Enter Password (Required)</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.disabledBtn]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveBtnText}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ------------------------- STYLES ------------------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 26,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#00000030",
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.22)",
    padding: 7,
    borderRadius: 10,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginLeft: 12,
  },

  scroll: {
    padding: 20,
    paddingBottom: 130,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D9EEE7",
    elevation: 2,
    shadowColor: "#00000020",
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 16,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#FAFFFD",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#0F172A",
  },

  saveBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 28,
    elevation: 3,
    shadowColor: "#00000030",
  },

  disabledBtn: {
    opacity: 0.7,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
