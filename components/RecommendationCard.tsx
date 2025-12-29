// components/RecommendationCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Theme } from "@/constants/theme";

type Rec = { id: any; title?: string; summary?: string; safety?: string; confidence?: number; [k: string]: any };

export default function RecommendationCard({ recommendation, onPress, theme }: { recommendation: Rec; onPress?: (r: Rec) => void; theme?: Theme | any }) {
    const T = theme ?? { accentPrimary: "#2B3AEB", accentWarn: "#FF6B5F", muted: "#6B7280", textPrimary: "#0F1724" };
    const safety = recommendation.safety || "Advisory";
    const sColor = safety.toLowerCase().includes("risk") ? T.accentWarn : T.accentPrimary;

    return (
        <TouchableOpacity activeOpacity={0.92} style={[rStyles.card, { borderColor: T.stroke || "rgba(16,24,40,0.06)", backgroundColor: T.surface || "#FFF" }]} onPress={() => onPress && onPress(recommendation)}>
            <View style={rStyles.row}>
                <Text style={[rStyles.title, { color: T.textPrimary }]} numberOfLines={2}>
                    {recommendation.title || "Recommendation"}
                </Text>
                <View style={[rStyles.pill, { borderColor: sColor }]}>
                    <Text style={[rStyles.pillText, { color: sColor }]}>{safety}</Text>
                </View>
            </View>

            {recommendation.summary ? <Text style={[rStyles.summary, { color: T.muted }]} numberOfLines={3}>{recommendation.summary}</Text> : null}
            {typeof recommendation.confidence === "number" ? <Text style={[rStyles.conf, { color: T.muted }]}>{Math.round(recommendation.confidence * 100)}% confidence</Text> : null}
        </TouchableOpacity>
    );
}

const rStyles = StyleSheet.create({
    card: {
        width: 260,
        borderRadius: 12,
        padding: 14,
        marginRight: 12,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 6,
    },
    row: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    title: { fontSize: 15, fontWeight: "800", flex: 1, marginRight: 8 },

    pill: { borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
    pillText: { fontWeight: "700", fontSize: 12 },

    summary: { marginTop: 8, fontSize: 13 },
    conf: { marginTop: 10, fontSize: 12, fontWeight: "700" },
});
