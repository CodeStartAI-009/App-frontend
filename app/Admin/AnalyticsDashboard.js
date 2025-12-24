import React, { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";

import {
  getUsageStats,
  getEventStats,
} from "../../services/analyticsService";
import { useUserAuthStore } from "../../store/useAuthStore";

const ADMIN_EMAIL = "vxs1909@gmail.com";

/* ---------------- CRITICAL EVENTS ---------------- */
const CRITICAL_EVENTS = new Set([
  "expense_added",
  "ai_chat_used",
  "goal_created",
]);

export default function AnalyticsDashboard() {
  const router = useRouter();
  const user = useUserAuthStore((s) => s.user);

  const isAdmin =
    user?.email?.toLowerCase() === ADMIN_EMAIL;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);

  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    loadAll();
  }, [isAdmin]);

  async function loadAll() {
    try {
      setLoading(true);

      const usage = await getUsageStats();
      const ev = await getEventStats();

      setStats(usage ?? null);
      setEvents(Array.isArray(ev?.events) ? ev.events : []);
    } catch (err) {
      console.log("ANALYTICS LOAD ERROR:", err);
    } finally {
      setLoading(false);
    }
  }

  /* ---------------- DERIVED ---------------- */
  const stickiness = useMemo(() => {
    if (!stats?.dau || !stats?.mau) return "0.0";
    return ((stats.dau / stats.mau) * 100).toFixed(1);
  }, [stats]);

  /* ---------------- LOADING ---------------- */
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#196F63" />
      </View>
    );
  }

  /* ---------------- NON-ADMIN ---------------- */
  if (!isAdmin) {
    return (
      <View style={styles.center}>
        <Text style={styles.lockTitle}>🔒 Admin Only</Text>
        <Text style={styles.lockSub}>
          You do not have permission to view analytics.
        </Text>

        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => router.replace("/Home/Home")}
        >
          <Text style={styles.actionText}>Go to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /* ---------------- ADMIN DASHBOARD ---------------- */
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>📊 App Analytics</Text>

      {/* CORE METRICS */}
      <View style={styles.row}>
        <Metric label="DAU" value={stats?.dau ?? 0} />
        <Metric label="MAU" value={stats?.mau ?? 0} />
      </View>

      {/* ENGAGEMENT */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Engagement</Text>
        <Text style={styles.bigValue}>{stickiness}%</Text>
        <Text style={styles.subText}>
          Daily Active Users / Monthly Active Users
        </Text>
      </View>

      {/* EVENT USAGE */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Top User Actions (Last 30 Days)
        </Text>

        {events.length === 0 && (
          <Text style={styles.subText}>
            No events recorded yet
          </Text>
        )}

        {events.slice(0, 6).map((e) => {
          const isCritical = CRITICAL_EVENTS.has(e.event);

          return (
            <View
              key={e.event}
              style={[
                styles.eventRow,
                isCritical && styles.criticalRow,
              ]}
            >
              <Text
                style={[
                  styles.eventName,
                  isCritical && styles.criticalText,
                ]}
              >
                {e.event}
              </Text>

              <Text
                style={[
                  styles.eventCount,
                  isCritical && styles.criticalText,
                ]}
              >
                {e.count}
              </Text>
            </View>
          );
        })}
      </View>

      {/* EXIT */}
      <TouchableOpacity
        style={styles.actionBtn}
        onPress={() => router.replace("/Home/Home")}
      >
        <Text style={styles.actionText}>
          Switch to User Mode
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

/* ---------------- COMPONENTS ---------------- */

function Metric({ label, value }) {
  return (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FBF9",
    padding: 20,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 18,
    paddingTop: 45,
    color: "#111827",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  metric: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    elevation: 2,
  },

  metricLabel: {
    color: "#6B7280",
    fontWeight: "600",
  },

  metricValue: {
    fontSize: 28,
    fontWeight: "800",
    color: "#196F63",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginTop: 18,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
    color: "#18493F",
  },

  bigValue: {
    fontSize: 34,
    fontWeight: "900",
    color: "#196F63",
  },

  subText: {
    color: "#6B7280",
    marginTop: 4,
    fontSize: 13,
  },

  eventRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#EEF2F7",
  },

  criticalRow: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  eventName: {
    fontWeight: "600",
    color: "#374151",
  },

  eventCount: {
    fontWeight: "800",
    color: "#196F63",
  },

  criticalText: {
    color: "#065F46",
    fontWeight: "800",
  },

  actionBtn: {
    backgroundColor: "#196F63",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    marginVertical: 30,
  },

  actionText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  lockTitle: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 6,
  },

  lockSub: {
    color: "#6B7280",
    marginBottom: 20,
    textAlign: "center",
  },
});
