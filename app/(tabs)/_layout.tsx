import { Tabs } from "expo-router";
import { Image, Text, View, StyleSheet, Platform } from "react-native";
import { icons } from "@/constants/icons";

const ACCENT = "#00d48a";        // neon green from profile
const BG = "#071013";            // profile background
const MUTED = "#A8B5DB";

type TabIconProps = {
    focused: boolean;
    icon: any;
    title: string;
};

function TabIcon({ focused, icon, title }: TabIconProps) {
    if (focused) {
        return (
            <View style={styles.activeContainer}>
                <View style={styles.activeGlow} />
                <View style={styles.activePill}>
                    <Image source={icon} style={styles.activeIcon} />
                    <Text style={styles.activeLabel}>{title}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.inactiveWrap}>
            <Image source={icon} style={styles.inactiveIcon} />
        </View>
    );
}

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarItemStyle: styles.tabBarItem,
                tabBarStyle: styles.tabBar,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.home} title="Home" />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.view} title="Search" />
                    ),
                }}
            />

            <Tabs.Screen
                name="liability"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.detail} title="details" />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.person} title="Profile" />
                    ),
                }}
            />

            <Tabs.Screen
                name="dashboard"
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon focused={focused} icon={icons.dash} title="Dashboard" />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: BG,
        borderRadius: 999,
        marginHorizontal: 20,
        marginBottom: Platform.select({ ios: 34, android: 26, default: 32 }),
        height: 65,
        position: "absolute",
        left: 20,
        right: 20,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.05)",
        shadowColor: "#000",
        shadowOpacity: 0.35,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 8 },
        elevation: 12,
    },

    tabBarItem: {
        justifyContent: "center",
        alignItems: "center",
    },

    /* ACTIVE TAB ------------------------------- */
    activeContainer: {
        justifyContent: "center",
        alignItems: "center",
    },

    activeGlow: {
        position: "absolute",
        width: 95,
        height: 45,
        borderRadius: 999,
        backgroundColor: ACCENT,
        opacity: 0.25,
        filter: Platform.OS === "web" ? "blur(16px)" : undefined,
    },

    activePill: {
        flexDirection: "row",
        backgroundColor: ACCENT,
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 999,
        alignItems: "center",
        shadowColor: ACCENT,
        shadowOpacity: 0.4,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 4 },
        elevation: 12,
        transform: [{ translateY: -4 }],
    },

    activeIcon: {
        width: 20,
        height: 20,
        tintColor: BG,
    },

    activeLabel: {
        color: BG,
        fontSize: 14,
        fontWeight: "700",
        marginLeft: 8,
    },

    /* INACTIVE TAB ----------------------------- */
    inactiveWrap: {
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.6,
    },

    inactiveIcon: {
        width: 20,
        height: 20,
        tintColor: MUTED,
    },
});
