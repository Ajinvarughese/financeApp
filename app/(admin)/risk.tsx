import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
} from "react-native";
import AdminSidebar from "@/components/AdminSidebar";
import { FullUser, Notification } from "@/types/entity";
import { fetchAllUsers } from "@/utils/users";
import { analyzeRisk } from "@/utils/userRiskAnalyzer";
import { useRouter } from "expo-router";
import { createNotification } from "@/utils/notification";

/* ---------------- MOCK DATA ---------------- */


export default function RiskUsers() {
    const [filter, setFilter] = useState<
        "ALL" | "CRITICAL" | "WARNING"
    >("ALL");
    const router = useRouter();
    const [users, setUsers] = useState<FullUser[]>([]);

    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH">(
      "MEDIUM"
    );

    const openNotificationDialog = (userId: number) => {
      setSelectedUserId(userId);
      setDialogVisible(true);
    };

    const sendNotificationToUser = async () => {
      if (!selectedUserId) return;
      if (!title || !message) {
       Alert.alert("Missing Fields", "Please fill all fields");
       return; 
      }
      const payload : Notification = {
        user: { id: selectedUserId },
        title,
        message,
        priority,
      };

      try {
        await createNotification(payload);

        setDialogVisible(false);
        setTitle("");
        setMessage("");
        setPriority("MEDIUM");
      } catch (err) {
        console.log("Notification failed", err);
      }
    };

    const load = async () => {
        const userRes = await fetchAllUsers();
        setUsers(userRes);
    }
    useEffect(() => {
        load();
    },[])

    const riskUsers = users
      .map((u) => {
        const analysis = analyzeRisk(u.assets, u.liabilities);

        return {
          id: u.user.id.toString(),
          name: `${u.user.firstName} ${u.user.lastName}`,
          email: u.user.email,
          riskScore: Number(analysis.emiRatio),
          riskLabel: analysis.riskLevel.label,
          riskColor: analysis.riskLevel.color,
          reason: `EMI ratio ${analysis.emiRatio}%`,
          loans: u.liabilities.length,
        };
      })
      

    const filteredUsers = riskUsers.filter((u) => {
      if (filter === "CRITICAL") return u.riskLabel === "High Risk";
      if (filter === "WARNING") return u.riskLabel === "Moderate";
      return true;
    });

    return (
      <AdminSidebar prop="risk">
        <View style={styles.root}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>High Risk Users</Text>
            <Text style={styles.subtitle}>
              AI-identified users with potential financial instability
            </Text>
          </View>

          {/* FILTERS */}
          <View style={styles.filters}>
            {["ALL", "WARNING", "CRITICAL"].map((f) => (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f as any)}
                style={[styles.filterBtn, filter === f && styles.filterActive]}
              >
                <Text
                  style={[
                    styles.filterText,
                    filter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* AI INSIGHT */}
          <View style={styles.aiCard}>
            <Text style={styles.aiTitle}>Risk Insight</Text>
            <Text style={styles.aiText}>
              ⚠️ {filteredUsers.filter((item) => item.riskLabel === "High Risk").length} users show elevated debt risk. Proactive
              alerts can reduce default probability by 28%.
            </Text>
          </View>

          {/* USERS LIST */}
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.headerRow}>
                  <View>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.email}>{item.email}</Text>
                  </View>

                  <RiskBadge label={item.riskLabel} color={item.riskColor} />
                </View>

                {/* RISK BAR */}
                <View style={styles.riskBarBg}>
                  <View
                    style={[
                      styles.riskBarFill,
                      {
                        width: `${Math.min(item.riskScore, 100)}%`,
                        backgroundColor:
                          item.riskScore >= 80
                            ? "#ff6b6b"
                            : item.riskScore >= 40
                            ? "#facc15"
                            : "#00d48a",
                      },
                    ]}
                  />
                </View>

                <Text style={styles.riskText}>
                  Risk Score: {item.riskScore}%
                </Text>

                <Text style={styles.reason}>{item.reason}</Text>

                <View style={styles.meta}>
                  <Text style={styles.metaText}>
                    Active Loans: {item.loans}
                  </Text>
                </View>

                {/* ACTIONS */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.notifyBtn}
                    onPress={() => openNotificationDialog(Number(item.id))}
                  >
                    <Text style={styles.notifyText}>Notify User</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.reviewBtn}
                    onPress={() => router.push(`/(admin)/user/risk/${item.id}`)}
                  >
                    <Text style={styles.reviewText}>Review</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <Modal visible={dialogVisible} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text style={styles.modalTitle}>Send Notification</Text>

                <TextInput
                  placeholder="Title"
                  placeholderTextColor="#9aa8a6"
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />

                <TextInput
                  placeholder="Message"
                  placeholderTextColor="#9aa8a6"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  style={[styles.input, { height: 80 }]}
                />

                {/* PRIORITY SELECT */}
                <View style={styles.priorityRow}>
                  {["LOW", "MEDIUM", "HIGH"].map((p) => (
                    <TouchableOpacity
                      key={p}
                      onPress={() => setPriority(p as any)}
                      style={[
                        styles.priorityBtn,
                        priority === p && styles.priorityActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          priority === p && styles.priorityTextActive,
                        ]}
                      >
                        {p}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* ACTIONS */}
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => setDialogVisible(false)}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sendBtn}
                    onPress={sendNotificationToUser}
                  >
                    <Text style={styles.sendText}>Send</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </AdminSidebar>
    );
}

