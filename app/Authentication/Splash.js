// app/Authentication/Splash.js
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { useUserAuthStore } from "../../store/useAuthStore";

export default function Splash() {
  const router = useRouter();
  const fade = useRef(new Animated.Value(0)).current;

  const hydrated = useUserAuthStore((s) => s.hydrated);
  const user = useUserAuthStore((s) => s.user);

  /* Fade animation */
  useEffect(() => {
    Animated.timing(fade, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  /* Navigate as soon as state is known */
  useEffect(() => {
    if (!hydrated) return;

    if (user) {
      router.replace("/Home/Home");
    } else {
      router.replace("/Authentication/Onboarding1");
    }
  }, [hydrated, user]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.logo, { opacity: fade }]}>
        UniSpend
      </Animated.Text>
      <Text style={styles.tag}>Smart money for smart future.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
