// app/screens/NotificationScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import api from "../../services/api";
import { socket } from "../../utils/socket";
import { useUserAuthStore } from "../../store/useAuthStore";

export default function NotificationScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const setUser = useUserAuthStore((s) => s.setUser); // if you have setter to update unread count

  useEffect(() => {
    load();

    // Listen to socket notifications
    socket.on("notification", (payload) => {
      // Prepend
      setList((prev) => [payload, ...prev]);
      // increment store unread if you manage it there
      setUser((u) => ({ ...u, unreadCount: (u.unreadCount || 0) + 1 }));
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  async function load() {
    try {
      setLoading(true);
      const res = await api.get("/notifications");
      setList(res.data.notifications || []);
    } catch (err) {
      console.warn("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  }

  async function markAllRead() {
    try {
      await api.post("/notifications/mark-read");
      // update UI
      setList((l) => l.map((n) => ({ ...n, isRead: true })));
      // update store unread count
      setUser((u) => ({ ...u, unreadCount: 0 }));
    } catch (err) {
      console.warn("Failed to mark read", err);
    }
  }

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;

  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "800" }}>Notifications</Text>
        <TouchableOpacity onPress={markAllRead}>
          <Text style={{ color: "#196F63", fontWeight: "700" }}>Mark all read</Text>
        </TouchableOpacity>
      </View>

      {list.map((n) => (
        <View key={n._id || n.id || `${Math.random()}`} style={[styles.item, n.isRead ? styles.read : styles.unread]}>
          <Text style={styles.title}>{n.title}</Text>
          <Text style={styles.msg}>{n.message}</Text>
          <Text style={styles.time}>{new Date(n.createdAt).toLocaleString()}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
  },
  unread: {
    backgroundColor: "#E8FBF3",
  },
  read: {
    backgroundColor: "#F3F4F6",
  },
  title: { fontWeight: "800", fontSize: 15 },
  msg: { marginTop: 6, color: "#333" },
  time: { marginTop: 8, fontSize: 12, color: "#666" },
});
