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
import { Picker } from "@react-native-picker/picker";
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

    const inUSD = parseFloat(amount) / rates[from];
    const final = inUSD * rates[to];

    setResult(final.toFixed(2));
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );

  const currencyList = Object.keys(rates);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Currency Converter</Text>
      </View>

      {/* CONTENT */}
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.container}>

          {/* AMOUNT */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
          />

          {/* FROM */}
          <Text style={styles.label}>From Currency</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={from} onValueChange={(v) => setFrom(v)}>
              {currencyList.map((item) => (
                <Picker.Item label={item} value={item} key={item} />
              ))}
            </Picker>
          </View>

          {/* TO */}
          <Text style={styles.label}>To Currency</Text>
          <View style={styles.pickerBox}>
            <Picker selectedValue={to} onValueChange={(v) => setTo(v)}>
              {currencyList.map((item) => (
                <Picker.Item label={item} value={item} key={item} />
              ))}
            </Picker>
          </View>

          {/* BUTTON */}
          <TouchableOpacity style={styles.btn} onPress={convert}>
            <Text style={styles.btnText}>Convert</Text>
          </TouchableOpacity>

          {/* RESULT */}
          {result !== null && (
            <View style={styles.resultCard}>
              <Text style={styles.resultLabel}>Converted Amount</Text>
              <Text style={styles.resultValue}>{to} {result}</Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      <BottomNav active="profile" />
    </View>
  );
}

/* ---------------------- WALLETWAVE STYLES ---------------------- */
const styles = StyleSheet.create({
  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
  },

  backBtn: { paddingRight: 12 },

  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  /* CONTENT */
  container: {
    paddingTop: 20,
    paddingHorizontal: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 20,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DCEFEA",
    fontSize: 16,
    marginTop: 8,
  },

  pickerBox: {
    backgroundColor: "#F8FFFD",
    borderWidth: 1,
    borderColor: "#E6F3EE",
    marginTop: 8,
    borderRadius: 12,
  },

  /* BUTTON */
  btn: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 28,
  },

  btnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },

  /* RESULT CARD */
  resultCard: {
    marginTop: 24,
    backgroundColor: "#F8FFFD",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E6F3EE",
    alignItems: "center",
  },

  resultLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#18493F",
  },

  resultValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#196F63",
    marginTop: 8,
  },

  /* LOADING */
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
