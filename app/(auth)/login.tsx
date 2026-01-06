import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { AUTH } from "@/constants/authTheme";
import AuthField from "@/components/AuthField";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API_URL from "@/utils/ApiUrl";
import axios from "axios";
import { getUser } from "@/utils/auth";
import { UserRole } from "@/types/entity";

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        if (password.length < 6) {
            return Alert.alert(
                "Weak Password",
                "Password must be at least 6 characters long"
            );
        }

        try {
            const res = await axios.post(`${API_URL}/user/login`, {
                email,
                password,
            });
            const token = res.data.password;
            // ✅ store ONLY the JWT
            await AsyncStorage.setItem("user", token);

            // ✅ redirect using role from login response
            if (res.data.role === UserRole.ADMIN) {
                router.replace("/(admin)/dashboard");
            } else {
                router.replace("/(tabs)");
            }

        } catch (error) {
            Alert.alert("Login Failed", "Email or password is incorrect");
        }
    };


    return (
        <View style={styles.root}>
            <View style={styles.glow1} />
            <View style={styles.glow2} />

            <Text style={styles.title}>Sign In</Text>
            <Text style={styles.tag}>Access your dashboard</Text>

            <View style={styles.card}>
                <AuthField label="Email" value={email} onChange={setEmail} />
                <AuthField
                    label="Password"
                    secure
                    value={password}
                    onChange={setPassword}
                />

                <TouchableOpacity style={styles.btn} onPress={handleLogin}>
                    <Text style={styles.btnText}>Login</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
                <Text style={styles.link}>No account? Create one</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: AUTH.bg,
        justifyContent: "center",
        padding: 28,
    },
    glow1: {
        position: "absolute",
        width: 480,
        height: 480,
        borderRadius: 480,
        backgroundColor: AUTH.glow1,
        opacity: 0.08,
        top: -200,
        left: -140,
    },
    glow2: {
        position: "absolute",
        width: 480,
        height: 480,
        borderRadius: 480,
        backgroundColor: AUTH.glow2,
        opacity: 0.08,
        bottom: -200,
        right: -140,
    },
    title: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "900",
        textAlign: "center",
    },
    tag: {
        color: AUTH.muted,
        textAlign: "center",
        marginBottom: 26,
    },
    card: {
        backgroundColor: "rgba(255,255,255,0.06)",
        borderRadius: 22,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        padding: 24,
        marginBottom: 24,
    },
    btn: {
        backgroundColor: AUTH.glow1,
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 10,
    },
    btnText: {
        textAlign: "center",
        fontWeight: "900",
        color: "#000",
        fontSize: 17,
    },
    link: {
        textAlign: "center",
        color: AUTH.glow1,
        fontSize: 15,
        fontWeight: "700",
    },
});
