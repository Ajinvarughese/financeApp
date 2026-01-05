import { Stack } from "expo-router";

export default function ProfileLayout() {
    return (
        <Stack
            initialRouteName="index"   // 🔥 THIS FIXES IT
            screenOptions={{
                headerShown: false,
            }}
        />
    );
}
