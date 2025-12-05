// app/Profile/EditBank.js
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

      const res = await secureUpdate({
        upi,
        bankNumber,
        password,
      });

      if (res.data.ok) {
        Alert.alert("Success", "UPI / Bank Account updated successfully!");
        router.back();
      } else {
        Alert.alert("Error", res.data.error || "Failed to update details.");
      }
    } catch (error) {
      console.log("UPDATE ERROR:", error);
      Alert.alert("Error", "Wrong password or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Bank / UPI</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={styles.card}>
          <Text style={styles.label}>UPI ID</Text>
          <TextInput
            style={styles.input}
            placeholder="example@upi"
            value={upi}
            onChangeText={setUpi}
          />

          <Text style={styles.label}>Bank Account Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter bank account number"
            keyboardType="numeric"
            value={bankNumber}
            onChangeText={setBankNumber}
          />

          <Text style={styles.label}>Enter Password (Required)</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            style={styles.saveBtn}
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
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  card: {
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D8EDE6",
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
    marginTop: 12,
    marginBottom: 6,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: "#196F63",
    padding: 15,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 22,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
