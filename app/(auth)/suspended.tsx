import { getUser } from "@/utils/auth";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export default function DoctorSuspended() {
  const router = useRouter();
  const checkUser = async () => {
    try {
      const res = await getUser();
      if(res) {
        router.replace("/(tabs)");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error?.response?.status === 423) {
            //do nothing
        }
      }
    }
  };

  useEffect(() => {
    checkUser();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.icon}>⚠️</Text>

        <Text style={styles.title}>Account Suspended</Text>

        <Text style={styles.message}>
          Your Medizio doctor account has been temporarily suspended by the
          administration.
          {"\n\n"}
          This may happen due to policy violations or incomplete profile
          verification.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📩 Please contact support or the administrator
          </Text>
          <Text style={styles.infoText}>
            🛠 Your account may be restored after review
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("/(auth)/login");
          }}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Try Login Again</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 26,
    padding: 30,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },

  icon: {
    fontSize: 60,
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: "900",
    color: "#9A3412",
    marginBottom: 12,
    textAlign: "center",
  },

  message: {
    fontSize: 14,
    color: "#7C2D12",
    textAlign: "center",
    lineHeight: 20,
  },

  infoBox: {
    backgroundColor: "#FFEDD5",
    borderRadius: 14,
    padding: 14,
    marginTop: 20,
    width: "100%",
  },

  infoText: {
    fontSize: 13,
    color: "#9A3412",
    marginBottom: 4,
    textAlign: "center",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#F97316",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 14,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 14,
  },
});
