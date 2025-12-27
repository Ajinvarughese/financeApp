// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
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

                {/* MAIN APP */}
                <Stack.Screen name="(tabs)" />
            </Stack>
        </>
    );
}
