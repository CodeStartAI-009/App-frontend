import "expo-dev-client";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUserAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";

export default function RootLayout() {
  const restoreSession = useUserAuthStore((s) => s.restoreSession);
  const hydrated = useUserAuthStore((s) => s.hydrated);
  const user = useUserAuthStore((s) => s.user);

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (!hydrated || !user) return;

    if (!socket.connected) socket.connect();

    if (!socket.hasRegistered) {
      socket.emit("register", user._id);
      socket.hasRegistered = true;
    }

    const handleNotification = (data) => {
      alert(`${data.title}\n${data.message}`);
    };

    socket.on("notification", handleNotification);

    return () => socket.off("notification", handleNotification);
  }, [hydrated, user?._id]);

  if (!hydrated) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {!user ? (
        // AUTH FLOW STACK GROUP (Splash, Onboarding, Login)
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Authentication/Splash" />
          <Stack.Screen name="Authentication/Onboarding1" />
          <Stack.Screen name="Authentication/Login" />
        </Stack>
      ) : (
        // APP FLOW STACK GROUP (Home + others)
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home/Home" />
        </Stack>
      )}
    </GestureHandlerRootView>
  );
}
