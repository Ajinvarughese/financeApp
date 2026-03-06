import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";

import {
  fetchFeedbacks,
  resolveFeedback,
  deleteFeedback,
  deleteResolvedFeedbacks,
} from "@/utils/feedback";

import { Feedback, FeedbackStatus } from "@/types/entity";
import { replaceUrl } from "@/utils/api";

export default function FeedbackAdmin() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ISSUED" | "RESOLVED">(
    "ISSUED"
  );
  const [expanded, setExpanded] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [responses, setResponses] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    loadFeedbacks();
  }, []);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await fetchFeedbacks();
      setFeedbacks(data);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (feedback: Feedback) => {
    setLoading(true)
    const response = responses[feedback.id!];
    if (!response) return;
   
    try {
      await resolveFeedback({
        feedback,
        response,
      });

      loadFeedbacks();
    } catch (e) {
      Alert.alert("Error", "Failed to resolve feedback");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteFeedback(id);
    setFeedbacks((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleExpand = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const renderItem = ({ item }: { item: Feedback }) => {
    const isExpanded = expanded === item.id;

    return (
      <View style={styles.card}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => toggleExpand(item.id!)}
        >
          <Text style={styles.title}>{item.title}</Text>
          {item.feedbackStatus !== FeedbackStatus.RESOLVED && (
            <Text style={styles.expandHint}>
              {expanded === item.id ? "Tap to collapse ▲" : "Tap to reply ▼"}
            </Text>
          )}

          <Text style={styles.user}>
            Name: {item.user?.firstName + " " + item.user?.lastName}
          </Text>

          <Text style={styles.user}>User email: {item.user?.email}</Text>

          <Text style={styles.comment}>{item.comment}</Text>

          {item.document && (
            <TouchableOpacity onPress={() => Linking.openURL(replaceUrl(item.document))}>
              <Text style={styles.document}>View Attachment</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {isExpanded && item.feedbackStatus != FeedbackStatus.RESOLVED && (
          <>
            <TextInput
              placeholder="Write response..."
              placeholderTextColor="#6f8480"
              style={styles.input}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={responses[item.id!]}
              onChangeText={(text) =>
                setResponses((prev) => ({ ...prev, [item.id!]: text }))
              }
            />

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.resolveBtn}
                onPress={() => handleResolve(item)}
              >
                <Text style={styles.resolveText}>Resolve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id!)}
              >
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#00d48a" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Feedback</Text>
      </View>

      <TextInput
        placeholder="Search by user name or email..."
        placeholderTextColor="#6f8480"
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, statusFilter === "ISSUED" && styles.activeTab]}
          onPress={() => setStatusFilter("ISSUED")}
        >
          <Text
            style={[
              styles.tabText,
              statusFilter === "ISSUED" && styles.activeTabText,
            ]}
          >
            Issued
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, statusFilter === "RESOLVED" && styles.activeTab]}
          onPress={() => setStatusFilter("RESOLVED")}
        >
          <Text
            style={[
              styles.tabText,
              statusFilter === "RESOLVED" && styles.activeTabText,
            ]}
          >
            Resolved
          </Text>
        </TouchableOpacity>
      </View>
      {statusFilter === "RESOLVED" && (
        <TouchableOpacity
          style={styles.clearBtn}
          onPress={async () => {
            await deleteResolvedFeedbacks();
            loadFeedbacks();
          }}
        >
          <Text style={styles.clearText}>Delete Resolved</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={feedbacks.filter((f: any) => {
          if (f.feedbackStatus !== statusFilter) return false;

          const fullName = `${f.user?.firstName || ""} ${
            f.user?.lastName || ""
          }`.toLowerCase();
          const email = (f.user?.email || "").toLowerCase();
          const query = search.toLowerCase();

          return fullName.includes(query) || email.includes(query);
        })}
        keyExtractor={(item) => item.id!.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "#071013",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginLeft: 35,
    paddingTop: 18,
    marginBottom: 30,
  },

  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },

  clearBtn: {
    backgroundColor: "rgba(255,107,107,0.15)",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 20,
    alignSelf: "flex-start",
  },

  clearText: {
    color: "#ff6b6b",
    fontWeight: "700",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
  },

  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },

  comment: {
    color: "#cfe3dc",
    marginTop: 6,
  },

  user: {
    color: "#9aa8a6",
    marginTop: 6,
    fontSize: 12,
  },

  document: {
    color: "#00d48a",
    marginTop: 8,
    fontWeight: "700",
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.07)",
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    minHeight: 140,
    maxHeight: 250,
    textAlignVertical: "top",
    fontSize: 14,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  resolveBtn: {
    backgroundColor: "#00d48a",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  resolveText: {
    color: "#071013",
    fontWeight: "800",
  },

  deleteBtn: {
    backgroundColor: "rgba(255,77,77,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  deleteText: {
    color: "#ff6b6b",
    fontWeight: "700",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071013",
  },
  tabs: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  tab: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginRight: 8,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#00d48a",
  },

  tabText: {
    color: "#9aa8a6",
    fontWeight: "700",
  },

  activeTabText: {
    color: "#071013",
    fontWeight: "800",
  },
  searchInput: {
    backgroundColor: "rgba(255,255,255,0.07)",
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: "#fff",
  },
  expandHint: {
    color: "#7fbda4",
    fontSize: 11,
    marginTop: 4,
  },
});