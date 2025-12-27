import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Alert,
    Animated,
    ScrollView,
} from "react-native";
import { saveLiability, getLiabilities } from "@/utils/liabilities";

const { width } = Dimensions.get("window");

export default function Liability() {
    const fade = useRef(new Animated.Value(0)).current;

    const [loanName, setLoanName] = useState("");
    const [loanAmount, setLoanAmount] = useState("");
    const [interest, setInterest] = useState("");
    const [months, setMonths] = useState("");
    const [salary, setSalary] = useState("");

    const [details, setDetails] = useState<any>(null);
    const [saved, setSaved] = useState<any[]>([]);
    const [selected, setSelected] = useState<any | null>(null);

    /* ---------------- LOAD SAVED LIABILITIES ---------------- */
    useEffect(() => {
        getLiabilities().then(setSaved);
    }, []);

    const animateIn = () => {
        fade.setValue(0);
        Animated.timing(fade, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    /* ---------------- ANALYZE EMI ---------------- */
    const analyze = () => {
        if (!loanName || !loanAmount || !interest || !months || !salary) {
            Alert.alert("Missing Info", "Please fill all fields");
            return;
        }

        const P = Number(loanAmount);
        const r = Number(interest) / 12 / 100;
        const n = Number(months);
        const sal = Number(salary);

        const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const percent = (emi / sal) * 100;

        let message =
            percent > 45
                ? "❌ Critical risk — avoid this loan"
                : percent > 35
                    ? "⚠️ Very risky — reconsider"
                    : percent > 25
                        ? "😕 Risky — reduce EMI"
                        : percent > 15
                            ? "🙂 Fair — manageable"
                            : "🟢 Safe & healthy";

        setDetails({
            emi: Math.round(emi),
            percent: percent.toFixed(1),
            message,
        });

        animateIn();
    };

    /* ---------------- SAVE LIABILITY ---------------- */
    const handleSave = async () => {
        if (!details) return;

        await saveLiability({
            name: loanName,
            amount: Number(loanAmount),
            interest: Number(interest),
            months: Number(months),
            salary: Number(salary),
            emi: details.emi,
            riskPercent: Number(details.percent),
        });

        const all = await getLiabilities();
        setSaved(all);

        Alert.alert("Saved", "Liability added successfully");

        setLoanName("");
        setLoanAmount("");
        setInterest("");
        setMonths("");
        setSalary("");
        setDetails(null);
    };

    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 120 }}>
            <View style={styles.glow} />

            {/* HEADER */}
            <Text style={styles.header}>Liability Analyzer</Text>
            <Text style={styles.sub}>EMI calculation & risk evaluation</Text>

            {/* INPUT CARD */}
            <View style={styles.card}>
                <Field label="Loan Name" value={loanName} onChange={setLoanName} />
                <Field label="Loan Amount (₹)" value={loanAmount} onChange={setLoanAmount} numeric />
                <Field label="Interest Rate (%)" value={interest} onChange={setInterest} numeric />
                <Field label="Duration (Months)" value={months} onChange={setMonths} numeric />
                <Field label="Monthly Salary (₹)" value={salary} onChange={setSalary} numeric />

                <TouchableOpacity style={styles.btnPrimary} onPress={analyze}>
                    <Text style={styles.btnText}>Analyze Liability</Text>
                </TouchableOpacity>

                {details && (
                    <Animated.View style={[styles.resultCard, { opacity: fade }]}>
                        <Text style={styles.resultTitle}>Analysis Result</Text>

                        <Text style={styles.resultRow}>
                            EMI: <Text style={styles.highlight}>₹{details.emi}</Text>
                        </Text>

                        <Text style={styles.resultRow}>
                            Salary Used:{" "}
                            <Text style={styles.highlight}>{details.percent}%</Text>
                        </Text>

                        <Text style={styles.risk}>{details.message}</Text>

                        <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                            <Text style={styles.saveText}>Save Liability</Text>
                        </TouchableOpacity>
                    </Animated.View>
                )}
            </View>

            {/* SAVED LIABILITIES */}
            {saved.length > 0 && (
                <View style={styles.savedWrap}>
                    <Text style={styles.savedTitle}>Saved Liabilities</Text>

                    {saved.map((item) => {
                        const riskColor =
                            item.riskPercent > 45
                                ? "#ff5c5c"
                                : item.riskPercent > 30
                                    ? "#ffb84d"
                                    : "#00d48a";

                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.liabilityCard}
                                onPress={() =>
                                    setSelected(selected?.id === item.id ? null : item)
                                }
                            >
                                <View style={styles.liabilityTop}>
                                    <Text style={styles.liabilityName}>{item.name}</Text>
                                    <View
                                        style={[
                                            styles.badge,
                                            { backgroundColor: riskColor + "22" },
                                        ]}
                                    >
                                        <Text style={[styles.badgeText, { color: riskColor }]}>
                                            {item.riskPercent}% risk
                                        </Text>
                                    </View>
                                </View>

                                <Text style={styles.liabilityEmi}>
                                    EMI: <Text style={styles.highlight}>₹{item.emi}</Text>
                                </Text>

                                {selected?.id === item.id && (
                                    <View style={styles.detailBox}>
                                        <DetailRow label="Loan Amount" value={`₹${item.amount}`} />
                                        <DetailRow label="Interest" value={`${item.interest}%`} />
                                        <DetailRow label="Duration" value={`${item.months} months`} />
                                        <DetailRow label="Salary" value={`₹${item.salary}`} />
                                    </View>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </ScrollView>
    );
}

/* ---------------- SMALL COMPONENTS ---------------- */

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

const DetailRow = ({ label, value }: any) => (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
        <Text style={{ color: "#9aa8a6", fontSize: 13 }}>{label}</Text>
        <Text style={{ color: "#e5fff6", fontWeight: "700" }}>{value}</Text>
    </View>
);

/* ---------------- STYLES ---------------- */

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

    card: {
        marginHorizontal: 20,
        backgroundColor: "#0f1a1a",
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.04)",
    },

    label: { color: "#9aa8a6", fontSize: 12, marginBottom: 6 },
    input: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        padding: 14,
        color: "#fff",
        fontSize: 15,
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

    resultCard: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 18,
        padding: 16,
        marginTop: 20,
    },
    resultTitle: {
        color: "#d5efe6",
        fontWeight: "800",
        fontSize: 16,
        marginBottom: 8,
    },
    resultRow: { color: "#cfe3dc", marginBottom: 4 },
    highlight: { color: "#00d48a", fontWeight: "800" },
    risk: {
        marginTop: 10,
        textAlign: "center",
        color: "#fff",
        fontWeight: "800",
    },

    btnSave: {
        marginTop: 14,
        backgroundColor: "rgba(0,212,138,0.15)",
        paddingVertical: 12,
        borderRadius: 14,
    },
    saveText: {
        textAlign: "center",
        color: "#00d48a",
        fontWeight: "800",
    },

    savedWrap: {
        marginTop: 28,
        marginHorizontal: 20,
    },
    savedTitle: {
        color: "#d5efe6",
        fontSize: 18,
        fontWeight: "800",
        marginBottom: 14,
    },

    liabilityCard: {
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
    },
    liabilityTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    liabilityName: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 16,
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 10,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: "800",
    },
    liabilityEmi: {
        color: "#cfe3dc",
        marginTop: 8,
    },
    detailBox: {
        marginTop: 12,
        backgroundColor: "rgba(0,0,0,0.25)",
        padding: 12,
        borderRadius: 12,
    },
});
