// app/Group/CreateGroupScreen.js
import React, { useState, useEffect } from "react";
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

// ⭐ Import Interstitial Ads
import {
  loadInterstitial,
  showInterstitial,
} from "../../utils/InterstitialAd";

export default function CreateGroupScreen() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [creatorUPI, setCreatorUPI] = useState("");
  const [participants, setParticipants] = useState([]);

  const [tempUser, setTempUser] = useState("");
  const [tempAmount, setTempAmount] = useState("");

  const [adLoaded, setAdLoaded] = useState(false);

  // ⭐ Load the ad when screen opens
  useEffect(() => {
    loadInterstitial(setAdLoaded);
  }, []);

  function addParticipant() {
    if (!tempUser.trim() || !tempAmount.trim())
      return Alert.alert("Error", "Please enter user and amount");

    if (participants.find((p) => p.identifier === tempUser.trim().toLowerCase()))
      return Alert.alert("Error", "User already added");

    setParticipants([
      ...participants,
      {
        identifier: tempUser.trim().toLowerCase(),
        amountToPay: Number(tempAmount),
      },
    ]);

    setTempUser("");
    setTempAmount("");
  }

  async function handleCreate() {
    if (!title.trim()) return Alert.alert("Error", "Enter group title");
    if (!creatorUPI.trim()) return Alert.alert("Error", "Enter your UPI ID");
    if (participants.length === 0)
      return Alert.alert("Error", "Add at least one participant");

    try {
      const res = await createSplitGroup({ title, creatorUPI, participants });

      if (res?.data?.ok) {
        Alert.alert("Success", "Group created!");

        // ⭐ Show ad after creating split group
        if (adLoaded) showInterstitial();

        // load next ad
        loadInterstitial(setAdLoaded);

        router.back();
      } else {
        Alert.alert("Error", res?.data?.error || "Failed to create group");
      }
    } catch (err) {
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

          <Text style={styles.label}>Your UPI ID</Text>
          <TextInput
            style={styles.input}
            value={creatorUPI}
            onChangeText={setCreatorUPI}
            placeholder="yourupi@bank"
            autoCapitalize="none"
            placeholderTextColor="#94A3B8"
          />

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

        {/* PARTICIPANTS LIST */}
        {participants.length > 0 && (
          <View style={[styles.card, { marginTop: 22 }]}>
            <Text style={styles.label}>Participants</Text>

            {participants.map((p, i) => (
              <View key={i} style={styles.participantRow}>
                <View>
                  <Text style={styles.participantName}>{p.identifier}</Text>
                  <Text style={styles.participantAmount}>₹{p.amountToPay}</Text>
                </View>

                <TouchableOpacity
                  onPress={() =>
                    setParticipants(participants.filter((_, idx) => idx !== i))
                  }
                >
                  <Ionicons name="trash-outline" size={22} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* CREATE BUTTON */}
        <TouchableOpacity style={styles.createBtn} onPress={handleCreate}>
          <Text style={styles.createBtnText}>Create Group</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ---------------- PREMIUM GREEN THEME UI ---------------- */
const styles = StyleSheet.create({
  /* HEADER */
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

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DDEFE9",
    elevation: 2,
    marginBottom: 12,
  },

  /* LABEL */
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
  },

  /* INPUT */
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

  /* ADD PARTICIPANT BUTTON */
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

  /* PARTICIPANT ITEM */
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

  /* CREATE BUTTON */
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
