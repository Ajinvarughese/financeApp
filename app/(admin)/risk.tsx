import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from "react-native";

const riskUsers = [
    {
        id: "1",
        name: "Rahul",
        email: "rahul@mail.com",
        risk: 62,
        reason: "EMI exceeds 50% of monthly income",
        loans: 3,
    },
    {
        id: "2",
        name: "Suresh",
        email: "suresh@mail.com",
        risk: 48,
        reason: "Multiple active loans",
        loans: 4,
    },
    {
        id: "3",
        name: "Megha",
        email: "megha@mail.com",
        risk: 71,
        reason: "Low savings & high liabilities",
        loans: 5,
    },
];

export default function RiskUsers() {
    const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "WARNING">("ALL");

    const filteredUsers = riskUsers.filter((u) => {
        if (filter === "CRITICAL") return u.risk >= 60;
        if (filter === "WARNING") return u.risk >= 40 && u.risk < 60;
        return true;
    });

    return (
        <View style={styles.root}>
            {/* HEADER */}
            <Text style={styles.title}>High Risk Users</Text>
            <Text style={styles.subtitle}>
                AI-identified users with potential financial instability
            </Text>

            {/* FILTERS */}
            <View style={styles.filters}>
                {["ALL", "WARNING", "CRITICAL"].map((f) => (
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

            {/* AI INSIGHT */}
            <View style={styles.aiCard}>
                <Text style={styles.aiTitle}>AI Risk Insight</Text>
                <Text style={styles.aiText}>
                    ⚠️ {filteredUsers.length} users show elevated debt risk.
                    Proactive alerts can reduce default probability by 28%.
                </Text>
            </View>

            {/* USERS */}
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

                            <RiskBadge risk={item.risk} />
                        </View>

                        {/* RISK BAR */}
                        <View style={styles.riskBarBg}>
                            <View
                                style={[
                                    styles.riskBarFill,
                                    {
                                        width: `${item.risk}%`,
                                        backgroundColor:
                                            item.risk >= 60
                                                ? "#ff6b6b"
                                                : "#facc15",
                                    },
                                ]}
                            />
                        </View>

                        <Text style={styles.riskText}>
                            Risk Score: {item.risk}%
                        </Text>

                        <Text style={styles.reason}>{item.reason}</Text>

                        <View style={styles.meta}>
                            <Text style={styles.metaText}>
                                Active Loans: {item.loans}
                            </Text>
                        </View>

                        {/* ACTIONS */}
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.notifyBtn}>
                                <Text style={styles.notifyText}>Notify User</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.reviewBtn}>
                                <Text style={styles.reviewText}>Review</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

/* ---------------- COMPONENTS ---------------- */

const RiskBadge = ({ risk }: { risk: number }) => (
    <View
        style={[
            styles.badge,
            risk >= 60 ? styles.critical : styles.warning,
        ]}
    >
        <Text style={styles.badgeText}>
            {risk >= 60 ? "CRITICAL" : "WARNING"}
        </Text>
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
});
