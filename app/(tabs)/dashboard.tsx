import { extractUpiName } from "@/services/textFormat";
import {
    Asset,
    BankStatement,
    Liability,
    TransactionType,
} from "@/types/entity";
import { getBankStatement } from "@/utils/api";
import { fetchAssets } from "@/utils/assets";
import { getLiabilities } from "@/utils/liabilities";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";

const { width } = Dimensions.get("window");

/* ---------------- PIE CHART CARD ---------------- */

const PieChartCard = ({
    title,
    data,
    centerLabel,
}: {
    title: string;
    data: any[];
    centerLabel?: string;
}) => (
    <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>{title}</Text>

        <View style={{ alignItems: "center" }}>
            <PieChart
                data={data}
                width={width * 0.82}
                height={220}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="20"
                absolute
                hasLegend
                chartConfig={{
                    color: () => "#ffffff",
                }}
            />

            {centerLabel && (
                <View style={styles.pieCenter}>
                    <Text style={styles.pieCenterText}>{centerLabel}</Text>
                </View>
            )}
        </View>
    </View>
);

/* ---------------- HELPERS ---------------- */

// last 30 days filter
const getLast30DaysStatements = (statements: BankStatement[]) => {
    const now = new Date();
    const from = new Date();
    from.setDate(now.getDate() - 30);

    return statements.filter((s) => {
        const d = new Date(s.date);
        return d >= from && d <= now;
    });
};

// dynamic readable colors (HSL)
const generateColors = (
    count: number,
    saturation = 65,
    lightness = 55
) =>
    Array.from({ length: count }, (_, i) =>
        `hsl(${Math.round((360 / count) * i)}, ${saturation}%, ${lightness}%)`
    );
    

