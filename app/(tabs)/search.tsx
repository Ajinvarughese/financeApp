import { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    LayoutAnimation,
    Platform,
    UIManager,
} from "react-native";

import Delete from "../../assets/icons/delete.png";

import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { deleteAsset, fetchAssets } from "@/utils/assets";
import { deleteLiability, getLiabilities } from "@/utils/liabilities";
import AIChat from "@/components/AIChat";
import { Asset, Liability, RiskClass } from "@/types/entity";
import Markdown from "react-native-markdown-display";

type Tab = "assets" | "liabilities" | "ai";

/* Enable animation on Android */
if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export default function Records() {
    const [activeTab, setActiveTab] = useState<Tab>("assets");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const loadData = async () => {
        if (activeTab === "ai") return;

        setLoading(true);
        try {
            if (activeTab === "assets") {
                setData(await fetchAssets());
            } else {
                setData((await getLiabilities()).reverse());
            }
        } catch {
            setData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const toggleExpand = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedId(expandedId === id ? null : id);
    };

    const handleDeleteAsset = async (id: number) => {
        await deleteAsset(id);
        loadData();
    };

    const handleDeleteLiability = async (id: number) => {
        await deleteLiability(id);
        loadData();
    };

    /* ---------------- ASSET CARD ---------------- */

    const renderAsset = (item: Asset) => {
        const savings = Number(item.income) - Number(item.expense);

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => toggleExpand(item.id)}
                activeOpacity={0.9}
            >
                <Text style={styles.cardTitle}>{item.name}</Text>

                <Text style={styles.cardSub}>
                    Income:{" "}
                    <Text style={styles.incomeText}>₹{item.income}</Text>
                </Text>

                {expandedId === item.id && (
                    <View style={styles.expandBox}>
                        <Row
                            label="Monthly Savings"
                            value={`₹${savings}`}
                            valueColor="#00d48a"
                        />
                        <Row
                            label="Expenses"
                            value={`-₹${item.expense}`}
                            valueColor="#ff4d4d"
                        />

                        {item.notes && (
                            <Text style={styles.notes}>{item.notes}</Text>
                        )}

                        <DeleteButton
                            onPress={() =>
                                handleDeleteAsset(Number(item.id))
                            }
                        />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    /* ---------------- LIABILITY CARD ---------------- */

    const renderLiability = (item: Liability) => {
        const status =
            item.riskClass === RiskClass.NOT_RECOMMENDED
                ? { label: "Not recommended", color: "#ff6b6b" }
                : item.riskClass === RiskClass.RISKY
                ? { label: "Risky", color: "#facc15" }
                : { label: "Safe", color: "#00d48a" };

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => toggleExpand(item.id)}
            >
                <View style={styles.cardTop}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <StatusBadge {...status} />
                </View>

                <Text style={styles.cardSub}>EMI ₹{item.emi}</Text>

                {expandedId === item.id && (
                    <View style={styles.expandBox}>
                        <Row label="Loan Amount" value={`₹${item.amount}`} />
                        <Row label="Interest" value={`${item.interest}%`} />
                        <Row
                            label="Duration"
                            value={`${item.months} months`}
                        />
                        <Row label="EMI" value={`₹${item.emi}`} />

                        {item.note && (
                            <Text style={styles.notes}>{item.note}</Text>
                        )}

                        <View style={styles.aiBox}>
                            <Text style={styles.aiTitle}>AI Analysis</Text>
                            <Markdown style={markdownStyles}>
                                {item.aiResponse}
                            </Markdown>
                        </View>

                        <DeleteButton
                            onPress={() =>
                                handleDeleteLiability(Number(item.id))
                            }
                        />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    const renderItem = ({ item }: any) => {
        if (activeTab === "assets") return renderAsset(item);
        if (activeTab === "liabilities") return renderLiability(item);
        return null;
    };

    return (
        <View style={styles.root}>
            <Image source={images.bg} style={styles.bg} />

            <View style={styles.container}>
                <View style={styles.header}>
                    <Image source={icons.logo} style={styles.logo} />
                    <Text style={styles.title}>Records</Text>
                </View>

                <View style={styles.tabs}>
                    {(["assets", "liabilities", "ai"] as Tab[]).map((tab) => (
                        <Text
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[
                                styles.tab,
                                activeTab === tab && styles.tabActive,
                            ]}
                        >
                            {tab.toUpperCase()}
                        </Text>
                    ))}
                </View>

                {activeTab === "ai" ? (
                    <AIChat />
                ) : (
                    <>
                        {loading && (
                            <ActivityIndicator size="large" color="#00d48a" />
                        )}

                        {!loading && data.length === 0 && (
                            <Text style={styles.empty}>
                                No {activeTab} added yet
                            </Text>
                        )}

                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{ paddingBottom: 140 }}
                        />
                    </>
                )}
            </View>
        </View>
    );
}

/* ---------------- REUSABLE COMPONENTS ---------------- */

const DeleteButton = ({ onPress }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.deleteBtn}>
        <Image source={Delete} style={{ width: 16, height: 16 }} />
        <Text style={styles.deleteText}>Delete</Text>
    </TouchableOpacity>
);

const StatusBadge = ({ label, color }: any) => (
    <View style={[styles.badge, { backgroundColor: color + "22" }]}>
        <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
);

const Row = ({ label, value, valueColor = "#e5fff6" }: any) => (
    <View style={styles.row}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={[styles.rowValue, { color: valueColor }]}>
            {value}
        </Text>
    </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#071013" },
    bg: { position: "absolute", width: "100%", height: "100%", opacity: 0.35 },

    container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },

    header: { alignItems: "center", marginBottom: 20 },
    logo: { width: 46, height: 42 },
    title: { color: "#d5efe6", fontSize: 20, fontWeight: "900" },

    tabs: {
        flexDirection: "row",
        backgroundColor: "rgba(255,255,255,0.08)",
        padding: 6,
        borderRadius: 14,
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        textAlign: "center",
        paddingVertical: 10,
        borderRadius: 10,
        color: "#9aa8a6",
        fontWeight: "800",
    },
    tabActive: { backgroundColor: "#00d48a", color: "#041F1A" },

    empty: { textAlign: "center", color: "#9aa8a6", marginTop: 40 },

    card: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 18,
        padding: 16,
        marginBottom: 14,
    },

    cardTop: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    cardTitle: { color: "#fff", fontWeight: "800", fontSize: 16 },
    cardSub: { color: "#cfe3dc", marginTop: 6 },
    incomeText: { color: "#00d48a", fontWeight: "800" },

    expandBox: {
        marginTop: 12,
        backgroundColor: "rgba(0,0,0,0.25)",
        padding: 12,
        paddingBottom: 52,
        borderRadius: 12,
        position: "relative",
    },

    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    rowLabel: { color: "#9aa8a6" },
    rowValue: { fontWeight: "700" },

    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
    badgeText: { fontSize: 12, fontWeight: "800" },

    notes: { marginTop: 8, color: "#9aa8a6" },

    aiBox: {
        marginTop: 12,
        backgroundColor: "rgba(0,212,138,0.08)",
        padding: 12,
        borderRadius: 12,
    },
    aiTitle: { color: "#00d48a", fontWeight: "800" },

    deleteBtn: {
        position: "absolute",
        bottom: 10,
        right: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 10,
        backgroundColor: "rgba(255,0,0,0.22)",
    },
    deleteText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
    },
});

const markdownStyles = {
    body: { color: "#e5fff6", fontSize: 14, lineHeight: 20 },
};