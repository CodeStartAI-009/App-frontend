import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getGroupDetails } from "../../services/splitService";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function GroupDetailsScreen() {
  const { groupId } = useLocalSearchParams();
  const router = useRouter();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await getGroupDetails(groupId);

      if (!res.data.ok) {
        Alert.alert("Error", res.data.error || "Failed to load group");
        return;
      }

      setGroup(res.data.group);
    } catch (err) {
      Alert.alert("Error", "Server unreachable");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  if (!group) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#444" }}>No group found</Text>
      </View>
    );
  }

  const total = group.participants.reduce((sum, p) => sum + p.amountToPay, 0);

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>
      {/* HEADER */}
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={26}
          color="#fff"
          onPress={() => router.back()}
        />
        <Text style={styles.headerText}>Group Details</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        
        {/* GROUP TITLE CARD */}
        <View style={styles.groupCard}>
          <Text style={styles.title}>{group.title}</Text>

          {group.isCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color="#1A8F5A" />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}

          <View style={styles.row}>
            <Text style={styles.label}>Creator UPI</Text>
            <Text style={styles.value}>{group.creatorUPI}</Text>
          </View>
        </View>

        {/* PARTICIPANTS */}
        <Text style={styles.sectionTitle}>Participants</Text>

        {group.participants.map((p) => (
          <View key={p.userId._id} style={styles.participantBox}>

            {/* Avatar */}
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {p.userId.name ? p.userId.name[0] : p.userId.email[0]}
              </Text>
            </View>

            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.participantName}>
                {p.userId.name || p.userId.email}
              </Text>
              <Text style={styles.participantSub}>
                {p.userId.email || p.userId.phone}
              </Text>
            </View>

            <Text style={styles.amount}>₹{p.amountToPay}</Text>
          </View>
        ))}

        {/* TOTAL CARD */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total to Receive</Text>
          <Text style={styles.totalValue}>₹{total}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* -------------------------- STYLES -------------------------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* HEADER */
  header: {
    paddingTop: 60,
    paddingBottom: 26,
    backgroundColor: "#196F63",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    elevation: 6,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "800",
  },

  /* GROUP CARD */
  groupCard: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D7EEE6",
    elevation: 2,
    marginBottom: 22,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#18493F",
  },

  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    backgroundColor: "#E8FFF3",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  completedText: {
    color: "#15803D",
    fontWeight: "700",
  },

  /* SECTION TITLE */
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 12,
    marginTop: 10,
  },

  /* LABEL ROW */
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#355D52",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#18493F",
  },

  /* PARTICIPANT CARD */
  participantBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#DDEFE9",
    flexDirection: "row",
    alignItems: "center",
    elevation: 1,
  },

  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#D9F5EE",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#196F63",
  },

  participantName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  participantSub: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
  },
  amount: {
    fontSize: 17,
    fontWeight: "800",
    color: "#196F63",
  },

  /* TOTAL CARD */
  totalCard: {
    backgroundColor: "#EFFFFA",
    padding: 24,
    marginTop: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#C8EFE4",
    alignItems: "center",
    elevation: 3,
  },
  totalLabel: {
    fontSize: 16,
    color: "#18493F",
    fontWeight: "700",
  },
  totalValue: {
    fontSize: 30,
    color: "#196F63",
    fontWeight: "900",
    marginTop: 6,
  },
});
