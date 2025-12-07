// app/AI/ChatScreen.js  (UI Improved - Functionality Unchanged)
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getCoins, sendChat, watchAd, claimWeekly } from "../../services/aiService";
import BottomNav from "../components/BottomNav";

export default function ChatScreen() {
  const router = useRouter();

  const [coins, setCoins] = useState(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [sending, setSending] = useState(false);
  const [weeklyAvailable, setWeeklyAvailable] = useState(false);

  const listRef = useRef(null);
  const nextId = useRef(0);
  const glowAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadCoins();
  }, []);

  useEffect(() => {
    if (weeklyAvailable) startGlow();
    else glowAnim.setValue(1);
  }, [weeklyAvailable]);

  function startGlow() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1.0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }

  async function loadCoins() {
    try {
      const res = await getCoins();

      if (res?.data?.ok) {
        setCoins(res.data.coins);

        const last = res.data.lastWeeklyReward
          ? new Date(res.data.lastWeeklyReward)
          : null;

        const now = Date.now();
        const oneWeek = 7 * 24 * 60 * 60 * 1000;

        setWeeklyAvailable(!last || now - last.getTime() >= oneWeek);
      } else {
        setCoins(0);
      }
    } catch {
      Alert.alert("Error", "Could not load coin balance.");
      setCoins(0);
    } finally {
      setLoading(false);
    }
  }

  function pushMessage(role, text) {
    const id = String(nextId.current++);
    setMessages((prev) => [...prev, { id, role, text }]);
  }

  async function onSend() {
    const trimmed = prompt.trim();
    if (!trimmed || sending) return;

    if (coins < 5) {
      return Alert.alert("Not Enough Coins", "Watch an ad to continue chatting.", [
        { text: "Watch Ad", onPress: onWatchAd },
      ]);
    }

    pushMessage("user", trimmed);
    setPrompt("");
    Keyboard.dismiss();
    setSending(true);

    try {
      const res = await sendChat({ prompt: trimmed });

      if (res?.data?.ok) {
        pushMessage("assistant", res.data.reply);
        setCoins(res.data.coins);
      } else {
        pushMessage("assistant", res?.data?.error || "Chat failed.");
      }
    } catch {
      pushMessage("assistant", "Server error. Try again.");
    } finally {
      setSending(false);
    }
  }

  async function onTapCoins() {
    if (!weeklyAvailable) return;

    try {
      const res = await claimWeekly();
      if (res?.data?.ok) {
        setCoins(res.data.coins);
        setWeeklyAvailable(false);
        Alert.alert("Weekly Bonus Claimed!", "+15 coins added 🎉");
      }
    } catch {
      Alert.alert("Error", "Unable to claim bonus.");
    }
  }

  async function onWatchAd() {
    try {
      const res = await watchAd();
      if (res?.data?.ok) {
        setCoins(res.data.coins);
        Alert.alert("Thanks!", "+10 coins added.");
      }
    } catch {
      Alert.alert("Error", "Could not watch ad.");
    }
  }

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={26} color="#4c6ef5" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Assistant</Text>

          <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
            <TouchableOpacity onPress={onTapCoins}>
              <Text style={[styles.coins, weeklyAvailable && styles.glowCoin]}>
                💰 {coins}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* CHAT LIST */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.msgBubble,
                item.role === "user" ? styles.userBubble : styles.aiBubble,
              ]}
            >
              <Text style={styles.msgText}>{item.text}</Text>
            </View>
          )}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
        />

        {/* INPUT BAR */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={
              coins < 5 ? "Not enough coins…" : "Type a message…"
            }
            value={prompt}
            onChangeText={setPrompt}
            editable={!sending && coins >= 5}
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              (!prompt.trim() || sending) && { opacity: 0.5 },
            ]}
            disabled={!prompt.trim() || sending}
            onPress={onSend}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.sendBtnText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <BottomNav active="home" />
    </>
  );
}

/* ------------------------------------------
   UPDATED UI STYLES (MATCH YOUR STYLE SYSTEM)
------------------------------------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  /* HEADER */
  header: {
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },

  backBtn: { paddingRight: 12 },

  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#1e293b",
    marginLeft: -20, // keeps visual center alignment
  },

  coins: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#4c6ef5",
    color: "#fff",
  },

  glowCoin: {
    backgroundColor: "#27d67f",
    shadowColor: "#27d67f",
    shadowOpacity: 0.8,
    shadowRadius: 12,
  },

  /* CHAT */
  chatList: {
    padding: 16,
    paddingBottom: 130,
  },

  msgBubble: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    maxWidth: "80%",
  },

  userBubble: {
    backgroundColor: "#dbeafe",
    alignSelf: "flex-end",
  },

  aiBubble: {
    backgroundColor: "#f3f4f6",
    alignSelf: "flex-start",
  },

  msgText: {
    fontSize: 15,
    color: "#1e293b",
    lineHeight: 20,
  },

  /* INPUT BAR */
  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
    paddingBottom: 90,
  },

  input: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 12,
    borderRadius: 12,
    borderColor: "#e5e7eb",
    borderWidth: 1,
    marginRight: 10,
  },

  sendBtn: {
    backgroundColor: "#4c6ef5",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
  },

  sendBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
