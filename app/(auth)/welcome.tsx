import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";

const { width, height } = Dimensions.get("window");

export default function Welcome() {
    const router = useRouter();

    return (
        <View style={styles.root}>
            {/* Glow background */}
            <View style={styles.glowTop} />
            <View style={styles.glowBottom} />

            {/* Logo */}
            <View style={styles.logoWrap}>
                <Image source={icons.logo} style={styles.logo} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={styles.title}>Welcome to</Text>
                <Text style={styles.brand}>Smart Finance</Text>

                <Text style={styles.subtitle}>
                    Track assets, manage liabilities, and make smarter
                    financial decisions with AI-powered insights.
                </Text>
            </View>

            {/* Action Card */}
            <View style={styles.card}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => router.replace("/(auth)/login")}
                >
                    <Text style={styles.primaryText}>Continue</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace("/(auth)/register")}
                >
                    <Text style={styles.secondaryText}>Create an account</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.replace("/")}
                    style={{ marginTop: 10 }}
                >
                    <Text style={styles.skipText}>Skip for now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#050B12",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 60,
    },

    /* Glows */
    glowTop: {
        position: "absolute",
        top: -120,
        width: width * 1.2,
        height: width * 1.2,
        borderRadius: width,
        backgroundColor: "#3FEDB7",
        opacity: 0.08,
    },
    glowBottom: {
        position: "absolute",
        bottom: -150,
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: "#3FEDB7",
        opacity: 0.06,
    },

    /* Logo */
    logoWrap: {
        marginTop: 20,
    },
    logo: {
        width: 68,
        height: 68,
        tintColor: "#3FEDB7",
    },

    /* Text content */
    content: {
        alignItems: "center",
        paddingHorizontal: 28,
    },
    title: {
        color: "#9AA8B6",
        fontSize: 18,
        marginBottom: 6,
    },
    brand: {
        color: "#FFFFFF",
        fontSize: 36,
        fontWeight: "900",
        marginBottom: 14,
    },
    subtitle: {
        color: "#A9BACB",
        fontSize: 15,
        textAlign: "center",
        lineHeight: 22,
    },

    /* Card */
    card: {
        width: width * 0.88,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 22,
        padding: 26,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },

    primaryBtn: {
        width: "100%",
        backgroundColor: "#3FEDB7",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginBottom: 16,
        shadowColor: "#3FEDB7",
        shadowOpacity: 0.35,
        shadowRadius: 12,
    },
    primaryText: {
        color: "#032F24",
        fontWeight: "900",
        fontSize: 17,
    },

    secondaryText: {
        color: "#3FEDB7",
        fontWeight: "800",
        fontSize: 15,
        marginBottom: 8,
    },

    skipText: {
        color: "#7D8FA4",
        fontSize: 13,
    },
});
