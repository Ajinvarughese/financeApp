// components/LiabilityCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Theme } from "@/constants/theme";

type Liability = { id: any; name?: string; amount?: number; monthly_installment?: number; dueDate?: string; status?: string; [k: string]: any };

export default function LiabilityCard({ liability, onPress, theme }: { liability: Liability; onPress?: (l: Liability) => void; theme?: Theme | any }) {
    const T = theme ?? { muted: "#6B7280", textPrimary: "#0F1724", accentSecondary: "#06B6D4", accentWarn: "#FF6B5F" };
    const statusColor = liability.status === "Overdue" ? T.accentWarn : T.accentSecondary;

    return (
        <TouchableOpacity activeOpacity={0.92} style={[styles.card, { borderColor: T.stroke || "rgba(16,24,40,0.06)" }]} onPress={() => onPress && onPress(liability)}>
            <View style={styles.row}>
                <View style={styles.left}>
                    <Text style={[styles.title, { color: T.textPrimary }]} numberOfLines={1}>
                        {liability.name || "Loan / Liability"}
                    </Text>
                    <Text style={[styles.sub, { color: T.muted }]}>{liability.dueDate ? `Due: ${liability.dueDate}` : "No due date"}</Text>
                </View>

                <View style={styles.right}>
                    <Text style={[styles.amount, { color: T.textPrimary }]}>₹{Number(liability.amount || 0).toLocaleString()}</Text>
                    {liability.monthly_installment ? <Text style={[styles.emi, { color: T.muted }]}>EMI ₹{Number(liability.monthly_installment).toLocaleString()}</Text> : null}
                    <Text style={[styles.status, { color: statusColor }]}>{liability.status || "Status"}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 160,
        borderRadius: 12,
        padding: 12,
        marginHorizontal: 6,
        marginBottom: 12,
        backgroundColor: "#FFF",
        borderWidth: 1,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 4,
    },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    left: { flex: 1 },
    right: { alignItems: "flex-end", marginLeft: 8 },

    title: { fontSize: 14, fontWeight: "800" },
    sub: { fontSize: 12, marginTop: 6 },

    amount: { fontSize: 14, fontWeight: "900" },
    emi: { fontSize: 12, marginTop: 6 },
    status: { fontSize: 12, marginTop: 8, fontWeight: "700" },
});
