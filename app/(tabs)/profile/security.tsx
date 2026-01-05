import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function SecuritySettings() {
    const router = useRouter();

    const confirmAction = (title: string, message: string, action: () => void) => {
        Alert.alert(title, message, [
            { text: "Cancel", style: "cancel" },
            { text: "Confirm", style: "destructive", onPress: action },
        ]);
    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Security Settings</Text>

            {/* Change Password */}
            <TouchableOpacity
                style={styles.card}
                onPress={() => router.push("/")}
            >
                <Text style={styles.cardTitle}>Change Password</Text>
                <Text style={styles.desc}>
                    Update your account password for better security.
                </Text>
            </TouchableOpacity>

            {/* Deactivate Account */}
            <TouchableOpacity
                style={styles.card}
                onPress={() =>
                    confirmAction(
                        "Deactivate Account",
                        "Your account will be temporarily disabled. You can reactivate later.",
                        () => console.log("Account deactivated")
                    )
                }
            >
                <Text style={styles.cardTitle}>Deactivate Account</Text>
                <Text style={styles.desc}>
                    Temporarily disable your account for a few months.
                </Text>
            </TouchableOpacity>

            {/* Delete Account */}
            <TouchableOpacity
                style={[styles.card, styles.danger]}
                onPress={() =>
                    confirmAction(
                        "Delete Account",
                        "This action is permanent and cannot be undone.",
                        () => console.log("Account deleted")
                    )
                }
            >
                <Text style={[styles.cardTitle, styles.dangerText]}>
                    Delete Account
                </Text>
                <Text style={styles.desc}>
                    Permanently remove your account and all data.
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: "#071013",
        padding: 20,
    },
    title: {
        color: "#e5fff6",
        fontSize: 24,
        fontWeight: "900",
        marginBottom: 20,
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.05)",
        padding: 16,
        borderRadius: 14,
        marginBottom: 14,
    },
    danger: {
        borderWidth: 1,
        borderColor: "rgba(255,0,0,0.3)",
    },
    cardTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "800",
    },
    dangerText: {
        color: "#ff6b6b",
    },
    desc: {
        color: "#9aa8a6",
        fontSize: 13,
        marginTop: 6,
    },
});
