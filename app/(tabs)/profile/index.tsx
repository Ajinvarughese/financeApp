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
import { useRouter } from "expo-router";

import { icons } from "@/constants/icons";
import { getUser, logout } from "@/utils/auth";
import { User } from "@/types/financial";

const { width } = Dimensions.get("window");


export default function Profile() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const u = await getUser();
        if(!u) router.replace("/");
        setUser(u);
    };

    const logoutUser = async () => {
        logout();
        router.replace("../");
    };

    if (!user) {
        return (
            <View style={styles.root}>
                <Text style={{ color: "#9aa8a6", textAlign: "center", marginTop: 100 }}>
                    Please login to view profile
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.root}>
            <View style={styles.topGlow} pointerEvents="none" />

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Profile</Text>

                    <View style={styles.headerIcons}>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => router.push({ pathname: "/profile/notification" })}
                        >
                            <Image source={icons.info} style={styles.icon} />
                        </TouchableOpacity>

                        <View style={styles.avatarRing}>
                            <Image source={icons.person} style={styles.avatar} />
                        </View>
                    </View>
                </View>

                {/* USER INFO */}
                <View style={styles.userCard}>
                    <Text style={styles.userName}>{user.firstName + " " + user.lastName}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>

                    <View style={styles.roleBadge}>
                        <Text style={styles.roleText}>{user.role}</Text>
                    </View>
                </View>

                {/* QUICK ACTIONS */}
                <View style={styles.actionsRow}>


                    <TouchableOpacity
                        style={styles.actionCard}
                        onPress={() => router.push("/dashboard")}
                    >
                        <Image source={icons.dash} style={styles.actionIcon} />
                        <Text style={styles.actionText}>Dashboard</Text>
                    </TouchableOpacity>
                </View>

                {/* SETTINGS */}
                <View style={styles.settings}>
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => router.push({ pathname: "/profile/security" })}
                    >
                        <Text style={styles.rowText}>Security Settings</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.row}
                        onPress={() => router.push({ pathname: "/profile/help" })}
                    >
                        <Text style={styles.rowText}>Help & Support</Text>
                        <Text style={styles.arrow}>›</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.row, styles.logout]}
                        onPress={logoutUser}
                    >
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
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

    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
    },

    iconBtn: {
        marginRight: 12,
        padding: 6,
    },

    icon: {
        width: 22,
        height: 22,
        tintColor: "#d5efe6",
    },

    avatarRing: {
        width: 56,
        height: 56,
        borderRadius: 28,
        borderWidth: 2,
        borderColor: "rgba(0,212,138,0.3)",
        justifyContent: "center",
        alignItems: "center",
    },

    avatar: {
        width: 34,
        height: 34,
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
        marginTop: 4,
    },

    roleBadge: {
        alignSelf: "flex-start",
        marginTop: 10,
        backgroundColor: "rgba(0,212,138,0.15)",
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },

    roleText: {
        color: "#00d48a",
        fontWeight: "800",
        fontSize: 12,
    },

    actionsRow: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginTop: 10,
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
