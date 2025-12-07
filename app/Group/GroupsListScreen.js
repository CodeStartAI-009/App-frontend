// app/Group/GroupListScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import Swipeable from "react-native-gesture-handler/Swipeable";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BottomNav from "../components/BottomNav";

import {
  getMyCreatedGroups,
  getMyParticipantGroups,
  markGroupComplete,
} from "../../services/splitService";

export default function GroupListScreen() {
  const router = useRouter();

  const [created, setCreated] = useState([]);
  const [participating, setParticipating] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("created");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const c = await getMyCreatedGroups();
      const p = await getMyParticipantGroups();
      setCreated(c.data.groups || []);
      setParticipating(p.data.groups || []);
    } catch (err) {
      Alert.alert("Error", "Failed to load groups");
    } finally {
      setLoading(false);
    }
  }

  async function completeGroup(groupId) {
    Alert.alert("Complete Group?", "This marks the entire group as completed.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes",
        onPress: async () => {
          try {
            const res = await markGroupComplete(groupId);
            if (res.data.ok) {
              Alert.alert("Success", "Group marked as completed");
              loadData();
            }
          } catch {
            Alert.alert("Error", "Failed to complete group");
          }
        },
      },
    ]);
  }

  const RightActions = ({ id }) => (
    <TouchableOpacity onPress={() => completeGroup(id)} style={styles.swipeComplete}>
      <Ionicons name="checkmark-done-outline" size={26} color="#fff" />
      <Text style={styles.swipeText}>Complete</Text>
    </TouchableOpacity>
  );

  const LeftActions = ({ id }) => (
    <TouchableOpacity
      onPress={() => router.push(`/Group/EditGroupScreen?groupId=${id}`)}
      style={styles.swipeEdit}
    >
      <Ionicons name="create-outline" size={26} color="#fff" />
      <Text style={styles.swipeText}>Edit</Text>
    </TouchableOpacity>
  );

  function renderOwnerItem({ item }) {
    const card = (
      <TouchableOpacity
        onPress={() => router.push(`/Group/GroupDetailsScreen?groupId=${item._id}`)}
        style={styles.card}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={styles.cardIcon}>
            <Ionicons name="people-outline" size={22} color="#196F63" />
          </View>

          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={item.isCompleted ? styles.completed : styles.pending}>
              {item.isCompleted ? "Completed" : "Active"}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
      </TouchableOpacity>
    );

    if (item.isCompleted) return card;

    return (
      <Swipeable
        renderLeftActions={() => <LeftActions id={item._id} />}
        renderRightActions={() => <RightActions id={item._id} />}
      >
        {card}
      </Swipeable>
    );
  }

  function renderMemberItem({ item }) {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/Group/GroupDetailsScreen?groupId=${item._id}`)}
        style={styles.card}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View style={styles.cardIcon}>
            <Ionicons name="person-outline" size={22} color="#196F63" />
          </View>

          <View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={item.isCompleted ? styles.completed : styles.pending}>
              {item.isCompleted ? "Completed" : "Active"}
            </Text>
          </View>
        </View>

        <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  const activeList = activeTab === "created" ? created : participating;

  return (
    <View style={{ flex: 1, backgroundColor: "#F6FBF9" }}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Split Groups</Text>
      </View>

      {/* TABS */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "created" && styles.activeTab]}
          onPress={() => setActiveTab("created")}
        >
          <Text style={[styles.tabText, activeTab === "created" && styles.activeTabText]}>
            Created
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, activeTab === "member" && styles.activeTab]}
          onPress={() => setActiveTab("member")}
        >
          <Text style={[styles.tabText, activeTab === "member" && styles.activeTabText]}>
            Member
          </Text>
        </TouchableOpacity>
      </View>

      {/* LIST */}
      <FlatList
        data={activeList}
        renderItem={activeTab === "created" ? renderOwnerItem : renderMemberItem}
        keyExtractor={(item) => item._id}
        ListEmptyComponent={
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <Ionicons name="layers-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyText}>No groups available.</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/Group/CreateGroupScreen")}
      >
        <Ionicons name="add" size={30} color="#fff" />
      </TouchableOpacity>

      <BottomNav active="tx" />
    </View>
  );
}

/* -------------------------- UI STYLES -------------------------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 60,
    paddingBottom: 22,
    backgroundColor: "#196F63",
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 6,
  },
  headerText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },

  /* SEGMENTED CONTROL */
  tabRow: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#E2F4EE",
    borderRadius: 14,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },
  tabText: {
    color: "#18493F",
    fontWeight: "700",
  },
  activeTab: {
    backgroundColor: "#196F63",
    elevation: 3,
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "800",
  },

  /* CARD */
  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    marginHorizontal: 18,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCEFE9",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },

  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#DFF5EE",
    justifyContent: "center",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#18493F",
  },

  completed: { color: "#2ECC71", fontWeight: "700", marginTop: 3 },
  pending: { color: "#6B7280", fontWeight: "600", marginTop: 3 },

  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: "#6B7280",
  },

  /* SWIPE BUTTONS */
  swipeComplete: {
    backgroundColor: "#16A34A",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 14,
  },
  swipeEdit: {
    backgroundColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 14,
  },
  swipeText: {
    color: "#fff",
    fontWeight: "700",
    marginTop: 4,
  },

  /* FLOAT BUTTON */
  fab: {
    position: "absolute",
    bottom: 90,
    right: 25,
    width: 62,
    height: 62,
    backgroundColor: "#196F63",
    borderRadius: 31,
    justifyContent: "center",
    alignItems: "center",
    elevation: 7,
  },
});
