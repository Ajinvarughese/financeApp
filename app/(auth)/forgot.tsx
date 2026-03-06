import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import AuthField from "@/components/AuthField";
import { AUTH } from "@/constants/authTheme";
import { generateOtp, validateOtp } from "@/utils/otpApi";
import axios from "axios";
import API_URL from "@/utils/ApiUrl";

export default function Forgot() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setLoading(false);
      return Alert.alert("Invalid Email", "Enter a valid email address");
    }

    try {
      await generateOtp({ email });
      setOtpSent(true);
    } catch {
      Alert.alert("Error", "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);

    if (password !== confirm) {
      setLoading(false);
      return Alert.alert("Mismatch", "Passwords do not match");
    }

    if (password.length < 6) {
      setLoading(false);
      return Alert.alert("Weak", "Password must be at least 6 characters");
    }

    try {
      await validateOtp({ email, otp });

      await axios.put(`${API_URL}/user/password`, {
        email,
        password,
      });

      if (Platform.OS === "web") {
        alert("Password updated successfully");
      } else {
        Alert.alert("Success", "Password updated successfully");
      }

      router.replace("/login");
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        Alert.alert("Invalid OTP", "Incorrect OTP entered");
      } else {
        Alert.alert("Error", "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.tag}>Recover your account securely</Text>

      <View style={styles.card}>
        {!otpSent ? (
          <>
            <AuthField
              label="Email address"
              value={email}
              onChange={setEmail}
            />

            <TouchableOpacity
              disabled={loading}
              style={styles.btn}
              onPress={handleSendOtp}
            >
              {loading ? (
                <ActivityIndicator color={AUTH.bg} />
              ) : (
                <Text style={styles.btnText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <AuthField
              label="Email"
              value={email}
              editable={false}
              onChange={() => {}}
            />

            <AuthField label="OTP" value={otp} onChange={setOtp} />

            <AuthField
              label="New Password"
              secure
              value={password}
              onChange={setPassword}
            />

            <AuthField
              label="Confirm Password"
              secure
              value={confirm}
              onChange={setConfirm}
            />

            <TouchableOpacity
              disabled={loading}
              style={styles.btn}
              onPress={handleReset}
            >
              {loading ? (
                <ActivityIndicator color={AUTH.bg} />
              ) : (
                <Text style={styles.btnText}>Reset Password</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Back to Login</Text>
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
    width: 400,
    height: 400,
    borderRadius: 400,
    backgroundColor: AUTH.glow1,
    opacity: 0.07,
    top: -160,
    left: -120,
  },

  glow2: {
    position: "absolute",
    width: 400,
    height: 400,
    borderRadius: 400,
    backgroundColor: AUTH.glow2,
    opacity: 0.07,
    bottom: -160,
    right: -120,
  },

  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },

  tag: { color: AUTH.muted, textAlign: "center", marginBottom: 26 },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 24,
    marginBottom: 22,
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
