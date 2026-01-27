import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    ScrollView,
    Modal,
} from "react-native";
import Markdown from "react-native-markdown-display";
import {
    saveLiability,
    deleteLiability,
} from "@/utils/liabilities";
import { saveAsset } from "@/utils/assets";
import { enumToString } from "@/services/textFormat";
import { Asset, Liability } from "@/types/entity";

const { width } = Dimensions.get("window");

export default function Records() {
    /* ================= VISIBILITY ================= */
    const [showAsset, setShowAsset] = useState(true);
    const [showLiability, setShowLiability] = useState(false);

    /* ================= ASSET ================= */
    const [nameAsset, setNameAsset] = useState("");
    const [income, setIncome] = useState("");
    const [expense, setExpense] = useState("");
    const [assetNotes, setAssetNotes] = useState("");

    /* ================= LIABILITY ================= */
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [interest, setInterest] = useState("");
    const [months, setMonths] = useState("");
    const [emi, setEmi] = useState("");
    const [note, setNote] = useState("");

    /* ================= AI DIALOG ================= */
    const [showDialog, setShowDialog] = useState(false);
    const [savedLiability, setSavedLiability] = useState<Liability | null>(null);

    /* ================= TOGGLES ================= */
    const toggleAsset = () => {
        setShowAsset(!showAsset);
        if (!showAsset) setShowLiability(false);
    };

    const toggleLiability = () => {
        setShowLiability(!showLiability);
        if (!showLiability) setShowAsset(false);
    };

    /* ================= SAVE ASSET ================= */
    const handleSaveAsset = async () => {
        if (!nameAsset || !income) {
            Alert.alert("Missing Info", "Source & Income are required");
            return;
        }

        await saveAsset({
            name: nameAsset,
            income: Number(income),
            expense: expense ? Number(expense) : 0,
            notes: assetNotes,
        });

        Alert.alert("Saved", "Asset added successfully");

        setNameAsset("");
        setIncome("");
        setExpense("");
        setAssetNotes("");
    };

    /* ================= SAVE LIABILITY ================= */
    const handleSaveLiability = async () => {
        if (!name || !amount || !emi) {
            Alert.alert("Missing Info", "Name, Amount and EMI are required");
            return;
        }

        const res = await saveLiability({
            name,
            amount: Number(amount),
            interest: interest ? Number(interest) : undefined,
            months: months ? Number(months) : undefined,
            emi: Number(emi),
            note,
        });

        setSavedLiability(res);
        setShowDialog(true);

        setName("");
        setAmount("");
        setInterest("");
        setMonths("");
        setEmi("");
        setNote("");
    };

    /* ================= DELETE LIABILITY ================= */
    const handleDeleteLiability = async () => {
        if (!savedLiability?.id) return;

        await deleteLiability(Number(savedLiability.id));
        setShowDialog(false);
        setSavedLiability(null);
    };

    const getRiskBadgeStyle = (risk?: string) => {
        switch (risk) {
            case "NOT_RECOMMENDED":
                return {
                    bg: "rgba(255, 77, 77, 0.2)",   // red
                    text: "#ff4d4d",
                };
            case "RISKY":
                return {
                    bg: "rgba(255, 165, 0, 0.2)",   // orange
                    text: "#ffa500",
                };
            case "SAFE":
                return {
                    bg: "rgba(0, 212, 138, 0.2)",   // green
                    text: "#00d48a",
                };
            default:
                return {
                    bg: "rgba(255,255,255,0.15)",
                    text: "#fff",
                };
        }
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>
            <View style={styles.glow} />
            <Text style={styles.header}>Records</Text>
            <Text style={styles.sub}>Assets & Liabilities</Text>

            {/* ================= ASSETS ================= */}
            <View style={styles.wrapperBox}>
                <SectionHeader title="Assets" open={showAsset} onPress={toggleAsset} />

                {showAsset && (
                    <View style={styles.innerCard}>
                        <Field label="Income Source" value={nameAsset} onChange={setNameAsset} />
                        <Field label="Monthly Income (₹)" value={income} onChange={setIncome} numeric />
                        <Field label="Average Monthly Expenses on this asset (₹)" value={expense} onChange={setExpense} numeric />
                        <Field label="Notes (optional)" value={assetNotes} onChange={setAssetNotes} />
                        <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveAsset}>
                            <Text style={styles.btnText}>Save Asset</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* ================= LIABILITIES ================= */}
            <View style={styles.wrapperBox}>
                <SectionHeader title="Liabilities" open={showLiability} onPress={toggleLiability} />

                {showLiability && (
                    <View style={styles.innerCard}>
                        <Field label="Liability Name" value={name} onChange={setName} />
                        <Field label="Total Amount (₹)" value={amount} onChange={setAmount} numeric />
                        <Field label="Monthly EMI (₹)" value={emi} onChange={setEmi} numeric />
                        <Field label="Interest Rate (%)" value={interest} onChange={setInterest} numeric />
                        <Field label="Duration (months)" value={months} onChange={setMonths} numeric />
                        <Field label="Note" value={note} onChange={setNote} />

                        <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveLiability}>
                            <Text style={styles.btnText}>Save Liability</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            {/* ================= AI DIALOG ================= */}
            <Modal transparent visible={showDialog} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>AI Analysis</Text>

                        {(() => {
                            const riskStyle = getRiskBadgeStyle(savedLiability?.riskClass);

                            return (
                                <View style={[styles.badge, { backgroundColor: riskStyle.bg }]}>
                                    <Text style={[styles.badgeText, { color: riskStyle.text }]}>
                                        {enumToString(savedLiability?.riskClass)}
                                    </Text>
                                </View>
                            );
                        })()}

                        <Markdown style={markdownStyles}>
                            {savedLiability?.aiResponse}
                        </Markdown>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.keepBtn]}
                                onPress={() => {
                                    setShowDialog(false);
                                    setSavedLiability(null);
                                }}
                            >
                                <Text style={styles.modalBtnText}>Continue</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, styles.deleteBtn]}
                                onPress={handleDeleteLiability}
                            >
                                <Text style={styles.modalBtnText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

/* ================= COMPONENTS ================= */

const SectionHeader = ({ title, open, onPress }: any) => (
    <TouchableOpacity style={styles.sectionHeader} onPress={onPress}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionArrow}>{open ? "−" : "+"}</Text>
    </TouchableOpacity>
);

