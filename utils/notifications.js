import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// REQUIRED for badges + alerts
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldSetBadge: true,
    shouldPlaySound: true,
  }),
});

export async function registerForPushNotifications() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Permission NOT granted for notifications");
      return null;
    }

    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("📱 Push Token:", token);
  } else {
    alert("Push notifications need a physical device!");
  }

  // Android channel
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return token;
}
