// app/_layout.tsx
import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "react-native";
import { UserRole } from "@/types/entity";
import { getUser } from "@/utils/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
    const router = useRouter();
    useEffect(() => {
        const redirectUser = async () => {
            if(await AsyncStorage.getItem("user")) {
                const user = await getUser(); 
                try {
                    if (user?.role === UserRole.USER) {
                        router.replace("/(tabs)");
                    }
                } catch (error) {
                    console.log(error)
                }
            } 
        };

        redirectUser();
        }, []);
    return (
        <>
            <StatusBar hidden />
            <Stack initialRouteName="index" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />

                {/* AUTH */}
                <Stack.Screen name="(auth)/welcome" />
                <Stack.Screen name="(auth)/login" />
                <Stack.Screen name="(auth)/register" />
                <Stack.Screen name="(auth)/forgot" />

                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(admin)" />
                
            </Stack>
        </>
    );
}
