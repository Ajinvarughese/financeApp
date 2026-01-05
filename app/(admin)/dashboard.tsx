import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    TouchableOpacity,
} from "react-native";
import { LineChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

export default function AdminDashboard() {
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
            {/* HERO */}
            <View style={styles.hero}>
                <Text style={styles.heroTitle}>Admin Control Center</Text>
                <Text style={styles.heroSub}>
                    Real-time system overview & risk intelligence
                </Text>
            </View>

            {/* KPI STRIP */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.kpiRow}
            >
                <KPI title="Total Users" value="128" trend="+12%" />
                <KPI title="Active Today" value="42" trend="+6%" />
                <KPI title="High Risk" value="12" danger trend="+3%" />
                <KPI title="Total Assets" value="₹1.2 Cr" />
                <KPI title="Total Liabilities" value="₹82 L" />
            </ScrollView>

            {/* AI INSIGHT */}
            <View style={styles.aiCard}>
                <Text style={styles.aiTitle}>AI Risk Insight</Text>
                <Text style={styles.aiText}>
                    ⚠️ 9 users crossed the safe debt threshold this month.
                    {"\n"}AI suggests proactive alerts to prevent defaults.
                </Text>

                <TouchableOpacity style={styles.aiBtn}>
                    <Text style={styles.aiBtnText}>View High-Risk Users</Text>
                </TouchableOpacity>
            </View>

            {/* GROWTH CHART */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>User Growth Trend</Text>

                <LineChart
                    data={{
                        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
                        datasets: [{ data: [34, 52, 70, 92, 110, 128] }],
                    }}
                    width={width - 40}
                    height={220}
                    chartConfig={chartConfig}
                    bezier
                    style={styles.chart}
                />
            </View>

            {/* HIGH RISK USERS */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Critical Risk Users</Text>

                {["arun@mail.com", "megha@mail.com", "rohan@mail.com"].map(
                    (u, i) => (
                        <View key={i} style={styles.userRow}>
                            <View>
                                <Text style={styles.userEmail}>{u}</Text>
                                <Text style={styles.userSub}>
                                    Debt Ratio &gt; 65%
                                </Text>
                            </View>
                            <Text style={styles.critical}>CRITICAL</Text>
                        </View>
                    )
                )}
            </View>

            {/* ADMIN ACTIONS */}
            <View style={styles.actions}>
                <ActionBtn title="Manage Users" primary />
                <ActionBtn title="Send Alerts" />
                <ActionBtn title="System Reports" />
            </View>
        </ScrollView>
    );
}

/* ---------- COMPONENTS ---------- */

const KPI = ({ title, value, trend, danger }: any) => (
    <View style={[styles.kpiCard, danger && styles.kpiDanger]}>
        <Text style={styles.kpiTitle}>{title}</Text>
        <Text style={[styles.kpiValue, danger && { color: "#ff6b6b" }]}>
            {value}
        </Text>
        {trend && <Text style={styles.kpiTrend}>{trend}</Text>}
    </View>
);

const ActionBtn = ({ title, primary }: any) => (
    <TouchableOpacity
        style={[styles.actionBtn, primary && styles.actionPrimary]}
    >
        <Text
            style={[
                styles.actionText,
                primary && { color: "#041F1A" },
            ]}
        >
            {title}
        </Text>
    </TouchableOpacity>
);

/* ---------- CHART CONFIG ---------- */

const chartConfig = {
    backgroundGradientFrom: "#071013",
    backgroundGradientTo: "#071013",
    color: (opacity = 1) => `rgba(0,212,138,${opacity})`,
    labelColor: () => "#9aa8a6",
    propsForDots: {
        r: "4",
        strokeWidth: "2",
        stroke: "#00d48a",
    },
};

/* ---------- STYLES ---------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#071013",
        padding: 20,
    },

    hero: {
        marginBottom: 24,
    },

    heroTitle: {
        color: "#e5fff6",
        fontSize: 26,
        fontWeight: "900",
    },

    heroSub: {
        color: "#9aa8a6",
        marginTop: 6,
        fontSize: 14,
    },

    kpiRow: {
        marginBottom: 26,
    },

    kpiCard: {
        width: 150,
        marginRight: 14,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    kpiDanger: {
        borderColor: "#ff6b6b",
    },

    kpiTitle: {
        color: "#9aa8a6",
        fontSize: 12,
    },

    kpiValue: {
        color: "#00d48a",
        fontSize: 22,
        fontWeight: "900",
        marginTop: 6,
    },

    kpiTrend: {
        marginTop: 6,
        color: "#7fbda4",
        fontSize: 12,
        fontWeight: "700",
    },

    aiCard: {
        backgroundColor: "rgba(0,212,138,0.08)",
        borderRadius: 20,
        padding: 18,
        marginBottom: 30,
    },

    aiTitle: {
        color: "#00d48a",
        fontWeight: "900",
        fontSize: 16,
    },

    aiText: {
        color: "#d5efe6",
        marginTop: 8,
        lineHeight: 22,
    },

    aiBtn: {
        marginTop: 14,
        backgroundColor: "#00d48a",
        paddingVertical: 12,
        borderRadius: 14,
    },

    aiBtnText: {
        color: "#041F1A",
        textAlign: "center",
        fontWeight: "900",
    },

    section: {
        marginBottom: 30,
    },

    sectionTitle: {
        color: "#d5efe6",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 14,
    },

    chart: {
        borderRadius: 18,
    },

    userRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        backgroundColor: "rgba(255,255,255,0.04)",
        padding: 14,
        borderRadius: 14,
        marginBottom: 10,
    },

    userEmail: {
        color: "#e5fff6",
        fontWeight: "600",
    },

    userSub: {
        color: "#9aa8a6",
        fontSize: 12,
        marginTop: 2,
    },

    critical: {
        color: "#ff6b6b",
        fontWeight: "900",
    },

    actions: {
        marginTop: 10,
    },

    actionBtn: {
        borderWidth: 1,
        borderColor: "#00d48a",
        paddingVertical: 14,
        borderRadius: 16,
        marginBottom: 12,
    },

    actionPrimary: {
        backgroundColor: "#00d48a",
    },

    actionText: {
        color: "#00d48a",
        fontWeight: "800",
        textAlign: "center",
        fontSize: 16,
    },
});
