import React, { useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { logout } from "@/utils/auth";

const SIDEBAR_WIDTH = 260;

type ActivePage = "users" | "risk" | "alerts" | "dashboard" | "";

export default function AdminSidebar({
    children,
    prop = "",
}: {
    children: React.ReactNode;
    prop: ActivePage;
}) {
    const router = useRouter();
    const [open, setOpen] = useState(false);

    const translateX = useRef(
        new Animated.Value(-SIDEBAR_WIDTH)
    ).current;

    const openSidebar = () => {
        if (open) return; // 🔒 HARD GUARD
        setOpen(true);
        Animated.timing(translateX, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
        }).start();
    };

    const closeSidebar = () => {
        Animated.timing(translateX, {
            toValue: -SIDEBAR_WIDTH,
            duration: 220,
            useNativeDriver: true,
        }).start(() => setOpen(false));
    };

    const handleNav = (path: string) => {
        closeSidebar();
        router.push(path);
    };

    const handleLogout = async () => {
        closeSidebar();
        await logout();
        router.replace("/(auth)/login");
    };

    return (
        <View style={styles.container}>
            {/* Overlay (blocks ALL touches) */}
            {open && (
                <Pressable
                    style={styles.overlay}
                    onPress={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <Animated.View
                style={[
                    styles.sidebar,
                    { transform: [{ translateX }] },
                ]}
            >
                <Text style={styles.title}>Admin Menu</Text>

                <NavBtn
                    title="Dashboard"
                    active={prop === "dashboard"}
                    onPress={() => handleNav("/")}
                />

                <NavBtn
                    title="Manage Users"
                    active={prop === "users"}
                    onPress={() => handleNav("/users")}
                />
                <NavBtn
                    title="Risk Dashboard"
                    active={prop === "risk"}
                    onPress={() => handleNav("/risk")}
                />
                <NavBtn
                    title="Send Alerts"
                    active={prop === "alerts"}
                    onPress={() => handleNav("/alerts")}
                />
                

                <View style={{ marginTop: 20 }}>
                    <NavBtn
                        title="Logout"
                        danger
                        onPress={handleLogout}
                    />
                </View>
            </Animated.View>

            {/* Hamburger (ALWAYS BELOW overlay, DISABLED when open) */}
            <TouchableOpacity
                onPress={openSidebar}
                style={styles.hamburger}
                activeOpacity={0.7}
                pointerEvents={open ? "none" : "auto"} // 🔒 CRITICAL
            >
                <Text style={styles.hamburgerText}>☰</Text>
            </TouchableOpacity>

            {/* Page Content */}
            <View style={styles.page}>{children}</View>
        </View>
    );
}

/* ---------- BUTTON ---------- */

const NavBtn = ({
    title,
    danger,
    active,
    onPress,
}: {
    title: string;
    danger?: boolean;
    active?: boolean;
    onPress: () => void;
}) => (
    <TouchableOpacity
        onPress={onPress}
        style={[
            styles.btn,
            active && styles.active,
            danger && { borderColor: "#ff6b6b" },
        ]}
    >
        <Text
            style={[
                styles.btnText,
                active && { color: "#041F1A" },
                danger && { color: "#ff6b6b" },
            ]}
        >
            {title}
        </Text>
    </TouchableOpacity>
);

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#071013",
    },

    page: {
        flex: 1,
    },

    overlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.55)",
        zIndex: 20, // 🔒 ABOVE hamburger
    },

    sidebar: {
        position: "absolute",
        top: 0,
        bottom: 0,
        width: SIDEBAR_WIDTH,
        backgroundColor: "#071013",
        padding: 20,
        zIndex: 30,
        borderRightWidth: 1,
        borderRightColor: "rgba(255,255,255,0.1)",
    },

    title: {
        color: "#e5fff6",
        fontSize: 18,
        fontWeight: "900",
        marginBottom: 20,
    },

    hamburger: {
        position: "absolute",
        top: 52,
        left: 16,
        zIndex: 10, // 🔒 BELOW overlay
    },

    hamburgerText: {
        fontSize: 26,
        color: "#00d48a",
        fontWeight: "900",
    },

    btn: {
        borderWidth: 1,
        borderColor: "#041F1A",
        paddingVertical: 14,
        borderRadius: 16,
        marginBottom: 12,
    },

    active: {
        backgroundColor: "#00d48a",
        borderColor: "#00d48a",
    },

    btnText: {
        color: "#00d48a",
        fontWeight: "800",
        textAlign: "center",
        fontSize: 15,
    },
});