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
import { useUserAuthStore } from "../../store/useAuthStore";
import { formatCurrencyLabel } from "../../utils/money";

export default function EditGroupScreen() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  const user = useUserAuthStore((s) => s.user);
  const currency = user?.currency || "INR";
  const symbol = formatCurrencyLabel(currency);

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [creatorUPI, setCreatorUPI] = useState("");
  const [participants, setParticipants] = useState([]);

  const [tempUser, setTempUser] = useState("");
  const [tempAmount, setTempAmount] = useState("");

  useEffect(() => {
    if (groupId) loadGroup();
  }, [groupId]);

  async function loadGroup() {
    try {
      const res = await getGroupDetails(groupId);
      const g = res.data.group;

      setTitle(g.title || "");
      setCreatorUPI(g.creatorUPI || "");

      setParticipants(
        (g.participants || []).map((p) => ({
          userId: p.userId?._id || null,
          identifier:
            (
              p.userId?.email ||
              p.userId?.userName ||
              p.userId?.phone ||
              ""
            ).toLowerCase(),
          amountToPay: Number(p.amountToPay || 0),
          isNew: false,
        }))
      );
    } catch {
      Alert.alert("Error", "Failed to load group");
    } finally {
      setLoading(false);
    }
  }

  function addParticipant() {
    const identifier = tempUser.trim().toLowerCase();
    const amount = Number(tempAmount);

    if (!identifier || !amount || amount <= 0) {
      return Alert.alert("Invalid Input", "Enter valid user and amount");
    }

    if (participants.some((p) => p.identifier === identifier)) {
      return Alert.alert("Duplicate", "Participant already exists");
    }

    setParticipants((prev) => [
      ...prev,
      { userId: null, identifier, amountToPay: amount, isNew: true },
    ]);

    setTempUser("");
    setTempAmount("");
  }

  function removeParticipant(index) {
    setParticipants((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!title.trim()) return Alert.alert("Error", "Group title required");
    if (!creatorUPI.trim()) return Alert.alert("Error", "Creator UPI required");
    if (!participants.length)
      return Alert.alert("Error", "Add at least one participant");

    try {
      const payload = {
        title: title.trim(),
        creatorUPI: creatorUPI.trim(),
        participants: participants.map((p) => ({
          userId: p.userId,
          identifier: p.identifier,
          amountToPay: p.amountToPay,
        })),
      };

      const res = await updateGroup(groupId, payload);

      if (res.data?.ok) {
        Alert.alert("Success", "Group updated");
        router.back();
      } else {
        Alert.alert("Error", res.data?.error || "Update failed");
      }
    } catch {
      Alert.alert("Error", "Update failed");
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.loading}>Loading group…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Group</Text>
      </View>

      {/* GROUP INFO */}
      <View style={styles.card}>
        <Text style={styles.label}>Group title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Trip / Dinner / Rent"
        />

        <Text style={styles.label}>Creator UPI</Text>
        <TextInput
          style={styles.input}
          value={creatorUPI}
          onChangeText={setCreatorUPI}
          placeholder="yourupi@bank"
          autoCapitalize="none"
        />
      </View>

      {/* ADD PARTICIPANT */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Add participant</Text>

        <View style={styles.inlineRow}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Email / phone / username"
            value={tempUser}
            onChangeText={setTempUser}
            autoCapitalize="none"
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Amount"
            keyboardType="numeric"
            value={tempAmount}
            onChangeText={setTempAmount}
          />
        </View>

        <TouchableOpacity style={styles.addBtn} onPress={addParticipant}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* PARTICIPANTS */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Participants</Text>

        {participants.map((p, i) => (
          <View key={`${p.identifier}-${i}`} style={styles.participantRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.participantName}>
                {p.identifier} {p.isNew && "• new"}
              </Text>

              <View style={styles.amountRow}>
                <Text style={styles.currency}>{symbol}</Text>
                <TextInput
                  style={styles.amountInput}
                  keyboardType="numeric"
                  value={String(p.amountToPay)}
                  onChangeText={(val) => {
                    const amt = Number(val) || 0;
                    setParticipants((prev) =>
                      prev.map((x, idx) =>
                        idx === i ? { ...x, amountToPay: amt } : x
                      )
                    );
                  }}
                />
              </View>
            </View>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => removeParticipant(i)}
            >
              <Ionicons name="trash-outline" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* SAVE */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  /* ---------- COMMON ---------- */
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loading: {
    fontSize: 16,
    color: "#18493F",
    fontWeight: "600",
  },

  /* ---------- HEADER (MATCHED) ---------- */
  header: {
    paddingTop: 60,              // ⬆ same as second
    paddingBottom: 22,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 30,  // ⬆ same curve
    borderBottomRightRadius: 30,
    elevation: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  headerText: {
    color: "#fff",
    fontSize: 28,                // ⬆ same size
    fontWeight: "800",
  },

  /* ---------- CARD (MATCHED) ---------- */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,                 // ⬆ same padding
    marginHorizontal: 18,        // ⬆ same horizontal rhythm
    marginTop: 14,
    borderRadius: 18,            // ⬆ smoother corners
    borderWidth: 1,
    borderColor: "#DCEFE9",
    elevation: 2,
  },

  /* ---------- TEXT ---------- */
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#18493F",
    marginTop: 12,
  },

  sectionTitle: {
    fontSize: 17,                // ⬆ closer to cardTitle
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 10,
    marginTop: 18,
  },

  /* ---------- INPUTS ---------- */
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    borderRadius: 12,
    padding: 14,                 // ⬆ closer to card padding
    marginTop: 8,
    fontSize: 15,
  },

  inlineRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },

  /* ---------- BUTTONS ---------- */
  addBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 14,
    borderRadius: 14,            // ⬆ match premium buttons
    alignItems: "center",
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    elevation: 3,
  },

  addBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  /* ---------- PARTICIPANTS ---------- */
  participantRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6FBF9",
    borderRadius: 16,
    padding: 16,                 // ⬆ matches cards
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#CDE7E1",
    gap: 12,
  },

  participantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#18493F",
    marginBottom: 6,
  },

  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  currency: {
    fontSize: 16,
    fontWeight: "800",
    color: "#196F63",
  },

  amountInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#CDE7E1",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    fontWeight: "700",
    color: "#196F63",
    backgroundColor: "#fff",
  },

  deleteBtn: {
    padding: 8,
  },

  /* ---------- SAVE BUTTON ---------- */
  saveBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 22,
    elevation: 4,
  },

  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },
});
