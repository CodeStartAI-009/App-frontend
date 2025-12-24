// app/Group/CreateGroupScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { createSplitGroup } from "../../services/splitService";
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatMoney } from "../../utils/money";
import { trackEvent } from "../../utils/analytics";

// ⭐ Ads
import {
  loadInterstitial,
  showInterstitial,
} from "../../utils/InterstitialAd";

/* ---------------- PAYMENT LABELS ---------------- */
const PAYMENT_LABEL = {
  IN: "UPI ID",
  US: "Zelle",
  EU: "SEPA Instant",
  GB: "Faster Payments",
  BR: "PIX",
  SG: "PayNow",
  AU: "PayID",
  CA: "Interac",
};

export default function CreateGroupScreen() {
  const router = useRouter();
  const user = useUserAuthStore((s) => s.user);

  const currency = user?.currency || "INR";
  const countryCode = user?.countryCode || "IN";
  const paymentLabel = PAYMENT_LABEL[countryCode] || "Payment ID";

  const hasSavedPayment = Boolean(user?.upiHash);

  const [title, setTitle] = useState("");
  const [participants, setParticipants] = useState([]);

  const [tempUser, setTempUser] = useState("");
  const [tempAmount, setTempAmount] = useState("");

  const [paymentInput, setPaymentInput] = useState("");
  const [adLoaded, setAdLoaded] = useState(false);

  const viewedRef = useRef(false);

  /* ---------------- LOAD ADS ---------------- */
  useEffect(() => {
    loadInterstitial(setAdLoaded);
  }, []);

  /* ---------------- SCREEN VIEW ---------------- */
  useEffect(() => {
    if (!viewedRef.current) {
      trackEvent("group_create_screen_viewed");
      viewedRef.current = true;
    }
  }, []);

  /* ---------------- ADD PARTICIPANT ---------------- */
  function addParticipant() {
    const identifier = tempUser.trim().toLowerCase();
    const amount = Number(tempAmount);

    if (!identifier || !tempAmount) {
      return Alert.alert("Error", "Please enter user and amount");
    }

    if (isNaN(amount) || amount <= 0) {
      return Alert.alert("Error", "Amount must be greater than zero");
    }

    if (participants.find((p) => p.identifier === identifier)) {
      return Alert.alert("Error", "User already added");
    }

    setParticipants((prev) => [
      ...prev,
      { identifier, amountToPay: amount },
    ]);

    trackEvent("group_participant_added");

    setTempUser("");
    setTempAmount("");
  }

  /* ---------------- CREATE GROUP ---------------- */
  async function handleCreate() {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return Alert.alert("Error", "Enter group title");
    }

    if (!hasSavedPayment && !paymentInput.trim()) {
      return Alert.alert(
        "Payment Required",
        `Please enter your ${paymentLabel}`
      );
    }

    if (participants.length === 0) {
      return Alert.alert("Error", "Add at least one participant");
    }

    try {
      const res = await createSplitGroup({
        title: trimmedTitle,
        creatorUPI: hasSavedPayment ? null : paymentInput.trim(),
        participants,
      });

      if (res?.data?.ok) {
        trackEvent("group_created", {
          participants: participants.length,
        });

        if (adLoaded) showInterstitial();
        loadInterstitial(setAdLoaded);

        router.back();
      } else {
        trackEvent("group_create_failed");
        Alert.alert("Error", res?.data?.error || "Failed to create group");
      }
    } catch (err) {
      trackEvent("group_create_failed");
      Alert.alert("Error", "Server error");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create Split Group</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* INPUT CARD */}
        <View style={styles.card}>
          <Text style={styles.label}>Group Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Trip to Goa"
            placeholderTextColor="#94A3B8"
          />

          {/* PAYMENT METHOD */}
          <Text style={styles.label}>
            Payment Method ({paymentLabel})
          </Text>

          {hasSavedPayment ? (
            <View style={styles.readonlyBox}>
              <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
              <Text style={styles.readonlyText}>
                Using your saved {paymentLabel}
              </Text>
            </View>
          ) : (
            <TextInput
              style={styles.input}
              value={paymentInput}
              onChangeText={setPaymentInput}
              placeholder={`Enter your ${paymentLabel}`}
              autoCapitalize="none"
              placeholderTextColor="#94A3B8"
            />
          )}

          {/* ADD PARTICIPANT */}
          <Text style={styles.label}>Add Participant</Text>

          <TextInput
            style={styles.input}
            placeholder="Email / username / phone"
            value={tempUser}
            onChangeText={setTempUser}
            autoCapitalize="none"
            placeholderTextColor="#94A3B8"
          />

          <TextInput
            style={styles.input}
            placeholder="Amount to pay"
            keyboardType="numeric"
            value={tempAmount}
            onChangeText={setTempAmount}
            placeholderTextColor="#94A3B8"
          />

          <TouchableOpacity style={styles.addBtn} onPress={addParticipant}>
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add Participant</Text>
          </TouchableOpacity>
        </View>

        {/* PARTICIPANTS */}
        {participants.length > 0 && (
          <View style={[styles.card, { marginTop: 22 }]}>
            <Text style={styles.label}>Participants</Text>

            {participants.map((p, i) => (
              <View key={i} style={styles.participantRow}>
                <View>
                  <Text style={styles.participantName}>{p.identifier}</Text>
                  <Text style={styles.participantAmount}>
                    {formatMoney(p.amountToPay, currency)}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    setParticipants((prev) =>
                      prev.filter((_, idx) => idx !== i)
                    );
                    trackEvent("group_participant_removed");
                  }}
                >
                  <Ionicons
                    name="trash-outline"
                    size={22}
                    color="#EF4444"
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* CREATE */}
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>Create Group</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDEFE9",
    elevation: 2,
    marginBottom: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginTop: 6,
    color: "#0F172A",
  },

  readonlyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 10,
    backgroundColor: "#ECFDF5",
    padding: 12,
    borderRadius: 12,
  },
  readonlyText: {
    color: "#166534",
    fontWeight: "700",
  },

  addBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  participantRow: {
    backgroundColor: "#F6FBF9",
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#CDE7E1",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  participantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e293b",
  },
  participantAmount: {
    fontSize: 14,
    color: "#196F63",
    fontWeight: "700",
  },

  createBtn: {
    backgroundColor: "#196F63",
    padding: 16,
    borderRadius: 16,
    marginTop: 30,
    alignItems: "center",
    elevation: 4,
  },
  createBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