const Field = ({ label, value, onChange, numeric }: any) => (
    <View style={{ marginBottom: 14 }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChange}
            keyboardType={numeric ? "numeric" : "default"}
            placeholderTextColor="#7f9f94"
            style={styles.input}
        />
    </View>
);

/* ================= STYLES ================= */

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#071013", paddingTop: 40 },
    glow: {
        position: "absolute",
        top: -100,
        right: -80,
        width: width,
        height: width,
        borderRadius: width,
        backgroundColor: "rgba(0,212,138,0.06)",
    },
    header: {
        color: "#fff",
        fontSize: 28,
        fontWeight: "900",
        paddingHorizontal: 20,
    },
    sub: {
        color: "#9aa8a6",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    wrapperBox: {
        marginHorizontal: 20,
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 18,
        paddingVertical: 12,
        marginBottom: 24,
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    sectionTitle: { color: "#fff", fontSize: 16, fontWeight: "800" },
    sectionArrow: { color: "#00d48a", fontSize: 20, fontWeight: "900" },
    innerCard: {
        backgroundColor: "#0f1a1a",
        borderRadius: 16,
        padding: 16,
        margin: 10,
    },
    label: { color: "#9aa8a6", fontSize: 12, marginBottom: 6 },
    input: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        padding: 14,
        color: "#fff",
    },
    btnPrimary: {
        backgroundColor: "#00d48a",
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 10,
    },
    btnText: {
        textAlign: "center",
        color: "#061014",
        fontWeight: "900",
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "90%",
        backgroundColor: "#0f1a1a",
        borderRadius: 18,
        padding: 16,
    },
    modalTitle: {
        color: "#00d48a",
        fontSize: 18,
        fontWeight: "900",
        marginBottom: 10,
    },
    badge: {
        alignSelf: "flex-start",
        backgroundColor: "rgba(0,212,138,0.15)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
        marginBottom: 10,
    },
    badgeText: {
        color: "#00d48a",
        fontWeight: "800",
        fontSize: 12,
    },
    modalActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 14,
    },
    modalBtn: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        marginHorizontal: 6,
    },
    keepBtn: {
        backgroundColor: "#00d48a",
    },
    deleteBtn: {
        backgroundColor: "#ff5c5c",
    },
    modalBtnText: {
        textAlign: "center",
        color: "#061014",
        fontWeight: "900",
    },
});

const markdownStyles = {
    body: { color: "#e5fff6", fontSize: 14, lineHeight: 20 },
};
