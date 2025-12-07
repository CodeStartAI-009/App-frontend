// app/Splash.js
import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";

export default function Splash() {
  const router = useRouter();
  const fade = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 700, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      router.replace("Authentication/Onboarding1"); // goes to onboarding first
      // or router.replace("/Login") if you want skip onboarding
    }, 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={s.container}>
      <Animated.Text style={[s.logo, { opacity: fade }]}>UniSpend</Animated.Text>
      <Text style={s.tag}>Smart money for smart Future.</Text>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#4c6ef5", justifyContent: "center", alignItems: "center" },
  logo: { fontSize: 40, color: "#fff", fontWeight: "700" },
  tag: { color: "#eaf0ff", position: "absolute", bottom: 80, fontSize: 14 }
});
