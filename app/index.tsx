// app/index.tsx
import React, { useEffect } from "react";
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
import { UserRole } from "@/types/entity";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images"; // optional mock image
import { getUser } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function Landing() {
    const router = useRouter();
    
    const goAuth = () => router.push("/(auth)/welcome");

    useEffect(() => {
        const redirectUser = async () => {
            console.log(await AsyncStorage.getItem("user"))
            if(await AsyncStorage.getItem("user")) {
                const user = await getUser(); 
                try {
                    if (user?.role === UserRole.ADMIN) {
                        router.replace("/(admin)/dashboard");
                    } else {
                        router.replace("/(tabs)");
                    }
                } catch (error) {
                    console.log(error)
                }
            } 
        };

        redirectUser();
        }, []);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 80 }}
            showsVerticalScrollIndicator={false}
        >
            {/* ---------- HEADER ---------- */}
            <View style={styles.header}>
                <Image source={icons.logo} style={styles.logo} />
                <TouchableOpacity style={styles.loginBtn} onPress={goAuth}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>

            {/* ---------- HERO SECTION ---------- */}
            <View style={styles.hero}>
                <Text style={styles.title}>Control Your Wealth.</Text>
                <Text style={styles.titleAccent}>Without The Stress.</Text>

                <Text style={styles.subtitle}>
                    Track assets, reduce liabilities, boost savings and get trusted AI
                    financial guidance — all in one elegant dashboard.
                </Text>

                <TouchableOpacity style={styles.ctaPrimary} onPress={goAuth}>
                    <Text style={styles.ctaPrimaryText}>Get Started</Text>
                </TouchableOpacity>

                <Image
                    source={images.mokephone ?? images.bg}
                    style={styles.heroImage}
                    resizeMode="contain"
                />
            </View>

            {/* ---------- FEATURE GRID ---------- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>Why This App?</Text>

                {featureCard(
                    icons.wallet,
                    "Build Wealth",
                    "Store and track all your assets and investment growth."
                )}

                {featureCard(
                    icons.save,
                    "Cut Debt",
                    "Monitor loans, EMIs, credit and reduce financial pressure."
                )}

                {featureCard(
                    icons.analytics,
                    "AI Powered Advice",
                    "AI checks if a new liability is risky — before you decide."
                )}

                {featureCard(
                    icons.info,
                    "Clarity Dashboard",
                    "See your true net worth in seconds — clean and visual."
                )}
            </View>

            {/* ---------- BENEFITS ---------- */}
            <View style={styles.section}>
                <Text style={styles.sectionHeading}>Built For Real Life</Text>

                {bullet(
                    "Know when your finances are getting risky — before it happens."
                )}
                {bullet("Plan purchases, investments and future savings smartly.")}
                {bullet("One place for all money decisions — quick and secure.")}
            </View>

            {/* ---------- FINAL CTA ---------- */}
            <View style={{ marginTop: 40, alignItems: "center" }}>
                <TouchableOpacity style={styles.ctaSecondary} onPress={goAuth}>
                    <Text style={styles.ctaSecondaryText}>
                        Create Your Financial Future →
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

/* --------------------------------------- */
/* -------  Small Reusable UI ------------ */
/* --------------------------------------- */

const featureCard = (icon: any, title: string, desc: string) => (
    <View style={styles.featureCard}>
        <Image source={icon} style={styles.featureIcon} />
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDesc}>{desc}</Text>
    </View>
);

const bullet = (txt: string) => (
    <View style={styles.bulletRow}>
        <View style={styles.dot} />
        <Text style={styles.bulletText}>{txt}</Text>
    </View>
);

/* --------------------------------------- */
/* ---------------- STYLES --------------- */
/* --------------------------------------- */

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7F9FC",
    },

    /* Header */
    header: {
        paddingHorizontal: 22,
        paddingTop: 26,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: { width: 50, height: 40 },
    loginBtn: {
        paddingVertical: 6,
        paddingHorizontal: 16,
        backgroundColor: "#0D1B2A",
        borderRadius: 12,
    },
    loginText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },

    /* Hero */
    hero: {
        paddingHorizontal: 20,
        marginTop: 30,
        alignItems: "center",
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        color: "#0D1B2A",
        textAlign: "center",
    },
    titleAccent: {
        fontSize: 32,
        fontWeight: "900",
        color: "#16A34A",
        textAlign: "center",
        marginTop: -4,
    },
    subtitle: {
        marginTop: 12,
        color: "#52667A",
        textAlign: "center",
        fontSize: 15,
        width: "90%",
        lineHeight: 22,
    },
    ctaPrimary: {
        marginTop: 20,
        backgroundColor: "#16A34A",
        paddingVertical: 14,
        paddingHorizontal: 42,
        borderRadius: 16,
        elevation: 4,
    },
    ctaPrimaryText: {
        color: "#fff",
        fontSize: 17,
        fontWeight: "800",
    },
    heroImage: {
        width: width * 0.8,
        height: width * 0.8,
        marginTop: 24,
    },

    /* Sections */
    section: { marginTop: 36, paddingHorizontal: 20 },
    sectionHeading: {
        fontSize: 22,
        fontWeight: "900",
        color: "#0D1B2A",
        marginBottom: 18,
    },

    /* Features */
    featureCard: {
        backgroundColor: "#fff",
        padding: 18,
        borderRadius: 18,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 9,
        elevation: 3,
    },
    featureIcon: {
        width: 28,
        height: 28,
        tintColor: "#1B263B",
        marginBottom: 10,
    },
    featureTitle: {
        fontSize: 17,
        fontWeight: "700",
        color: "#0D1B2A",
    },
    featureDesc: {
        marginTop: 6,
        color: "#5B6E80",
        fontSize: 14,
        lineHeight: 20,
    },

    /* Bullet */
    bulletRow: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "flex-start",
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#0D1B2A",
        marginTop: 6,
        marginRight: 8,
    },
    bulletText: {
        flex: 1,
        color: "#44556A",
        fontSize: 14,
        lineHeight: 20,
    },

    /* Final CTA */
    ctaSecondary: {
        backgroundColor: "#0D1B2A",
        paddingVertical: 14,
        paddingHorizontal: 26,
        borderRadius: 16,
        elevation: 4,
    },
    ctaSecondaryText: {
        fontSize: 17,
        fontWeight: "800",
        color: "#fff",
    },
});
