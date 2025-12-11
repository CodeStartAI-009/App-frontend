import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";

export default function NotificationBell({ size = 26 }) {
  const router = useRouter();
  const unreadCount = useUserAuthStore((s) => s.user?.unreadCount || s.unreadCount || 0);

  return (
    <TouchableOpacity onPress={() => router.push("/Profile/Notification")}>
      <View style={{ width: size, height: size }}>
        <Ionicons name="notifications-outline" size={size} color="#fff" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {unreadCount > 99 ? "99+" : String(unreadCount)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -6,
    top: -6,
    backgroundColor: "#ff3b30",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
});
