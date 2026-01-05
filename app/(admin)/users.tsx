import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from "react-native";

const initialUsers = [
    { id: "1", name: "Ajin", email: "ajin@mail.com", role: "USER", status: "ACTIVE" },
    { id: "2", name: "Rahul", email: "rahul@mail.com", role: "USER", status: "ACTIVE" },
    { id: "3", name: "Admin", email: "admin@mail.com", role: "ADMIN", status: "ACTIVE" },
    { id: "4", name: "Sneha", email: "sneha@mail.com", role: "USER", status: "SUSPENDED" },
];

export default function AdminUsers() {
    const [users, setUsers] = useState(initialUsers);
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState<"ALL" | "USER" | "ADMIN">("ALL");

    const filteredUsers = users.filter((u) => {
        const matchQuery =
            u.name.toLowerCase().includes(query.toLowerCase()) ||
            u.email.toLowerCase().includes(query.toLowerCase());
        const matchRole = filter === "ALL" || u.role === filter;
        return matchQuery && matchRole;
    });

    const toggleSuspend = (id: string) => {
        setUsers((prev) =>
            prev.map((u) =>
                u.id === id
                    ? {
                        ...u,
                        status: u.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE",
                    }
                    : u
            )
        );
    };

    const deleteUser = (id: string) => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>User Management</Text>

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
                        style={[
                            styles.filterBtn,
                            filter === f && styles.filterActive,
                        ]}
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

            {/* USERS LIST */}
            <FlatList
                data={filteredUsers}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40 }}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.info}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>

                            <View style={styles.badges}>
                                <Badge label={item.role} />
                                <StatusBadge status={item.status} />
                            </View>
                        </View>

                        {item.role !== "ADMIN" && (
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.suspendBtn}
                                    onPress={() => toggleSuspend(item.id)}
                                >
                                    <Text style={styles.suspendText}>
                                        {item.status === "ACTIVE"
                                            ? "Suspend"
                                            : "Activate"}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.deleteBtn}
                                    onPress={() => deleteUser(item.id)}
                                >
                                    <Text style={styles.deleteText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
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
        justifyContent: "flex-end",
    },

    suspendBtn: {
        backgroundColor: "rgba(250,204,21,0.2)",
        paddingHorizontal: 14,
        paddingVertical: 6,
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
