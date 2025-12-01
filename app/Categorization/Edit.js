import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Splash() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>edit Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  text: { fontSize: 30, fontWeight: "bold" }
});
