import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useUserAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const restoreSession = useUserAuthStore((s) => s.restoreSession);
  const hydrated = useUserAuthStore((s) => s.hydrated);

  useEffect(() => {
    restoreSession();
  }, []);

  if (!hydrated) {
    console.log("⏳ Waiting for auth hydration...");
    return null; // Or show splash screen
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
