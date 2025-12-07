import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import api from "../../services/api";

export default function NotificationScreen() {
  const [list, setList] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await api.get("/notifications");
    setList(res.data.notifications);

    await api.post("/notifications/mark-read");
  }

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Notifications</Text>

      {list.map((n) => (
        <View
          key={n._id}
          style={{
            padding: 10,
            marginTop: 10,
            backgroundColor: n.isRead ? "#ddd" : "#aaf",
            borderRadius: 8,
          }}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>{n.title}</Text>
          <Text>{n.message}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
