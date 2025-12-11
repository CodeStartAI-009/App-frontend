// app/Splash.js
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";

export default function Splash() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  const hydrated = useUserAuthStore((s) => s.hydrated);
  const user = useUserAuthStore((s) => s.user);

  useEffect(() => {
    // Fade animation
    Animated.timing(fade, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    // Wait until restoreSession finishes
    if (!hydrated) return;

    const t = setTimeout(() => {
      if (user) {
        // USER ALREADY LOGGED IN → GO HOME
        router.replace("/Home/Home");
      } else {
        // FIRST TIME USER OR LOGGED OUT → GO TO ONBOARDING
        router.replace("/Authentication/Onboarding1");
      }
    }, 1500); // splash delay

    return () => clearTimeout(t);
  }, [hydrated, user]);

  return (
    <View style={s.container}>
      <Animated.Text style={[s.logo, { opacity: fade }]}>
        UniSpend
      </Animated.Text>
      <Text style={s.tag}>Smart money for smart Future.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4c6ef5",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "700",
  },
  tag: {
    color: "#eaf0ff",
    position: "absolute",
    bottom: 80,
    fontSize: 14,
  },
});
