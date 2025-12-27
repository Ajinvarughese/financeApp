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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser, logout } from "@/utils/auth";   // make sure this exists
import { useIsFocused } from "@react-navigation/native";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const { width } = Dimensions.get("window");

export default function Index() {
    const router = useRouter();
    const isFocused = useIsFocused();
    const [user, setUser] = useState<any>(null);

    // Load logged user
    useEffect(() => {
        const loadUser = async () => {
            const u = await getUser();
            setUser(u);
        };
        loadUser();
    }, [isFocused]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
            {/* -------- HEADER -------- */}
            <View style={styles.header}>
                <Image source={icons.logo} style={styles.logo} />

                {!user ? (
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => router.push("/(auth)/login")}
                    >
                        <Text style={styles.loginText}>Login</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        style={[styles.loginBtn, { backgroundColor: "#B91C1C" }]}
                        onPress={async () => {
                            await logout();
                            setUser(null);
                        }}
                    >
                        <Text style={styles.loginText}>Logout</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* -------- HERO SECTION -------- */}
            <View style={styles.hero}>
                <Text style={styles.title}>Your Finance. Simplified.</Text>

                <Text style={styles.subtitle}>
                    A smart way to track what you own, what you owe, and what’s next for
                    your financial journey. Manage assets, liabilities, and get AI-driven
                    insights — all inside a beautiful dashboard.
                </Text>

                <TouchableOpacity
                    style={styles.getStartedBtn}
                    onPress={() =>
                        user
                            ? router.push("/(tabs)")
                            : router.push("/(auth)/welcome")
                    }
                >
                    <Text style={styles.getStartedText}>
                        {user ? "Go to Dashboard" : "Get Started"}
                    </Text>
                </TouchableOpacity>

                {user && (
                    <Text style={styles.welcomeMsg}>
                        Welcome back, {user.name}! 🚀
                    </Text>
                )}

                <Image
                    source={images.mokephone || images.bg}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>

            {/* -------- WHAT YOU CAN DO -------- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>What You Can Do</Text>

                {featureCard(
                    icons.wallet,
                    "Track Assets",
                    "Record every investment, belonging, and valuable item. Stay updated with real-time value tracking."
                )}

                {featureCard(
                    icons.save,
                    "Monitor Liabilities",
                    "Loans, EMIs, monthly dues — get a structured view of everything you need to pay and when."
                )}

                {featureCard(
                    icons.analytics,
                    "AI Recommendations",
                    "Unsure about taking a new loan? Get instant AI-based safety checks and tailored suggestions."
                )}

                {featureCard(
                    icons.info,
                    "Clear Financial Insights",
                    "Understand your net worth, risk zones, and financial strength through beautiful visual summaries."
                )}
            </View>

            {/* -------- HOW IT WORKS -------- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>How It Works</Text>

                {bulletItem("Add your assets — savings, investments, valuables, and more.")}
                {bulletItem("Enter your liabilities — loans, EMIs, and ongoing commitments.")}
                {bulletItem("AI evaluates your risk based on your current finances.")}
                {bulletItem("Get suggestions to improve savings and reduce debt pressure.")}
                {bulletItem("Track progress every day with a clean dashboard and smart alerts.")}
            </View>

            {/* -------- WHY THIS APP? -------- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>Why Use This App?</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Managing money doesn't need to be stressful. This app gives you
                        clarity, control, and confidence in handling your finances.
                    </Text>

                    <Text style={styles.infoText}>
                        Whether you're planning a big purchase, evaluating monthly expenses,
                        or checking if a new liability is safe, this tool helps you make
                        smarter decisions with ease.
                    </Text>
                </View>
            </View>

            {/* -------- FINAL CTA -------- */}
            <View style={{ marginTop: 30, alignItems: "center" }}>
                <TouchableOpacity
                    style={styles.finalCta}
                    onPress={() =>
                        user
                            ? router.replace("/(tabs)/dashboard")
                            : router.push("/(auth)/login")
                    }

                >
                    <Text style={styles.finalCtaText}>
                        {user ? "Open Dashboard" : "Create Your Financial Future"}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* ------------------- REUSABLE COMPONENTS ------------------- */

const featureCard = (icon: any, title: string, desc: string) => (
    <View style={styles.featureCard}>
        <Image source={icon} style={styles.featureIcon} />
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
    </View>
);

const bulletItem = (text: string) => (
    <View style={styles.bulletRow}>
        <View style={styles.bulletDot} />
        <Text style={styles.bulletText}>{text}</Text>
    </View>
);

/* ------------------------- STYLES ------------------------- */

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F8FA" },

    /* Header */
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    logo: { width: 50, height: 40 },
    loginBtn: {
        paddingVertical: 6,
        paddingHorizontal: 14,
        borderRadius: 10,
        backgroundColor: "#0D1B2A",
    },
    loginText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },

    /* Hero */
    hero: { paddingHorizontal: 20, marginTop: 30, alignItems: "center" },
    title: {
        fontSize: 32,
        fontWeight: "800",
        color: "#0D1B2A",
        textAlign: "center",
    },
    subtitle: {
        marginTop: 12,
        color: "#52667A",
        textAlign: "center",
        fontSize: 15,
        width: "92%",
        lineHeight: 22,
    },
    heroImage: {
        width: width * 0.82,
        height: width * 0.85,
        marginTop: 26,
    },
    getStartedBtn: {
        marginTop: 20,
        paddingVertical: 12,
        paddingHorizontal: 40,
        borderRadius: 14,
        backgroundColor: "#1B263B",
        elevation: 4,
    },
    getStartedText: { color: "#fff", fontSize: 17, fontWeight: "800" },
    welcomeMsg: {
        color: "#0D1B2A",
        fontSize: 18,
        fontWeight: "700",
        marginTop: 14,
    },

    /* Features */
    section: { marginTop: 34, paddingHorizontal: 20 },
    sectionHeading: {
        fontSize: 22,
        fontWeight: "800",
        color: "#0D1B2A",
        marginBottom: 16,
    },
    featureCard: {
        backgroundColor: "#FFFFFF",
        padding: 18,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 3,
    },
    featureIcon: { width: 28, height: 28, marginBottom: 10 },
    featureTitle: { fontSize: 17, fontWeight: "700", color: "#0D1B2A" },
    featureDesc: {
        marginTop: 6,
        color: "#5B6E80",
        fontSize: 14,
        lineHeight: 21,
    },

    /* Bullet List */
    bulletRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
    bulletDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#0D1B2A", marginRight: 8, marginTop: 6 },
    bulletText: { flex: 1, color: "#4A5D70", fontSize: 14, lineHeight: 20 },

    /* Info Box */
    infoBox: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 14,
        elevation: 3,
    },
    infoText: { color: "#546173", fontSize: 14, lineHeight: 22, marginBottom: 10 },

    /* Final CTA */
    finalCta: {
        backgroundColor: "#0D1B2A",
        paddingVertical: 14,
        paddingHorizontal: 26,
        borderRadius: 14,
        elevation: 4,
    },
    finalCtaText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "800",
        textAlign: "center",
    },
});
