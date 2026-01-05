import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

export default function ChangePassword() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            return Alert.alert("Missing Fields", "Please fill all fields");
        }

        if (newPassword.length < 6) {
            return Alert.alert(
                "Weak Password",
                "New password must be at least 6 characters long"
            );
        }

        if (newPassword !== confirmPassword) {
            return Alert.alert("Mismatch", "New passwords do not match");
        }

        try {
            setLoading(true);

            /**
             * 🔐 BACKEND CALL (to be connected)
             * POST /api/user/change-password
             * body: { currentPassword, newPassword }
             */

            // await api.changePassword(currentPassword, newPassword);

            Alert.alert(
                "Success",
                "Your password has been changed successfully",
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (err) {
            Alert.alert("Error", "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <Text style={styles.title}>Change Password</Text>
            <Text style={styles.subtitle}>
                Keep your account secure by updating your password regularly.
            </Text>

            <View style={styles.card}>
                <Field
                    label="Current Password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                />

                <Field
                    label="New Password"
                    value={newPassword}
                    onChange={setNewPassword}
                />

                <Field
                    label="Confirm New Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                />

                <TouchableOpacity
                    style={[styles.btn, loading && styles.btnDisabled]}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    <Text style={styles.btnText}>
                        {loading ? "Updating..." : "Update Password"}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ---------------- INPUT FIELD ---------------- */

const Field = ({ label, value, onChange }: any) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor="#64748b"
        />
    </View>
);

/* ---------------- STYLES ---------------- */

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
        marginBottom: 6,
    },

    subtitle: {
        color: "#9aa8a6",
        fontSize: 14,
        marginBottom: 20,
    },

    card: {
        backgroundColor: "rgba(255,255,255,0.05)",
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
    },

    field: {
        marginBottom: 14,
    },

    label: {
        color: "#9aa8a6",
        fontSize: 12,
        marginBottom: 6,
    },

    input: {
        backgroundColor: "rgba(255,255,255,0.04)",
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        color: "#fff",
        fontSize: 15,
    },

    btn: {
        backgroundColor: "#00d48a",
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 10,
    },

    btnDisabled: {
        opacity: 0.7,
    },

    btnText: {
        textAlign: "center",
        color: "#041F1A",
        fontWeight: "900",
        fontSize: 16,
    },
});
