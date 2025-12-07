// app/Group/EditGroupScreen.js
import React, { useEffect, useState } from "react";
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
import { useLocalSearchParams, useRouter } from "expo-router";
import { getGroupDetails, updateGroup } from "../../services/splitService";

export default function EditGroupScreen() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [creatorUPI, setCreatorUPI] = useState("");
  const [participants, setParticipants] = useState([]);

  const [tempUser, setTempUser] = useState("");
  const [tempAmount, setTempAmount] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const res = await getGroupDetails(groupId);
      const g = res.data.group;

      setTitle(g.title);
      setCreatorUPI(g.creatorUPI);

      const formatted = g.participants.map((p) => ({
        identifier: p.userId.email || p.userId.userName || p.userId.phone,
        amountToPay: p.amountToPay,
        userId: p.userId._id,
      }));

      setParticipants(formatted);
    } catch (err) {
      Alert.alert("Error", "Failed to load group");
    } finally {
      setLoading(false);
    }
  }

  function addParticipant() {
    if (!tempUser.trim() || !tempAmount.trim()) {
      return Alert.alert("Error", "Enter user & amount");
    }

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

  async function handleUpdate() {
    try {
      const payload = { title, creatorUPI, participants };
      const res = await updateGroup(groupId, payload);

      if (res.data.ok) {
        Alert.alert("Success", "Group updated!");
        router.back();
      }
    } catch (err) {
      Alert.alert("Error", "Update failed");
    }
  }

  if (loading)
    return (
      <Text style={{ padding: 20, fontSize: 16, color: "#18493F" }}>
        Loading...
      </Text>
    );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#F6FBF9" }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Group</Text>
      </View>

      {/* MAIN CARD */}
      <View style={styles.card}>
        <Text style={styles.label}>Group Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Group title"
          placeholderTextColor="#94A3B8"
        />

        <Text style={styles.label}>Creator UPI</Text>
        <TextInput
          style={styles.input}
          value={creatorUPI}
          onChangeText={setCreatorUPI}
          placeholder="yourupi@bank"
          autoCapitalize="none"
          placeholderTextColor="#94A3B8"
        />

        {/* Add Participant */}
        <Text style={styles.label}>Add Participant</Text>

        <TextInput
          style={styles.input}
          placeholder="identifier"
          value={tempUser}
          onChangeText={setTempUser}
          placeholderTextColor="#94A3B8"
        />

        <TextInput
          style={styles.input}
          placeholder="Amount"
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

      {/* PARTICIPANT LIST */}
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

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
        <Text style={styles.saveBtnText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* -------------------- PREMIUM GREEN UI SYSTEM -------------------- */
const styles = StyleSheet.create({
  /* HEADER */
  header: {
    paddingTop: 55,
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
  },

  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#CDE7E1",
    marginTop: 6,
    fontSize: 16,
    color: "#0F172A",
  },

  /* ADD BUTTON */
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

  /* PARTICIPANTS */
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
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },
  participantAmount: {
    fontSize: 14,
    color: "#196F63",
    fontWeight: "700",
  },

  /* SAVE BUTTON */
  saveBtn: {
    backgroundColor: "#196F63",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 26,
    elevation: 4,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
