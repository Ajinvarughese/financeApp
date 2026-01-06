import { Tabs, useRouter } from "expo-router";
import { Image, Text, View, StyleSheet } from "react-native";
import { icons } from "@/constants/icons";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "@/utils/auth";
import { UserRole } from "@/types/entity";

const ACTIVE = "#00d48a";
const INACTIVE = "#6b7280";
const BG = "#0a0f14";

type IconProps = {
    focused: boolean;
    icon: any;
    label: string;
};

function TabIcon({ focused, icon, label }: IconProps) {
    
    return (
        <View style={styles.iconWrapper}>
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
                <Image
                    source={icon}
                    style={[
                        styles.icon,
                        { tintColor: focused ? ACTIVE : INACTIVE },
                    ]}
                />
            </View>

            {focused && <Text style={styles.label}>{label}</Text>}
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.home} label="Home" />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.view} label="Search" />
                    ),
                }}
            />

            <Tabs.Screen
                name="liability"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.detail} label="Records" />
                    ),
                }}
            />

            <Tabs.Screen
                name="dashboard"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.dash} label="Dashboard" />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.person} label="index" />
                    ),
                }}
            />
        </Tabs>
    );
}
const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: "rgba(10,15,20,0.92)",
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.06)",
        height: 72,
        paddingBottom: 10,
        paddingTop: 10,
    },

    iconWrapper: {
        alignItems: "center",
        justifyContent: "center",
        width: 72,
    },

    iconBox: {
        width: 42,
        height: 42,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
    },

    iconBoxActive: {
        backgroundColor: "rgba(0,212,138,0.15)",
        shadowColor: ACTIVE,
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
        transform: [{ translateY: -2 }],
    },

    icon: {
        width: 22,
        height: 22,
    },

    label: {
        marginTop: 4,
        fontSize: 11,
        fontWeight: "700",
        color: ACTIVE,
    },
});
