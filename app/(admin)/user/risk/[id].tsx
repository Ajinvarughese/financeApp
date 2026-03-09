import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AdminSidebar from "@/components/AdminSidebar";
import { FullUser, Asset, Liability } from "@/types/entity";
import { fetchAllUsers } from "@/utils/users";

export default function RiskUserDetails() {
  const { id } = useLocalSearchParams();

  const [user, setUser] = useState<FullUser | null>(null);

  const load = async () => {
    const allUsers = await fetchAllUsers();
    const found = allUsers.find((u) => u.user.id.toString() === id);
    if (found) setUser(found);
  };

  useEffect(() => {
    load();
  }, []);

  const downloadDocument = async (url?: string) => {
    if (!url) return;
    await Linking.openURL(url);
  };

  if (!user) {
    return (
      <View style={styles.loading}>
        <Text style={{ color: "#fff" }}>Loading...</Text>
      </View>
    );
  }

  return (
    <AdminSidebar prop="risk">
      <ScrollView style={styles.root}>
        {/* USER INFO */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {user.user.firstName} {user.user.lastName}
          </Text>
          <Text style={styles.email}>{user.user.email}</Text>
        </View>

        {/* ASSETS */}
        <Text style={styles.sectionTitle}>Assets</Text>

        {user.assets.map((a: Asset) => (
          <View key={a.id} style={styles.card}>
            <Text style={styles.cardTitle}>{a.name}</Text>

            <Text style={styles.meta}>Income: ₹{a.income}</Text>
            <Text style={styles.meta}>Expense: ₹{a.expense}</Text>

            {a.notes && <Text style={styles.note}>{a.notes}</Text>}
          </View>
        ))}

        {/* LIABILITIES */}
        <Text style={styles.sectionTitle}>Liabilities</Text>
        {user.liabilities.map((l: Liability) => (
          <View key={l.id} style={styles.card}>
            <Text style={styles.cardTitle}>{l.name}</Text>

            <Text style={styles.meta}>Amount: ₹{l.amount}</Text>
            <Text style={styles.meta}>EMI: ₹{l.emi}</Text>

            {l.interest && (
              <Text style={styles.meta}>Interest Rate: {l.interest}%</Text>
            )}

            {l.months && (
              <Text style={styles.meta}>Duration: {l.months} months</Text>
            )}

            {l.institution && (
              <Text style={styles.meta}>Institution: {l.institution}</Text>
            )}

            {l.riskClass && (
              <Text style={styles.meta}>Risk Class: {l.riskClass}</Text>
            )}

            {l.note && <Text style={styles.note}>Note: {l.note}</Text>}

            {l.aiResponse && (
              <Text style={styles.ai}>AI Analysis: {l.aiResponse}</Text>
            )}

            {l.document && (
              <TouchableOpacity
                style={styles.downloadBtn}
                onPress={() => downloadDocument(l.document)}
              >
                <Text style={styles.downloadText}>Download Document</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </AdminSidebar>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#071013",
    padding: 20,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#071013",
  },

  header: {
    marginBottom: 20,
    marginLeft: 30,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "900",
  },

  email: {
    color: "#9aa8a6",
    marginTop: 4,
  },

  sectionTitle: {
    color: "#e5fff6",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 10,
  },

  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  cardTitle: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 6,
  },

  meta: {
    color: "#9aa8a6",
    fontSize: 13,
    marginBottom: 2,
  },

  note: {
    color: "#7fbda4",
    marginTop: 6,
    fontSize: 12,
  },

  downloadBtn: {
    marginTop: 10,
    backgroundColor: "#00d48a",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: "flex-start",
  },

  downloadText: {
    color: "#041F1A",
    fontWeight: "800",
    fontSize: 12,
  },
  ai: {
    color: "#FFD166",
    fontSize: 12,
    marginTop: 6,
    fontStyle: "italic",
  },
});