/* ---------------- COMPONENTS ---------------- */

const RiskBadge = ({ label, color }: { label: string; color: string }) => (
  <View style={[styles.badge, { backgroundColor: color + "40" }]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#071013",
    padding: 20,
  },
  header: {
    paddingLeft: 50,
    marginTop: 30,
  },

  title: {
    color: "#e5fff6",
    fontSize: 24,
    fontWeight: "900",
  },

  subtitle: {
    color: "#9aa8a6",
    marginTop: 6,
    marginBottom: 16,
    fontSize: 13,
  },

  filters: {
    flexDirection: "row",
    marginBottom: 16,
  },

  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    marginRight: 8,
  },

  filterActive: {
    backgroundColor: "#00d48a",
    borderColor: "#00d48a",
  },

  filterText: {
    color: "#9aa8a6",
    fontWeight: "700",
    fontSize: 12,
  },

  filterTextActive: {
    color: "#041F1A",
  },

  aiCard: {
    backgroundColor: "rgba(0,212,138,0.08)",
    padding: 16,
    borderRadius: 18,
    marginBottom: 20,
  },

  aiTitle: {
    color: "#00d48a",
    fontWeight: "900",
    fontSize: 14,
  },

  aiText: {
    color: "#d5efe6",
    marginTop: 6,
    lineHeight: 20,
    fontSize: 13,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },

  email: {
    color: "#9aa8a6",
    fontSize: 12,
    marginTop: 2,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  critical: {
    backgroundColor: "rgba(255,0,0,0.25)",
  },

  warning: {
    backgroundColor: "rgba(250,204,21,0.25)",
  },

  badgeText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
  },

  riskBarBg: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 6,
    overflow: "hidden",
    marginTop: 6,
  },

  riskBarFill: {
    height: 6,
    borderRadius: 6,
  },

  riskText: {
    color: "#ffb4b4",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
  },

  reason: {
    color: "#9aa8a6",
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },

  meta: {
    marginTop: 8,
  },

  metaText: {
    color: "#7fbda4",
    fontSize: 12,
    fontWeight: "600",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
  },

  notifyBtn: {
    backgroundColor: "#00d48a",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
    marginRight: 8,
  },

  notifyText: {
    color: "#041F1A",
    fontWeight: "800",
    fontSize: 12,
  },

  reviewBtn: {
    borderWidth: 1,
    borderColor: "#00d48a",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },

  reviewText: {
    color: "#00d48a",
    fontWeight: "800",
    fontSize: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: 320,
    backgroundColor: "#071013",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  modalTitle: {
    color: "#e5fff6",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 10,
    color: "#fff",
    marginBottom: 12,
  },

  priorityRow: {
    flexDirection: "row",
    marginBottom: 14,
  },

  priorityBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 8,
    marginRight: 6,
  },

  priorityActive: {
    backgroundColor: "#00d48a",
    borderColor: "#00d48a",
  },

  priorityText: {
    color: "#9aa8a6",
    fontWeight: "700",
    fontSize: 11,
  },

  priorityTextActive: {
    color: "#041F1A",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  cancelBtn: {
    marginRight: 10,
  },

  cancelText: {
    color: "#9aa8a6",
    fontWeight: "700",
  },

  sendBtn: {
    backgroundColor: "#00d48a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  sendText: {
    color: "#041F1A",
    fontWeight: "800",
  },
});