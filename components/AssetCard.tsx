// components/AssetCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Theme } from "@/constants/theme";

type Asset = { id: any; name?: string; value?: number; category?: string; thumbnail?: any; [k: string]: any };

export default function AssetCard({ asset, onPress, theme }: { asset: Asset; onPress?: (a: Asset) => void; theme?: Theme | any }) {
    const T = theme ?? {
        surface: "#F7F8FB",
        accentPrimary: "#2B3AEB",
        muted: "#6B7280",
        textPrimary: "#0F1724",
    };

    return (
        <TouchableOpacity activeOpacity={0.92} style={[styles.card, { backgroundColor: T.surface, borderColor: T.stroke || "rgba(16,24,40,0.06)" }]} onPress={() => onPress && onPress(asset)}>
            <View style={styles.thumbWrap}>
                {asset.thumbnail ? (
                    <Image source={asset.thumbnail} style={styles.thumb} />
                ) : (
                    <View style={styles.thumbPlaceholder}>
                        <Text style={[styles.thumbChar, { color: T.accentPrimary }]}>{(asset.category || "A").slice(0, 1)}</Text>
                    </View>
                )}
            </View>

            <View style={styles.body}>
                <Text style={[styles.title, { color: T.textPrimary }]} numberOfLines={1}>
                    {asset.name || "Untitled Asset"}
                </Text>
                <Text style={[styles.category, { color: T.muted }]}>{asset.category || "Uncategorized"}</Text>
                <Text style={[styles.value, { color: T.accentPrimary }]}>₹{Number(asset.value || 0).toLocaleString()}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 190,
        borderRadius: 12,
        padding: 12,
        borderWidth: 1,
        marginRight: 12,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 18,
        elevation: 6,
    },
    thumbWrap: { height: 92, borderRadius: 10, overflow: "hidden", marginBottom: 10, backgroundColor: "#EDEFF6" },
    thumb: { width: "100%", height: "100%", resizeMode: "cover" },
    thumbPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
    thumbChar: { fontSize: 26, fontWeight: "900" },

    body: {},
    title: { fontWeight: "800", fontSize: 14 },
    category: { fontSize: 12, marginTop: 6 },
    value: { fontSize: 16, marginTop: 8, fontWeight: "900" },
});
