import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";
import { useRouter } from "expo-router";

export default function Currency() {
  const router = useRouter();

  const [rates, setRates] = useState({});
  const [amount, setAmount] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch currency rates from free API
  const loadRates = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
      const data = await res.json();
      setRates(data.rates || {});
    } catch (e) {
      console.log("Currency Error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const convert = () => {
    if (!amount || !rates[from] || !rates[to]) return;

    // Convert FROM → USD → TO currency
    const inUSD = amount / rates[from];
    const final = inUSD * rates[to];

    setResult(final.toFixed(2));
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Currency Converter</Text>
        </View>

        <View style={styles.container}>

          {/* Amount Input */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
          />

          {/* FROM Currency */}
          <Text style={styles.label}>From Currency</Text>
          <TextInput
            style={styles.input}
            placeholder="USD"
            value={from}
            onChangeText={setFrom}
          />

          {/* TO Currency */}
          <Text style={styles.label}>To Currency</Text>
          <TextInput
            style={styles.input}
            placeholder="INR"
            value={to}
            onChangeText={setTo}
          />

          {/* Convert Button */}
          <TouchableOpacity style={styles.button} onPress={convert}>
            <Text style={styles.buttonText}>Convert</Text>
          </TouchableOpacity>

          {/* Result Box */}
          {result !== null && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Converted Amount</Text>
              <Text style={styles.resultValue}>
                {to} {result}
              </Text>
            </View>
          )}

          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      <BottomNav active="calculator" />
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  header: {
    backgroundColor: "#196F63",
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
    marginTop: 10,
  },

  container: {
    padding: 20,
  },

  label: {
    fontSize: 15,
    color: "#18493F",
    fontWeight: "600",
    marginTop: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    marginTop: 8,
    fontSize: 16,
    backgroundColor: "#F8FFFD",
  },

  button: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },

  resultCard: {
    backgroundColor: "#EAF6F3",
    borderRadius: 14,
    padding: 20,
    marginTop: 25,
    alignItems: "center",
  },

  resultLabel: {
    fontSize: 16,
    color: "#18493F",
    fontWeight: "600",
  },

  resultValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#196F63",
    marginTop: 8,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
