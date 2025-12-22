import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";

import { useUserAuthStore } from "../store/useAuthStore";
import { socket } from "../utils/socket";

import {
  registerForPushNotificationsAsync,
  saveTokenToServer,
  showLocalNotification,
} from "../utils/pushNotifications";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const restoreSession = useUserAuthStore((s) => s.restoreSession);
  const hydrated = useUserAuthStore((s) => s.hydrated);
  const user = useUserAuthStore((s) => s.user);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    restoreSession();
    setReady(true);
    SplashScreen.hideAsync();
  }, []);

  /* 🔔 PUSH TOKEN */
  useEffect(() => {
    if (!hydrated || !user) return;

    (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) await saveTokenToServer(token);
    })();
  }, [hydrated, user?._id]);

  /* 🔔 SOCKET → SYSTEM NOTIFICATION */
  useEffect(() => {
    if (!hydrated || !user) return;

    socket.connect();
    socket.emit("register", user._id);

    socket.on("notification", async (data) => {
      await showLocalNotification(data.title, data.message);
    });

    return () => {
      socket.off("notification");
      socket.disconnect();
    };
  }, [hydrated, user?._id]);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
