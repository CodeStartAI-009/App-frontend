// app/AI/ChatScreen.js

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

import {
  getCoins,
  sendChat,
  watchAd,
  claimWeekly,
} from "../../services/aiService";

import BottomNav from "../components/BottomNav";

// ⭐ Corrected Rewarded Interstitial imports
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

  /* -----------------------------------
    Load coins on mount
  ----------------------------------- */
  useEffect(() => {
    loadCoins();
  }, []);

  /* -----------------------------------
    Load Rewarded Interstitial Ad ONCE
  ----------------------------------- */
  useEffect(() => {
    loadRewardedInterstitial(setAdLoaded);
  }, []);

  /* -----------------------------------
    Weekly Glow Animation
  ----------------------------------- */
  useEffect(() => {
    if (weeklyAvailable) startGlow();
    else glowAnim.setValue(1);
  }, [weeklyAvailable]);

  function startGlow() {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1.15,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1.0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }

  /* -----------------------------------
    Load Coins from Backend
  ----------------------------------- */
  async function loadCoins() {
    try {
      const res = await getCoins();
      if (res?.data?.ok) {
        setCoins(res.data.coins);

        const last = res.data.lastWeeklyReward
          ? new Date(res.data.lastWeeklyReward)
          : null;

        const now = Date.now();
        const week = 7 * 24 * 60 * 60 * 1000;

        setWeeklyAvailable(!last || now - last.getTime() >= week);
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

  /* -----------------------------------
    Push Messages
  ----------------------------------- */
  function pushMessage(role, text) {
    const id = String(nextId.current++);
    setMessages((prev) => [...prev, { id, role, text }]);
  }

  /* -----------------------------------
    Send Chat
  ----------------------------------- */
  async function onSend() {
    const trimmed = prompt.trim();
    if (!trimmed || sending) return;

    if (coins < 5) {
      setAdModalVisible(true);
      return;
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
    } catch (err) {
      pushMessage("assistant", "Server error. Try again.");
    } finally {
      setSending(false);
    }
  }

  /* -----------------------------------
    Weekly Bonus
  ----------------------------------- */
  async function onTapCoins() {
    if (!weeklyAvailable) return;

    try {
      const res = await claimWeekly();
      if (res?.data?.ok) {
        setCoins(res.data.coins);
        setWeeklyAvailable(false);
        Alert.alert("Weekly Bonus!", "+15 coins 🎉");
      }
    } catch {
      Alert.alert("Error", "Unable to claim bonus.");
    }
  }

  /* -----------------------------------
    Watch Ad Handler
  ----------------------------------- */
  async function onWatchAd() {
    setAdModalVisible(false);

    console.log("AdLoaded:", adLoaded);

    // If ad NOT loaded yet
    if (!adLoaded) {
      Alert.alert("Please wait", "Ad is still loading…");

      // Reload ad
      loadRewardedInterstitial(setAdLoaded);
      return;
    }

    // Set reward handler BEFORE showing
    setRewardCallback(async () => {
      try {
        const res = await watchAd();

        if (res?.data?.ok) {
          setCoins(res.data.coins);
          Alert.alert("Reward Added!", "+10 coins 🎉");
        }
      } catch {
        Alert.alert("Error", "Could not add reward.");
      }

      // Load next ad
      loadRewardedInterstitial(setAdLoaded);
    });

    const shown = showRewardAd();

    if (!shown) {
      Alert.alert("Please wait", "Ad not ready. Reloading…");
      loadRewardedInterstitial(setAdLoaded);
    }
  }

  /* -----------------------------------
    UI Render
  ----------------------------------- */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  return (
    <>
      {/* ⭐ POPUP MODAL FOR WATCH AD */}
      {adModalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Not Enough Coins</Text>

            <Text style={styles.modalText}>
              You need 5 coins to continue chatting.{"\n"}
              Watch an ad to earn +10 coins!
            </Text>

            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => onWatchAd()}
            >
              <Text style={styles.modalBtnText}>Watch Ad</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setAdModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
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
            placeholder={coins < 5 ? "Not enough coins…" : "Type a message…"}
            value={prompt}
            onChangeText={setPrompt}
            editable={!sending}
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

      <BottomNav active="month" />
    </>
  );
}

/* ----------------------------------
   STYLES
---------------------------------- */
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
  },

  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    color: "#1e293b",
    marginLeft: -20,
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

  chatList: { padding: 16, paddingBottom: 130 },

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

  /* MODAL */
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  modalBox: {
    width: "75%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    elevation: 10,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 10,
    color: "#1e293b",
  },

  modalText: {
    fontSize: 15,
    color: "#475569",
    textAlign: "center",
    marginBottom: 20,
  },

  modalBtn: {
    backgroundColor: "#4c6ef5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },

  modalBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

  modalCancel: {
    paddingVertical: 8,
    width: "100%",
  },

  modalCancelText: {
    textAlign: "center",
    fontSize: 15,
    color: "#64748b",
  },
});