/* ---------------- DASHBOARD ---------------- */

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [assets, setAssets] = useState<Asset[]>([]);
    const [liabilities, setLiabilities] = useState<Liability[]>([]);
    const [bankStatement, setBankStatement] = useState<BankStatement[]>([]);

    useFocusEffect(
        useCallback(() => {
            load();
        }, [])
    );

    const load = async () => {
        setLoading(true);

        setAssets(await fetchAssets());
        setLiabilities(await getLiabilities());

        const statements = await getBankStatement();

        const formatted = statements.map((s) => ({
            ...s,
            particular: extractUpiName(s.particular),
        }));

        setBankStatement(formatted);
        setLoading(false);
    };

    const getTopNWithOthers = (data: BankStatement[], topN: number) => {
        if (data.length <= topN) {
            return { top: data, othersCount: 0, othersAmount: 0 };
        }

        const sorted = [...data].sort((a, b) => b.amount - a.amount);
        const top = sorted.slice(0, topN);
        const rest = sorted.slice(topN);

        return {
            top,
            othersCount: rest.length,
            othersAmount: rest.reduce((s, t) => s + t.amount, 0),
        };
    };

    /* ---------------- ASSET / LIABILITY CALCS ---------------- */

    const totalIncome = assets.reduce(
        (s, a) => s + Number(a.income || 0),
        0
    );
    const totalEmi = liabilities.reduce(
        (s, l) => s + Number(l.emi || 0),
        0
    );

    const netWorth = totalIncome - totalEmi;
    const emiRatio =
        totalIncome > 0
            ? ((totalEmi / totalIncome) * 100).toFixed(1)
            : "0";

    const riskLevel =
        Number(emiRatio) > 40
            ? { label: "High Risk", color: "#ff6b6b" }
            : Number(emiRatio) > 25
            ? { label: "Moderate", color: "#ffb84d" }
            : { label: "Healthy", color: "#00d48a" };

    const assetTrend = assets.slice(0, 6).map((a) => a.income || 0);
    const liabilityTrend = liabilities.slice(0, 6).map((l) => l.emi || 0);
        console.log(liabilityTrend);
    /* ---------------- BANK STATEMENT (LAST 30 DAYS) ---------------- */

    const last30Days = getLast30DaysStatements(bankStatement);

    const incomeRaw = last30Days.filter(
        (t) => t.transactionType === TransactionType.CREDIT
    );
    const expenseRaw = last30Days.filter(
        (t) => t.transactionType === TransactionType.DEBIT
    );

    const incomeData = getTopNWithOthers(incomeRaw, 5);
    const expenseData = getTopNWithOthers(expenseRaw, 5);

    const incomeColors = generateColors(
        incomeData.top.length +
            (incomeData.othersCount > 0 ? 1 : 0)
    );

    const incomeFromBank = incomeRaw.reduce(
        (s, t) => s + t.amount,
        0
    );
    const expenseFromBank = expenseRaw.reduce(
        (s, t) => s + t.amount,
        0
    );

    const incomePieData = [
        ...incomeData.top.map((t, i) => ({
            name:
                t.particular.length > 12
                    ? t.particular.slice(0, 12) + "…"
                    : t.particular,
            amount: t.amount,
            color: incomeColors[i],
            legendFontColor: "#9aa8a6",
            legendFontSize: 12,
        })),
        ...(incomeData.othersCount > 0
            ? [
                  {
                      name: `+${incomeData.othersCount} more`,
                      amount: incomeData.othersAmount,
                      color: incomeColors[incomeData.top.length],
                      legendFontColor: "#9aa8a6",
                      legendFontSize: 12,
                  },
              ]
            : []),
    ];

    const expenseColors = generateColors(
        expenseData.top.length +
            (expenseData.othersCount > 0 ? 1 : 0),
        65,
        50
    );

    const expensePieData = [
        ...expenseData.top.map((t, i) => ({
            name:
                t.particular.length > 12
                    ? t.particular.slice(0, 12) + "…"
                    : t.particular,
            amount: t.amount,
            color: expenseColors[i],
            legendFontColor: "#9aa8a6",
            legendFontSize: 12,
        })),
        ...(expenseData.othersCount > 0
            ? [
                  {
                      name: `+${expenseData.othersCount} more`,
                      amount: expenseData.othersAmount,
                      color: expenseColors[expenseData.top.length],
                      legendFontColor: "#9aa8a6",
                      legendFontSize: 12,
                  },
              ]
            : []),
    ];

    const combinedPieData = [
        {
            name: "Income",
            amount: incomeFromBank,
            color: "#00d48a",
            legendFontColor: "#9aa8a6",
            legendFontSize: 12,
        },
        {
            name: "Expense",
            amount: expenseFromBank,
            color: "#ff6b6b",
            legendFontColor: "#9aa8a6",
            legendFontSize: 12,
        },
    ];
    
    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#00d48a" />
            </View>
        );
    }

    return (
            <ScrollView
                style={styles.root}
                contentContainerStyle={{ paddingBottom: 120 }}
            >
                <View style={styles.glow} />

                <Text style={styles.title}>Financial Overview</Text>
                <Text style={styles.subtitle}>
                    Your money, clearly explained
                </Text>

                {/* NET WORTH */}
                <View style={styles.netCard}>
                    <Text style={styles.netLabel}>Net Balance</Text>
                    <Text
                        style={[
                            styles.netValue,
                            { color: netWorth > -1 ? "#00d48a" : "#ff6b6b" }
                        ]}
                        >
                        ₹{netWorth.toLocaleString()}
                        </Text>

                    <View style={styles.riskRow}>
                        <Text style={styles.riskText}>
                            EMI Usage: {emiRatio}%
                        </Text>
                        <View
                            style={[
                                styles.riskBadge,
                                {
                                    backgroundColor:
                                        riskLevel.color + "22",
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.riskBadgeText,
                                    { color: riskLevel.color },
                                ]}
                            >
                                {riskLevel.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* STATS */}
                <View style={styles.statsRow}>
                    <StatCard
                        label="Monthly Income"
                        value={totalIncome}
                        color="#00d48a"
                    />
                    <StatCard
                        label="Total EMI"
                        value={totalEmi}
                        color="#ff6b6b"
                    />
                </View>

                {/* LINE GRAPH */}
                <View style={styles.graphCard}>
                    <Text style={styles.graphTitle}>
                        Asset Graph
                    </Text>

                    <LineChart
                        data={{
                            labels: ["1", "2", "3", "4", "5", "6"],
                            datasets: [
                                {
                                    data: [0, ...assetTrend],
                                    color: () => "#00d48a",
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

                <View style={styles.graphCard}>
                    <Text style={styles.graphTitle}>
                        Liability Graph
                    </Text>

                    <LineChart
                        data={{
                            labels: ["1", "2", "3", "4", "5", "6"],
                            datasets: [
                                {
                                    data: [0, ...liabilityTrend],
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

                {/* PIE CHARTS */}
                <PieChartCard
                    title="Income Distribution (Last 30 Days)"
                    data={incomePieData}
                    centerLabel={`₹${incomeFromBank.toLocaleString()}`}
                />

                <PieChartCard
                    title="Expense Distribution (Last 30 Days)"
                    data={expensePieData}
                    centerLabel={`₹${expenseFromBank.toLocaleString()}`}
                />

                <PieChartCard
                    title="Income vs Expense"
                    data={combinedPieData}
                    centerLabel="Summary"
                />

                <TouchableOpacity style={styles.btnPrimary} onPress={}>
                    <Text style={styles.btnText}>Upload bank statement</Text>
                </TouchableOpacity>
            </ScrollView>
    );
}

const StatCard = ({ label, value, color }: any) => (
    <View style={[styles.statCard, { borderColor: color }]}>
        <Text style={[styles.statValue, { color }]}>
            ₹{value.toLocaleString()}
        </Text>
        <Text style={styles.statLabel}>{label}</Text>
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#071013",
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
    netLabel: { color: "#9aa8a6", fontSize: 13 },
    netValue: {
        fontSize: 30,
        fontWeight: "900",
        marginTop: 6,
    },
    riskRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    riskText: { color: "#9aa8a6" },
    riskBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    riskBadgeText: { fontWeight: "800", fontSize: 12 },
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
    statLabel: { color: "#9aa8a6", fontSize: 13 },
    statValue: {
        fontSize: 20,
        fontWeight: "900",
        marginBottom: 4,
    },
    graphCard: {
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 22,
        padding: 16,
        marginBottom: 22,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
    },
    pieCenter: {
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: [{ translateX: -45 }, { translateY: -18 }],
        alignItems: "center",
    },
    pieCenterText: {
        color: "#ffffff",
        fontWeight: "900",
        fontSize: 14,
    },
    graphTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 10,
    },
});