// app/liabilities/detail.tsx
import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity, Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import useFetch from "@/services/usefetch";
import { fetchLiabilities } from "@/services/api";
import { icons } from "@/constants/icons";

export default function LiabilityDetail() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: liabilities, loading } = useFetch(() => fetchLiabilities({}));

    if (loading)
        return (
            <SafeAreaView className="bg-slate-100 flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#16A34A" />
            </SafeAreaView>
        );

    const liability = liabilities?.find((l: any) => String(l.id) === String(id));

    if (!liability)
        return (
            <SafeAreaView className="bg-slate-100 flex-1 items-center justify-center">
                <Text className="text-slate-500">Liability not found</Text>
            </SafeAreaView>
        );

    return (
        <View className="bg-slate-100 flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                <View className="px-6 pt-6">
                    <Text className="text-2xl font-bold text-slate-900">{liability.name}</Text>
                    <Text className="text-slate-500 mt-1">Status: {liability.status}</Text>

                    <View className="mt-5 bg-white rounded-xl p-4 shadow border border-slate-100">
                        <Text className="text-xs text-slate-400">Total Amount</Text>
                        <Text className="text-3xl font-extrabold mt-1 text-slate-900">
                            ₹{liability.amount.toLocaleString()}
                        </Text>

                        <View className="mt-4 flex-row justify-between">
                            <Text className="text-slate-500">Monthly EMI</Text>
                            <Text className="text-slate-900 font-semibold">
                                ₹{(liability.monthly_installment ?? 0).toLocaleString()}
                            </Text>
                        </View>

                        <View className="mt-2 flex-row justify-between">
                            <Text className="text-slate-500">Due Date</Text>
                            <Text className="text-slate-900 font-semibold">{liability.dueDate ?? "—"}</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={router.back}
                className="absolute bottom-6 left-5 right-5 bg-lime-500 rounded-xl py-4 flex-row justify-center items-center"
            >
                <Image source={icons.arrow} className="w-5 h-5 mr-2 rotate-180" tintColor="#fff" />
                <Text className="text-white font-semibold">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
}
