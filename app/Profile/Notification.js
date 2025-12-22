// app/screens/NotificationScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import api from "../../services/api";
import { socket } from "../../utils/socket";
import { useUserAuthStore } from "../../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function NotificationScreen() {
  const router = useRouter();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const setUser = useUserAuthStore((s) => s.setUser);

  /* --------------------------------------------------
     LOAD + CLEAR UNREAD COUNT ON OPEN
  -------------------------------------------------- */
  useEffect(() => {
    load();

    // Clear unread count immediately when screen opens
    setUser((u) => (u ? { ...u, unreadCount: 0 } : u));

    socket.on("notification", (payload) => {
      setList((prev) => [payload, ...prev]);

      setUser((u) =>
        u ? { ...u, unreadCount: (u.unreadCount || 0) + 1 } : u
      );
    });

    return () => socket.off("notification");
  }, []);

  /* --------------------------------------------------
     LOAD NOTIFICATIONS
  -------------------------------------------------- */
  async function load() {
    try {
      const res = await api.get("/notifications");
      setList(res.data.notifications || []);
    } catch (err) {
      console.warn(
        "Failed to load notifications",
        err?.response?.data || err
      );
    } finally {
      setLoading(false);
    }
  }

  /* --------------------------------------------------
     MARK ALL READ
  -------------------------------------------------- */
  async function markAllRead() {
    try {
      await api.post("/notifications/mark-read");

      setList((l) => l.map((n) => ({ ...n, isRead: true })));

      setUser((u) => (u ? { ...u, unreadCount: 0 } : u));
    } catch (err) {
      console.warn("Failed to mark read", err);
    }
  }

  /* --------------------------------------------------
     LOADING
  -------------------------------------------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */
  return (
    <View style={styles.page}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() =>
            router.canGoBack() ? router.back() : router.replace("/Home/Home")
          }
        >
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        {list.some((n) => !n.isRead) ? (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markRead}>Mark all</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        {list.length === 0 && (
          <View style={styles.empty}>
            <Ionicons
              name="notifications-off-outline"
              size={48}
              color="#9CA3AF"
            />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptyText}>
              You’re all caught up. We’ll notify you when something happens.
            </Text>
          </View>
        )}

        {list.map((n) => (
          <View
            key={n._id}
            style={[
              styles.card,
              n.isRead ? styles.readCard : styles.unreadCard,
            ]}
          >
            {!n.isRead && <View style={styles.unreadDot} />}

            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{n.title}</Text>
              <Text style={styles.msg}>{n.message}</Text>
              <Text style={styles.time}>
                {new Date(n.createdAt).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F7FBFA" },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    elevation: 4,
  },

  backBtn: {
    backgroundColor: "rgba(255,255,255,0.25)",
    padding: 8,
    borderRadius: 10,
    marginRight: 12,
  },

  headerTitle: {
    flex: 1,
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
  },

  markRead: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E0F2F1",
  },

  content: {
    padding: 20,
    paddingTop: 14,
  },

  empty: {
    marginTop: 90,
    alignItems: "center",
    paddingHorizontal: 24,
  },

  emptyTitle: {
    marginTop: 14,
    fontSize: 18,
    fontWeight: "800",
    color: "#334155",
  },

  emptyText: {
    marginTop: 8,
    fontSize: 14,
    textAlign: "center",
    color: "#6B7280",
    lineHeight: 20,
  },

  card: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
  },

  unreadCard: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7E3D0",
  },

  readCard: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E5E7EB",
  },

  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#196F63",
    marginRight: 12,
    marginTop: 6,
  },

  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F3F36",
  },

  msg: {
    marginTop: 6,
    fontSize: 14,
    color: "#334155",
    lineHeight: 21,
  },

  time: {
    marginTop: 10,
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
});
