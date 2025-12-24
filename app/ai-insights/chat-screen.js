import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Animated,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";

import { getCoins, sendChat, watchAd } from "../../services/aiService";
import { trackEvent } from "../../utils/analytics";

import {
  loadRewardedInterstitial,
  showRewardAd,
  setRewardCallback,
} from "../../utils/RewardedAd";

/* =====================================================
   🔧 MARKDOWN → NORMAL TEXT CONVERTER
===================================================== */
function normalizeAIText(text = "") {
  return text
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```/g, "").trim())
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/^\s*[-*+]\s+/gm, "• ")
    .replace(/^\s*\d+\.\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export default function ChatScreen() {
  const router = useRouter();

  const [coins, setCoins] = useState(0);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [sending, setSending] = useState(false);

  const [weeklyAvailable, setWeeklyAvailable] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adModalVisible, setAdModalVisible] = useState(false);

  const listRef = useRef(null);
  const nextId = useRef(0);
  const glowAnim = useRef(new Animated.Value(1)).current;
  const viewedRef = useRef(false);

  /* ---------------- SCREEN VIEW ---------------- */
  useFocusEffect(
    useCallback(() => {
      if (!viewedRef.current) {
        trackEvent("ai_chat_screen_viewed");
        viewedRef.current = true;
      }
      loadCoins();
    }, [])
  );

  /* ---------------- ADS SETUP ---------------- */
  useEffect(() => {
    setRewardCallback(() => {
      trackEvent("ai_ad_watched_for_coins");
      watchAd().finally(loadCoins);
    });

    requestAnimationFrame(() => {
      loadRewardedInterstitial(setAdLoaded);
    });
  }, []);

  /* ---------------- GLOW EFFECT ---------------- */
  useEffect(() => {
    if (!weeklyAvailable) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [weeklyAvailable]);

  async function loadCoins() {
    try {
      const res = await getCoins();
      setCoins(res?.data?.coins || 0);

      const last = res?.data?.lastWeeklyReward
        ? new Date(res.data.lastWeeklyReward)
        : null;

      const diff = last ? Date.now() - last.getTime() : Infinity;
      setWeeklyAvailable(diff >= 7 * 24 * 60 * 60 * 1000);
    } catch {
      setCoins(0);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- TYPEWRITER ---------------- */
  const animateAssistantResponse = useCallback(async (text) => {
    const id = String(nextId.current++);
    setMessages((prev) => [...prev, { id, role: "assistant", text: "" }]);

    let current = "";

    for (let i = 0; i < text.length; i++) {
      current += text[i];

      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, text: current } : m))
      );

      if (i % 3 === 0) {
        await new Promise((r) => setTimeout(r, 8));
      }
    }
  }, []);

  /* ---------------- SEND MESSAGE ---------------- */
  async function onSend() {
    const text = prompt.trim();
    if (!text || sending) return;

    if (coins < 5) {
      trackEvent("ai_chat_blocked_no_coins");
      setAdModalVisible(true);
      return;
    }

    setPrompt("");
    Keyboard.dismiss();
    setSending(true);

    setMessages((prev) => [
      ...prev,
      { id: String(nextId.current++), role: "user", text },
    ]);

    trackEvent("ai_chat_used", { length: text.length });

    try {
      const res = await sendChat({ prompt: text });
      setCoins(res?.data?.coins ?? coins);

      const cleanText = normalizeAIText(
        res?.data?.reply || "No response available."
      );

      await animateAssistantResponse(cleanText);
    } catch {
      await animateAssistantResponse("Server error. Please try again.");
    }

    setSending(false);
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  return (
    <>
      {/* AD MODAL */}
      {adModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Not Enough Coins</Text>
            <Text style={styles.modalText}>
              You need 5 coins to chat. Watch an ad to earn more.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setAdModalVisible(false);
                adLoaded && showRewardAd();
              }}
              disabled={!adLoaded}
            >
              <Text style={styles.modalBtnText}>
                {adLoaded ? "Watch Ad" : "Loading Ad…"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAdModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Assistant</Text>

          <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
            <Text style={styles.coinBox}>💰 {coins}</Text>
          </Animated.View>
        </View>

        {/* CHAT */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatList}
          renderItem={({ item }) => (
            <View
              style={[
                styles.bubble,
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

        {/* INPUT */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            multiline
            value={prompt}
            onChangeText={setPrompt}
            editable={!sending}
          />
          <TouchableOpacity
            style={styles.sendBtn}
            onPress={onSend}
            disabled={sending}
          >
            <Ionicons name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 60,
    paddingBottom: 18,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  coinBox: {
    color: "#E8FFFA",
    fontWeight: "800",
    fontSize: 15,
  },

  chatList: {
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 10,
  },

  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 18,
    marginBottom: 14,
    maxWidth: "88%",
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#196F63",
    borderTopRightRadius: 6,
  },

  aiBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DCEFEA",
    borderTopLeftRadius: 6,
  },

  msgText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#1F2937",
  },

  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#F9FAFB",
  },

  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CFE8E2",
    padding: 14,
    borderRadius: 16,
    fontSize: 16,
    marginRight: 10,
    maxHeight: 120,
  },

  sendBtn: {
    backgroundColor: "#196F63",
    borderRadius: 16,
    paddingHorizontal: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  modalBox: {
    width: "78%",
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 6,
    color: "#18493F",
  },

  modalText: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
    color: "#374151",
  },

  modalBtn: {
    backgroundColor: "#196F63",
    padding: 12,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
  },

  modalBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  modalCancelText: {
    marginTop: 12,
    color: "#196F63",
    fontWeight: "600",
  },
});
