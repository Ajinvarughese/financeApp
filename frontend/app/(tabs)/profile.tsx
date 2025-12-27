import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import { icons } from "@/constants/icons";

const { width } = Dimensions.get("window");

type User = {
    name: string;
    email: string;
};

export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const raw = await AsyncStorage.getItem("currentUser");
        if (raw) setUser(JSON.parse(raw));
    };

    const logout = async () => {
        await AsyncStorage.removeItem("currentUser");
        router.replace("/");
    };

    return (
        <View style={styles.root}>
            <View style={styles.topGlow} pointerEvents="none" />

            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Profile</Text>

                    <View style={styles.avatarRing}>
                        <Image source={icons.person} style={styles.avatar} />
                    </View>
                </View>

                {/* USER CARD */}
                <View style={styles.userCard}>
                    <Text style={styles.userName}>{user?.name || "Guest User"}</Text>
                    <Text style={styles.userEmail}>{user?.email || "Not logged in"}</Text>
                </View>

                {/* BALANCE CARD */}
                <View style={styles.balanceWrap}>
                    <View style={styles.balanceShadow} />
                    <View style={styles.balanceCard}>
                        <Text style={styles.label}>Net Balance</Text>
                        <Text style={styles.balance}>₹ 1,60,000</Text>

                        <View style={styles.statRow}>
                            <View style={styles.statChip}>
                                <Text style={styles.statLabel}>Assets</Text>
                                <Text style={styles.statValue}>₹5.6L</Text>
                            </View>

                            <View style={[styles.statChip, styles.redChip]}>
                                <Text style={styles.statLabel}>Liabilities</Text>
                                <Text style={[styles.statValue, styles.redText]}>₹4.0L</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={styles.primaryBtn}
                            onPress={() => router.push("/asset/add")}
                        >
                            <Text style={styles.primaryBtnText}>Add Asset</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* QUICK ACTIONS */}
                <View style={styles.actionsRow}>
                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/liability")}
                    >
                        <Image source={icons.plus} style={styles.actionIcon} />
                        <Text style={styles.actionText}>Add Liability</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionCard}>
                        <Image source={icons.report} style={styles.actionIcon} />
                        <Text style={styles.actionText}>Reports</Text>
                    </TouchableOpacity>
                </View>

                {/* SETTINGS */}
                <View style={styles.settings}>
                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.rowText}>Security Settings</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.row}>
                        <Text style={styles.rowText}>Help & Support</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.row, styles.logout]} onPress={logout}>
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#071013",
    },

    topGlow: {
        position: "absolute",
        right: -width * 0.25,
        top: -80,
        width: width * 0.8,
        height: width * 0.8,
        borderRadius: width * 0.4,
        backgroundColor: "rgba(0,212,138,0.06)",
        transform: [{ rotate: "30deg" }],
    },

    header: {
        paddingTop: 18,
        paddingHorizontal: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },

    headerTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
    },

    avatarRing: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: "rgba(0,212,138,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },

    avatar: {
        width: 40,
        height: 40,
        tintColor: "#fff",
    },

    userCard: {
        margin: 20,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 16,
        padding: 18,
    },

    userName: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "800",
    },

    userEmail: {
        color: "#9aa8a6",
        marginTop: 6,
    },

    balanceWrap: {
        marginHorizontal: 20,
        marginTop: 10,
    },

    balanceShadow: {
        position: "absolute",
        top: 10,
        left: 8,
        right: 8,
        height: 180,
        backgroundColor: "rgba(0,0,0,0.4)",
        borderRadius: 18,
    },

    balanceCard: {
        backgroundColor: "#0f1a1a",
        borderRadius: 18,
        padding: 18,
    },

    label: {
        color: "#9aa8a6",
        fontSize: 12,
    },

    balance: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "900",
        marginVertical: 8,
    },

    statRow: {
        flexDirection: "row",
        marginTop: 10,
    },

    statChip: {
        backgroundColor: "rgba(255,255,255,0.04)",
        padding: 10,
        borderRadius: 10,
        marginRight: 10,
    },

    redChip: {
        backgroundColor: "rgba(255,0,0,0.08)",
    },

    statLabel: {
        color: "#9aa8a6",
        fontSize: 11,
    },

    statValue: {
        color: "#fff",
        fontWeight: "800",
        marginTop: 4,
    },

    redText: {
        color: "#ff6b6b",
    },

    primaryBtn: {
        backgroundColor: "#00d48a",
        marginTop: 14,
        paddingVertical: 12,
        borderRadius: 14,
    },

    primaryBtnText: {
        textAlign: "center",
        color: "#061014",
        fontWeight: "900",
        fontSize: 16,
    },

    actionsRow: {
        flexDirection: "row",
        marginTop: 20,
        paddingHorizontal: 20,
    },

    actionCard: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.04)",
        padding: 14,
        borderRadius: 14,
        marginHorizontal: 6,
        alignItems: "center",
    },

    actionIcon: {
        width: 22,
        height: 22,
        tintColor: "#a7bfb6",
        marginBottom: 8,
    },

    actionText: {
        color: "#d5efe6",
        fontSize: 12,
        fontWeight: "700",
    },

    settings: {
        marginTop: 24,
        paddingHorizontal: 20,
    },

    row: {
        backgroundColor: "rgba(255,255,255,0.04)",
        padding: 14,
        borderRadius: 12,
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    rowText: {
        color: "#fff",
        fontWeight: "600",
    },

    arrow: {
        color: "#7fbda4",
        fontSize: 18,
    },

    logout: {
        backgroundColor: "rgba(200,30,30,0.15)",
    },

    logoutText: {
        color: "#ffb4b4",
        fontWeight: "800",
        textAlign: "center",
        width: "100%",
    },
});
