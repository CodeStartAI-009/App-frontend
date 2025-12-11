// app/AI/ChatScreen.js
import React, { useEffect, useState, useRef, useCallback } from "react";
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
import { useRouter, useFocusEffect } from "expo-router";

import {
  getCoins,
  sendChat,
  watchAd,
  claimWeekly,
} from "../../services/aiService";

import {
  loadRewardedInterstitial,
  showRewardAd,
  setRewardCallback,
} from "../../utils/RewardedAd";

export default function ChatScreen() {
  const router = useRouter();

  const [coins, setCoins] = useState(null);
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

  /* ---------------- REFRESH COINS WHEN SCREEN OPENS ---------------- */
  useFocusEffect(
    useCallback(() => {
      loadCoins();
    }, [])
  );

  /* ---------------- LOAD AD ---------------- */
  useEffect(() => {
    loadRewardedInterstitial(setAdLoaded);
  }, []);

  /* ---------------- GLOW ANIMATION ---------------- */
  useEffect(() => {
    if (weeklyAvailable) startGlow();
  }, [weeklyAvailable]);

  function startGlow() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1.15, duration: 500, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 1.0, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }

  /* ---------------- FETCH COINS ---------------- */
  async function loadCoins() {
    try {
      const res = await getCoins();
      setCoins(res.data.coins);

      const last = res.data.lastWeeklyReward ? new Date(res.data.lastWeeklyReward) : null;
      const now = Date.now();
      const diff = last ? now - last.getTime() : 999999999;
      setWeeklyAvailable(diff >= 7 * 24 * 60 * 60 * 1000);

    } catch {
      Alert.alert("Error", "Unable to retrieve coin balance.");
      setCoins(0);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- PUSH MESSAGE ---------------- */
  function pushMessage(role, text) {
    const id = String(nextId.current++);
    return { id, role, text };
  }

  /* ---------------- TYPE-OUT EFFECT ---------------- */
  async function animateAssistantResponse(fullText) {
    const id = String(nextId.current++);
    let displayed = "";

    setMessages((prev) => [...prev, { id, role: "assistant", text: "" }]);

    for (let i = 0; i < fullText.length; i++) {
      displayed += fullText[i];

      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, text: displayed } : msg))
      );

      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  /* ---------------- SEND MESSAGE ---------------- */
  async function onSend() {
    const trimmed = prompt.trim();
    if (!trimmed || sending) return;

    if (coins < 5) {
      setAdModalVisible(true);
      return;
    }

    const userMsg = pushMessage("user", trimmed);
    setMessages((prev) => [...prev, userMsg]);

    setPrompt("");
    Keyboard.dismiss();
    setSending(true);

    try {
      const res = await sendChat({ prompt: trimmed });

      if (res.data.ok) {
        setCoins(res.data.coins);
        await animateAssistantResponse(res.data.reply);
      } else {
        await animateAssistantResponse("Something went wrong.");
      }
    } catch {
      await animateAssistantResponse("Server error. Try again.");
    }

    setSending(false);
  }

  /* ---------------- WEEKLY BONUS ---------------- */
  async function onTapCoins() {
    if (!weeklyAvailable) return;

    const res = await claimWeekly();
    if (res.data.ok) {
      setCoins(res.data.coins);
      setWeeklyAvailable(false);
      Alert.alert("Weekly Bonus", "+10 coins added!");
    }
  }

  /* ---------------- WATCH AD ---------------- */
  async function onWatchAd() {
    setAdModalVisible(false);

    if (!adLoaded) {
      Alert.alert("Please wait…", "Ad is still loading.");
      loadRewardedInterstitial(setAdLoaded);
      return;
    }

    setRewardCallback(async () => {
      const res = await watchAd();
      if (res.data.ok) {
        setCoins(res.data.coins);
      }
      loadRewardedInterstitial(setAdLoaded);
    });

    const ok = showRewardAd();
    if (!ok) {
      Alert.alert("Loading…", "Ad is not ready yet.");
    }
  }

  /* ---------------- LOADING SCREEN ---------------- */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );

  /* ---------------- UI ---------------- */
  return (
    <>
      {/* ---------- AD MODAL ---------- */}
      {adModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Not Enough Coins</Text>
            <Text style={styles.modalText}>
              You need 5 coins to chat.{"\n"}Watch an ad to earn +10 coins.
            </Text>

            <TouchableOpacity style={styles.modalBtn} onPress={onWatchAd}>
              <Text style={styles.modalBtnText}>Watch Ad</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setAdModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={90}
      >

        {/* ---------- HEADER ---------- */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (router.canGoBack()) router.back();
              else router.replace("/Home/Home");
            }}
          >
            <Ionicons name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Assistant</Text>

          <Animated.View style={{ transform: [{ scale: glowAnim }] }}>
            <TouchableOpacity onPress={onTapCoins}>
              <Text style={styles.coinBox}>💰 {coins}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* ---------- CHAT LIST ---------- */}
        <FlatList
          ref={listRef}
          data={messages}
          contentContainerStyle={styles.chatList}
          keyExtractor={(item) => item.id}
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

        {/* ---------- INPUT BAR ---------- */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            value={prompt}
            onChangeText={setPrompt}
            editable={!sending}
          />

          <TouchableOpacity
            style={[styles.sendBtn, (!prompt.trim() || sending) && { opacity: 0.4 }]}
            disabled={!prompt.trim() || sending}
            onPress={onSend}
          >
            {sending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

/* ---------------------- STYLES ---------------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#F6FBF9" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#196F63",
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    elevation: 6,
    gap: 12,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    marginLeft: -20,
  },

  coinBox: {
    backgroundColor: "#145A52",
    color: "#fff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontWeight: "800",
    borderWidth: 1,
    borderColor: "#CDE7E1",
  },

  chatList: {
    padding: 16,
    paddingBottom: 130,
  },

  msgBubble: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#CDE7E1",
  },

  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#CDE7E1",
    maxWidth: "85%",
  },

  aiBubble: {
    alignSelf: "stretch",
    backgroundColor: "#FFFFFF",
    maxWidth: "100%",
  },

  msgText: {
    fontSize: 16,
    lineHeight: 22,
    color: "#18493F",
    fontWeight: "600",
  },

  inputBar: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#CDE7E1",
    backgroundColor: "#F6FBF9",
    paddingBottom: 50,
  },

  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CDE7E1",
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    marginRight: 10,
    color: "#18493F",
  },

  sendBtn: {
    backgroundColor: "#196F63",
    borderRadius: 12,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  modalBox: {
    width: "75%",
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#CDE7E1",
    elevation: 6,
    alignItems: "center",
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#18493F",
    marginBottom: 8,
  },

  modalText: {
    fontSize: 15,
    color: "#18493F",
    textAlign: "center",
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: "#196F63",
    paddingVertical: 12,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },

  modalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  modalCancelText: {
    color: "#196F63",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
