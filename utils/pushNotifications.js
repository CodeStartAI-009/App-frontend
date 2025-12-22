import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import api from "../services/api";

/* 🔔 FOREGROUND HANDLER */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/* 🔔 REGISTER */
export async function registerForPushNotificationsAsync() {
  if (!Device.isDevice) {
    console.warn("Push notifications require physical device");
    return null;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push permission denied");
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return token;
}

/* 🔔 SAVE TOKEN */
export async function saveTokenToServer(token) {
  if (!token) return;
  await api.post("/notifications/save-token", { token });
}

/* 🔔 SHOW LOCAL NOTIFICATION (IMPORTANT) */
export async function showLocalNotification(title, body) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: "default",
    },
    trigger: null, // immediate
  });
}
