import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Notification } from "@/types/entity";
import { deleteAllNotifications, getNotifications, markAsRead } from "@/utils/notification";
import Delete from "@/assets/icons/delete.png";

export default function Notifications() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();

      const sorted = data.sort((a, b) => {
        if (a.isRead === b.isRead) return 0;
        return a.isRead ? 1 : -1; // unread first
      });

      setNotifications(sorted);
    } catch (err) {
      console.log("Failed to load notifications", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePress = async (item: Notification) => {
    const isOpen = expanded === item.id;

    setExpanded(isOpen ? null : item.id);

    if (!item.isRead && item.id) {
      try {
        await markAsRead(item.id);

        setNotifications((prev) =>
          prev
            .map((n) => (n.id === item.id ? { ...n, isRead: true } : n))
        );
      } catch (e) {
        console.log("Failed to mark read", e);
      }
    }
  };

  const clearAllNotifications = async () => {
    await deleteAllNotifications();
    setNotifications([]);
  };

  const formatTime = (timestamp?: number) => {
    if (!timestamp) return "";

    const date = new Date(timestamp);

    const day = date.getDate();
    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
        ? "rd"
        : "th";

    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();

    return `${day}${suffix} ${month} ${year}`;
  };

  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return styles.high;
      case "MEDIUM":
        return styles.medium;
      case "LOW":
        return styles.low;
      default:
        return {};
    }
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const isExpanded = expanded === item.id;

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d48a" />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      );
    }
    return (
      <TouchableOpacity
        style={[styles.card, !item.isRead ? styles.unreadCard : styles.readCard]}
        onPress={() => handlePress(item)}
      >
        {/* HEADER */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>{item.title}</Text>
            <View style={styles.metaRow}>
              <Text style={[styles.priority, getPriorityStyle(item.priority)]}>
                {item.priority}
              </Text>

              <Text style={styles.meta}>{formatTime(item.createdAt)}</Text>
            </View>
          </View>

          {!item.isRead && <View style={styles.dot} />}
        </View>

        {/* EXPANDED MESSAGE */}
        {isExpanded && <Text style={styles.message}>{item.message}</Text>}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace("/(tabs)/profile")}>
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        {notifications.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={clearAllNotifications}
          >
            <Image source={Delete} style={styles.deleteIcon} />
            <Text style={styles.clear}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <Text style={styles.empty}>No notifications yet</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id!.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#071013",
  },

  header: {
    marginTop: 30,
    paddingTop: 18,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    color: "#00d48a",
    fontSize: 28,
    fontWeight: "800",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  empty: {
    color: "#9aa8a6",
    textAlign: "center",
    marginTop: 120,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },

  unreadCard: {
    borderWidth: 1,
    borderColor: "rgba(0,212,138,0.3)",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00d48a",
  },

  message: {
    color: "#cfe3dc",
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
  },

  time: {
    color: "#9aa8a6",
    marginTop: 8,
    fontSize: 12,
  },
  meta: {
    color: "#9aa8a6",
    fontSize: 12,
    marginTop: 2,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#071013",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#9aa8a6",
    fontSize: 14,
  },
  readCard: {
    opacity: 0.6,
    backgroundColor: "rgba(255,255,255,0.02)",
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  priority: {
    fontSize: 11,
    fontWeight: "700",
    marginRight: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  high: {
    backgroundColor: "#ff4d4d",
    color: "#fff",
  },

  medium: {
    backgroundColor: "#ffb84d",
    color: "#000",
  },

  low: {
    backgroundColor: "#2ecc71",
    color: "#fff",
  },
  clear: {
    color: "#ff6b6b",
    fontSize: 13,
    fontWeight: "700",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,107,107,0.08)",
  },

  deleteIcon: {
    width: 16,
    height: 16,
    tintColor: "#ff6b6b",
  },

  clear: {
    color: "#ff6b6b",
    fontSize: 13,
    fontWeight: "700",
  },
});



/**
 * Show Already read notifications in a different color
 * edit date format
 * add feedback
 */