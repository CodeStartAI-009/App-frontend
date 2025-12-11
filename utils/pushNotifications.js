// app/utils/pushNotifications.js
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import api from "../services/api";

// Configure how notifications are shown when app is foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  try {
    if (!Device.isDevice) {
      console.warn("Must use physical device for Push Notifications");
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Push notifications permission denied");
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData?.data;
    console.log("Expo push token:", token);

    // Android: create channel (important)
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    return token;
  } catch (err) {
    console.error("registerForPushNotifications error:", err);
    return null;
  }
}

/**
 * Save expo token to backend for logged-in user.
 * `api` must attach auth header (you already have that).
 */
export async function saveTokenToServer(token) {
  if (!token) return;
  try {
    await api.post("/notifications/save-token", { token });
  } catch (err) {
    console.warn("Failed to save token to server:", err?.response?.data || err);
  }
}
