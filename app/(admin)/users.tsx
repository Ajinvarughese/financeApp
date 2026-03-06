import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";
import AdminSidebar from "@/components/AdminSidebar";
import { fetchUsers, updateUserStatus } from "@/utils/users";
import { AccountStatus, User } from "@/types/entity";

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");
    const [statusFilter, setStatusFilter] = useState<
      "ALL" | "ACTIVE" | "SUSPENDED"
    >("ALL");

    const load = async () => {
        const userRes = await fetchUsers();
        setUsers(userRes);
    }

    useEffect(() => {
        load();
    },[]);

    const filteredUsers = users.filter((u) => {
      const matchQuery =
        (u.firstName + " " + u.lastName)
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        u.email.toLowerCase().includes(query.toLowerCase());

      const matchRole = filter === "ALL" || u.role === filter;

      const matchStatus =
        statusFilter === "ALL" || u.accountStatus === statusFilter;

      return matchQuery && matchRole && matchStatus;
    });

    const toggleSuspend = async (id: number, status : AccountStatus) => {
        await updateUserStatus(id, status);
        load();
    };

    const deleteUser = (id: number) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        load();
    };

    return (
      <AdminSidebar prop="users">
        <View style={styles.root}>
          <View style={{ paddingLeft: 40 }}>
            <Text style={styles.title}>User Management</Text>
          </View>

          {/* SEARCH */}
          <TextInput
            placeholder="Search users by name or email"
            placeholderTextColor="#9aa8a6"
            style={styles.search}
            value={query}
            onChangeText={setQuery}
          />

          {/* FILTER */}
          <View style={styles.filters}>
            {["ALL", "USER", "ADMIN"].map((f) => (
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

          {filter === "USER" && (
            <View style={styles.filters}>
              {["ALL", "ACTIVE", "SUSPENDED"].map((f) => (
                <TouchableOpacity
                  key={f}
                  onPress={() => setStatusFilter(f as any)}
                  style={[
                    styles.filterBtn,
                    statusFilter === f && styles.filterActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      statusFilter === f && styles.filterTextActive,
                    ]}
                  >
                    {f}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* USERS LIST */}
          <FlatList
            data={filteredUsers}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.info}>
                  <Text style={styles.name}>
                    {item.firstName + item.lastName}
                  </Text>
                  <Text style={styles.email}>{item.email}</Text>

                  <View style={styles.badges}>
                    <Badge label={item.role} />
                    <StatusBadge status={item.accountStatus} />
                  </View>
                </View>

                {item.role !== "ADMIN" && (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      style={styles.suspendBtn}
                      onPress={() =>
                        toggleSuspend(
                          item.id,
                          AccountStatus.ACTIVE === item.accountStatus
                            ? AccountStatus.SUSPENDED
                            : AccountStatus.ACTIVE
                        )
                      }
                    >
                      <Text style={styles.suspendText}>
                        {item.accountStatus === "ACTIVE"
                          ? "Suspend"
                          : "Activate"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </AdminSidebar>
    );
}

/* ---------------- COMPONENTS ---------------- */

const Badge = ({ label }: { label: string }) => (
    <View style={styles.badge}>
        <Text style={styles.badgeText}>{label}</Text>
    </View>
);

const StatusBadge = ({ status }: { status: string }) => (
    <View
        style={[
            styles.status,
            status === "ACTIVE" ? styles.active : styles.suspended,
        ]}
    >
        <Text style={styles.statusText}>{status}</Text>
    </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#071013",
    padding: 20,
  },

  title: {
    marginTop: 30,
    color: "#e5fff6",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 16,
  },

  search: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 14,
    borderRadius: 14,
    color: "#fff",
    marginTop: 30,
    marginBottom: 14,
  },

  filters: {
    flexDirection: "row",
    marginBottom: 20,
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
  },

  filterTextActive: {
    color: "#041F1A",
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  info: {
    marginBottom: 12,
  },

  name: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
  },

  email: {
    color: "#9aa8a6",
    fontSize: 12,
    marginTop: 2,
  },

  badges: {
    flexDirection: "row",
    marginTop: 10,
  },

  badge: {
    backgroundColor: "rgba(0,212,138,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 8,
  },

  badgeText: {
    color: "#00d48a",
    fontWeight: "800",
    fontSize: 11,
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  active: {
    backgroundColor: "rgba(0,212,138,0.2)",
  },

  suspended: {
    backgroundColor: "rgba(255,0,0,0.2)",
  },

  statusText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 11,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 10,
  },

  suspendBtn: {
    backgroundColor: "rgba(250,204,21,0.2)",
    paddingHorizontal: 22,
    paddingVertical: 9,
    borderRadius: 10,
    marginRight: 8,
  },

  suspendText: {
    color: "#facc15",
    fontWeight: "800",
    fontSize: 12,
  },

  deleteBtn: {
    backgroundColor: "rgba(255,0,0,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },

  deleteText: {
    color: "#ff6b6b",
    fontWeight: "800",
    fontSize: 12,
  },
});