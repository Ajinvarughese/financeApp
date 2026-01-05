import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

type Notification = {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
};

export default function Notifications() {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        // 🔔 Later replace this with backend API
        setNotifications([
            {
                id: "1",
                title: "Security Alert",
                message: "New login detected on your account.",
                time: "2 mins ago",
                read: false,
            },
            {
                id: "2",
                title: "Risk Warning",
                message: "Your liabilities exceed 60% of your income.",
                time: "1 hour ago",
                read: false,
            },
            {
                id: "3",
                title: "Tip",
                message: "Reducing EMI by 10% improves financial safety.",
                time: "Yesterday",
                read: true,
            },
        ]);
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) =>
                n.id === id ? { ...n, read: true } : n
            )
        );
    };

    const renderItem = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[
                styles.card,
                !item.read && styles.unreadCard,
            ]}
            onPress={() => markAsRead(item.id)}
        >
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                {!item.read && <View style={styles.dot} />}
            </View>

            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{item.time}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.root}>
            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.back}>‹</Text>
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Notifications</Text>
                <View style={{ width: 24 }} />
            </View>

            {notifications.length === 0 ? (
                <Text style={styles.empty}>No notifications yet</Text>
            ) : (
                <FlatList
                    data={notifications}
                    keyExtractor={(item) => item.id}
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
        marginTop: 6,
        fontSize: 14,
        lineHeight: 20,
    },

    time: {
        color: "#9aa8a6",
        marginTop: 8,
        fontSize: 12,
    },
});
