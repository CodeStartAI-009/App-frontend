import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUserAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";

export default function RootLayout() {
  const restoreSession = useUserAuthStore((s) => s.restoreSession);
  const hydrated = useUserAuthStore((s) => s.hydrated);

  useEffect(() => {
    restoreSession();
  }, []);

  // 🔔 Listen for server notifications
  useEffect(() => {
    socket.on("notification", (data) => {
      alert(`🔔 ${data.title}\n${data.message}`);
    });

    return () => {
      socket.off("notification");
    };
  }, []);

  if (!hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
