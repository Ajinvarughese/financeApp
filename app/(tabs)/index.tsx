import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { getUser, logout } from "@/utils/auth";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { User, UserRole } from "@/types/entity";

const { width } = Dimensions.get("window");

export default function Index() {
    const router = useRouter();

    const isFocused = useIsFocused();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const u = await getUser();
            setUser(u);
            if(!u) router.replace("../");
        };
        loadUser();
    }, [isFocused]);
    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
        >
            {/* HEADER */}
            <View style={styles.header}>
                <Image source={icons.logo} style={styles.logo} />

                {!user ? (
                    <TouchableOpacity
                        style={styles.outlineBtn}
                        onPress={() => router.push("/(auth)/login")}
                    >
                        <Text style={styles.outlineText}>Login</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.outlineBtn, { borderColor: "#EF4444" }]}
                        onPress={async () => {
                            await logout();
                            setUser(null);
                            router.replace("../");
                            window.location.reload();
                        }}
                    >
                        <Text style={[styles.outlineText, { color: "#EF4444" }]}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* HERO */}
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Control Your Money</Text>
                <Text style={styles.heroSubtitle}>
                    Track assets, manage liabilities, and make smarter decisions with
                    AI-powered financial insights.
                </Text>

                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() =>
                        user ? router.push("/(tabs)/dashboard") : router.push("/(auth)/welcome")
                    }
                >
                    <Text style={styles.primaryBtnText}>
                        {user ? "Go to Dashboard" : "Get Started"}
                    </Text>
                </TouchableOpacity>

                {user && (
                    <Text style={styles.welcome}>
                        Welcome back, {user.firstName + " " + user.lastName} 👋
                    </Text>
                )}

                <Image
                    source={images.mokephone || images.bg}
                    style={styles.heroImg}
                    resizeMode="contain"
                />
            </View>

            {/* FEATURES */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Core Features</Text>

                {featureCard(icons.wallet, "Assets", "Track savings, investments & valuables")}
                {featureCard(icons.save, "Liabilities", "Loans, EMIs & monthly commitments")}
                {featureCard(icons.analytics, "AI Risk Check", "Know if a loan is safe or risky")}
                {featureCard(icons.info, "Insights", "Net worth & financial health")}
            </View>

            {/* HOW IT WORKS */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>How It Works</Text>
                {bullet("Add assets & income")}
                {bullet("Add loans & expenses")}
                {bullet("AI evaluates your risk")}
                {bullet("Get actionable suggestions")}
            </View>

            {/* CTA */}
            <View style={styles.bottomCta}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() =>
                        user
                            ? router.replace("/(tabs)/dashboard")
                            : router.push("/(auth)/login")
                    }
                >
                    <Text style={styles.primaryBtnText}>
                        {user ? "Open Dashboard" : "Start Managing Finance"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ---------------- COMPONENTS ---------------- */

const featureCard = (icon: any, title: string, desc: string) => (
    <View style={styles.card}>
        <Image source={icon} style={styles.cardIcon} />
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
    </View>
);

const bullet = (text: string) => (
    <View style={styles.bulletRow}>
        <View style={styles.dot} />
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0B0F1A",
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 22,
    },
    logo: { width: 46, height: 38 },

    outlineBtn: {
        borderWidth: 1,
        borderColor: "#4F8CFF",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
    },
    outlineText: {
        color: "#4F8CFF",
        fontWeight: "700",
    },

    hero: {
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 40,
    },
    heroTitle: {
        fontSize: 34,
        fontWeight: "900",
        color: "#E5E7EB",
        textAlign: "center",
    },
    heroSubtitle: {
        marginTop: 12,
        color: "#9CA3AF",
        textAlign: "center",
        fontSize: 15,
        lineHeight: 22,
        width: "92%",
    },
    heroImg: {
        width: width * 0.8,
        height: width * 0.85,
        marginTop: 30,
    },

    primaryBtn: {
        marginTop: 22,
        backgroundColor: "#4F8CFF",
        paddingVertical: 14,
        paddingHorizontal: 36,
        borderRadius: 16,
    },
    primaryBtnText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
    },

    welcome: {
        marginTop: 14,
        color: "#22D3EE",
        fontSize: 16,
        fontWeight: "700",
    },

    section: {
        paddingHorizontal: 20,
        marginTop: 40,
    },
    sectionTitle: {
        color: "#E5E7EB",
        fontSize: 22,
        fontWeight: "800",
        marginBottom: 18,
    },

    card: {
        backgroundColor: "#12172A",
        padding: 18,
        borderRadius: 18,
        marginBottom: 14,
    },
    cardIcon: {
        width: 26,
        height: 26,
        marginBottom: 8,
    },
    cardTitle: {
        color: "#E5E7EB",
        fontSize: 16,
        fontWeight: "700",
    },
    cardDesc: {
        color: "#9CA3AF",
        fontSize: 14,
        marginTop: 6,
        lineHeight: 20,
    },

    bulletRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#4F8CFF",
        marginRight: 10,
        marginTop: 6,
    },
    bulletText: {
        flex: 1,
        color: "#9CA3AF",
        fontSize: 14,
        lineHeight: 20,
    },

    bottomCta: {
        marginTop: 30,
        alignItems: "center",
    },
});
