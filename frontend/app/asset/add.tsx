import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
    Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { saveAsset } from "@/utils/assets";

const { width } = Dimensions.get("window");

export default function AddAsset() {
    const router = useRouter();

    const [job, setJob] = useState("");
    const [salary, setSalary] = useState("");
    const [expenses, setExpenses] = useState("");
    const [debt, setDebt] = useState("");
    const [notes, setNotes] = useState("");

    const handleSave = async () => {
        if (!job || !salary || !expenses) {
            Alert.alert("Missing details", "Please fill all required fields");
            return;
        }

        await saveAsset({
            job,
            salary: Number(salary),
            expenses: Number(expenses),
            debt: Number(debt || 0),
            notes,
        });

        Alert.alert("Success", "Asset saved successfully");
        router.back();
    };

    return (
        <View style={styles.root}>
            {/* Glow */}
            <View style={styles.glow} pointerEvents="none" />

            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <Text style={styles.header}>Add Financial Asset</Text>
                <Text style={styles.subHeader}>
                    Job, income & commitments for AI analysis
                </Text>

                <View style={styles.card}>
                    {/* JOB */}
                    <Field
                        label="Job / Income Source"
                        placeholder="e.g. Software Engineer"
                        value={job}
                        onChangeText={setJob}
                    />

                    {/* SALARY */}
                    <Field
                        label="Monthly Salary (₹)"
                        placeholder="Enter your salary"
                        keyboardType="numeric"
                        value={salary}
                        onChangeText={setSalary}
                    />

                    {/* EXPENSES */}
                    <Field
                        label="Monthly Expenses (₹)"
                        placeholder="Rent, food, bills"
                        keyboardType="numeric"
                        value={expenses}
                        onChangeText={setExpenses}
                    />

                    {/* DEBT */}
                    <Field
                        label="Monthly EMI / Debt (₹)"
                        placeholder="Loans, credit cards"
                        keyboardType="numeric"
                        value={debt}
                        onChangeText={setDebt}
                    />

                    {/* NOTES */}
                    <View style={{ marginBottom: 18 }}>
                        <Text style={styles.label}>Notes (optional)</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Bonuses, variable income, future plans"
                            placeholderTextColor="#7f9f94"
                            multiline
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>

                    {/* ACTIONS */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => router.back()}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.saveBtn}
                            onPress={handleSave}
                        >
                            <Text style={styles.saveText}>Save Asset</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* INFO */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        This information is securely stored and used to calculate
                        financial health, risk scores, and AI recommendations.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

/* ---------------- SMALL COMPONENT ---------------- */

const Field = ({ label, ...props }: any) => (
    <View style={{ marginBottom: 16 }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            {...props}
            style={styles.input}
            placeholderTextColor="#7f9f94"
        />
    </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#071013",
        paddingTop: 30,
    },

    glow: {
        position: "absolute",
        top: -120,
        right: -100,
        width: width * 0.9,
        height: width * 0.9,
        borderRadius: width,
        backgroundColor: "rgba(0,212,138,0.06)",
    },

    header: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "900",
        paddingHorizontal: 20,
    },

    subHeader: {
        color: "#9aa8a6",
        paddingHorizontal: 20,
        marginTop: 6,
        marginBottom: 20,
    },

    card: {
        marginHorizontal: 20,
        backgroundColor: "#0f1a1a",
        borderRadius: 20,
        padding: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.03)",
    },

    label: {
        color: "#9aa8a6",
        fontSize: 12,
        marginBottom: 6,
    },

    input: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 14,
        padding: 14,
        color: "#fff",
        fontSize: 15,
    },

    textArea: {
        height: 90,
        textAlignVertical: "top",
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },

    cancelBtn: {
        paddingVertical: 12,
    },

    cancelText: {
        color: "#9aa8a6",
        fontWeight: "700",
    },

    saveBtn: {
        backgroundColor: "#00d48a",
        paddingVertical: 12,
        paddingHorizontal: 28,
        borderRadius: 14,
    },

    saveText: {
        color: "#061014",
        fontWeight: "900",
        fontSize: 15,
    },

    infoBox: {
        marginTop: 20,
        marginHorizontal: 20,
        backgroundColor: "rgba(255,255,255,0.03)",
        padding: 14,
        borderRadius: 14,
    },

    infoText: {
        color: "#9aa8a6",
        fontSize: 13,
        lineHeight: 18,
    },
});
