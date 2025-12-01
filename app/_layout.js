import { Stack } from "expo-router";
import { useEffect } from "react";
import { useUserAuthStore } from "../store/useAuthStore";

export default function RootLayout() {
  const restoreSession = useUserAuthStore((s) => s.restoreSession);
  const hydrated = useUserAuthStore((s) => s.hydrated);

  useEffect(() => {
    restoreSession();
  }, []);

  if (!hydrated) {
    console.log("⏳ Waiting for auth hydration...");
    return null; // or splash screen
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
