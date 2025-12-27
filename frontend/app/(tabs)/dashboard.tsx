import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

import { getAssets } from "@/utils/assets";
import { getLiabilities } from "@/utils/liabilities";

const { width } = Dimensions.get("window");

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<any[]>([]);
    const [liabilities, setLiabilities] = useState<any[]>([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        const a = await getAssets();
        const l = await getLiabilities();
        setAssets(a);
        setLiabilities(l);
        setLoading(false);
    };

    /* ---------------- CALCULATIONS ---------------- */

    const totalIncome = assets.reduce(
        (sum, a) => sum + Number(a.salary || 0),
        0
    );

    const totalEmi = liabilities.reduce(
        (sum, l) => sum + Number(l.emi || 0),
        0
    );

    const netWorth = totalIncome - totalEmi;

    const emiRatio =
        totalIncome > 0 ? ((totalEmi / totalIncome) * 100).toFixed(1) : "0";

    const riskLevel =
        Number(emiRatio) > 40
            ? { label: "High Risk", color: "#ff6b6b" }
            : Number(emiRatio) > 25
                ? { label: "Moderate", color: "#ffb84d" }
                : { label: "Healthy", color: "#00d48a" };

    const assetTrend = assets.slice(0, 6).map((a) => a.salary || 0);
    const liabilityTrend = liabilities.slice(0, 6).map((l) => l.emi || 0);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#00d48a" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>
            {/* Glow */}
            <View style={styles.glow} />

            <Text style={styles.title}>Financial Overview</Text>
            <Text style={styles.subtitle}>Your money, clearly explained</Text>

            {/* NET WORTH */}
            <View style={styles.netCard}>
                <Text style={styles.netLabel}>Net Balance</Text>
                <Text style={styles.netValue}>₹{netWorth.toLocaleString()}</Text>

                <View style={styles.riskRow}>
                    <Text style={styles.riskText}>
                        EMI Usage: {emiRatio}%
                    </Text>
                    <View
                        style={[
                            styles.riskBadge,
                            { backgroundColor: riskLevel.color + "22" },
                        ]}
                    >
                        <Text style={[styles.riskBadgeText, { color: riskLevel.color }]}>
                            {riskLevel.label}
                        </Text>
                    </View>
                </View>
            </View>

            {/* STATS */}
            <View style={styles.statsRow}>
                <StatCard label="Monthly Income" value={totalIncome} color="#00d48a" />
                <StatCard label="Total EMI" value={totalEmi} color="#ff6b6b" />
            </View>

            {/* GRAPH */}
            {(assetTrend.length > 0 || liabilityTrend.length > 0) && (
                <View style={styles.graphCard}>
                    <Text style={styles.graphTitle}>Income vs Liabilities</Text>

                    <LineChart
                        data={{
                            labels: ["1", "2", "3", "4", "5", "6"],
                            datasets: [
                                {
                                    data: assetTrend.length ? assetTrend : [0, 0, 0, 0, 0, 0],
                                    color: () => "#00d48a",
                                },
                                {
                                    data: liabilityTrend.length ? liabilityTrend : [0, 0, 0, 0, 0, 0],
                                    color: () => "#ff6b6b",
                                },
                            ],
                        }}
                        width={width * 0.88}
                        height={220}
                        chartConfig={{
                            backgroundGradientFrom: "#071013",
                            backgroundGradientTo: "#071013",
                            color: () => "#9aa8a6",
                            propsForDots: { r: "4" },
                        }}
                        bezier
                        style={{ borderRadius: 16 }}
                    />
                </View>
            )}

            {/* RECENT ASSETS */}
            <Section title="Income Sources">
                {assets.slice(0, 3).map((a) => (
                    <Row
                        key={a.id}
                        title={a.job}
                        value={`₹${a.salary}`}
                        color="#00d48a"
                    />
                ))}
            </Section>

            {/* RECENT LIABILITIES */}
            <Section title="Active Liabilities">
                {liabilities.slice(0, 3).map((l) => (
                    <Row
                        key={l.id}
                        title={l.name}
                        value={`₹${l.emi}/month`}
                        color={
                            l.riskPercent > 40
                                ? "#ff6b6b"
                                : l.riskPercent > 25
                                    ? "#ffb84d"
                                    : "#00d48a"
                        }
                    />
                ))}
            </Section>
        </ScrollView>
    );
}

/* ---------------- COMPONENTS ---------------- */

const StatCard = ({ label, value, color }: any) => (
    <View style={[styles.statCard, { borderColor: color }]}>
        <Text style={[styles.statValue, { color }]}>
            ₹{value.toLocaleString()}
        </Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const Section = ({ title, children }: any) => (
    <View style={{ marginTop: 22 }}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {children.length === 0 && (
            <Text style={styles.empty}>No data available</Text>
        )}
        {children}
    </View>
);

const Row = ({ title, value, color }: any) => (
    <View style={styles.rowItem}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={[styles.rowValue, { color }]}>{value}</Text>
    </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#071013",
        paddingTop: 48,
        paddingHorizontal: 18,
    },
    loader: {
        flex: 1,
        backgroundColor: "#071013",
        justifyContent: "center",
        alignItems: "center",
    },
    glow: {
        position: "absolute",
        top: -120,
        right: -100,
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: "rgba(0,212,138,0.06)",
    },

    title: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "900",
    },
    subtitle: {
        color: "#9aa8a6",
        marginBottom: 18,
    },

    netCard: {
        backgroundColor: "#0f1a1a",
        borderRadius: 20,
        padding: 22,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.04)",
        marginBottom: 22,
    },
    netLabel: {
        color: "#9aa8a6",
        fontSize: 13,
    },
    netValue: {
        color: "#00d48a",
        fontSize: 30,
        fontWeight: "900",
        marginTop: 6,
    },
    riskRow: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    riskText: {
        color: "#9aa8a6",
        fontSize: 13,
    },
    riskBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    riskBadgeText: {
        fontWeight: "800",
        fontSize: 12,
    },

    statsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 24,
    },
    statCard: {
        width: "48%",
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        paddingVertical: 18,
        borderWidth: 1,
        alignItems: "center",
    },
    statLabel: {
        color: "#9aa8a6",
        fontSize: 13,
    },
    statValue: {
        fontSize: 20,
        fontWeight: "900",
        marginBottom: 4,
    },

    graphCard: {
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 20,
        padding: 14,
        marginBottom: 20,
    },
    graphTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
    },

    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 10,
    },
    empty: {
        color: "#9aa8a6",
        fontSize: 13,
    },

    rowItem: {
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    rowTitle: {
        color: "#d5efe6",
        fontSize: 15,
    },
    rowValue: {
        fontWeight: "900",
        fontSize: 15,
    },
});
