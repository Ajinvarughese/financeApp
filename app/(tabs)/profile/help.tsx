import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";
import { createFeedback } from "@/utils/feedback";

export default function HelpSupport() {
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    if (!result.canceled) {
      setFile(result.assets[0]);
    }
  };

  const sendFeedback = async () => {
    if (!title.trim() || !comment.trim()) return;

    try {
      setLoading(true);
      setSuccess("");

      await createFeedback(
        {
          title,
          comment,
        },
        file
      );

      setTitle("");
      setComment("");
      setFile(null);
      setSuccess("Feedback sent successfully!");
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* HELP CONTENT */}
      <Text style={styles.title}>Help & Support</Text>

      {/* FEEDBACK FORM */}
      <View style={styles.feedbackCard}>
        <Text style={styles.formTitle}>Send Feedback</Text>

        <TextInput
          placeholder="Feedback Title"
          placeholderTextColor="#6f8480"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />

        <TextInput
          placeholder="Describe your issue or suggestion..."
          placeholderTextColor="#6f8480"
          value={comment}
          onChangeText={setComment}
          multiline
          style={styles.textArea}
        />

        {file && <Text style={styles.fileName}>Attached: {file.name}</Text>}

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.attachBtn} onPress={pickFile}>
            <Text style={styles.attachText}>Attach File</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitBtn} onPress={sendFeedback}>
            {loading ? (
              <ActivityIndicator color="#071013" />
            ) : (
              <Text style={styles.submitText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>

        {success ? <Text style={styles.success}>{success}</Text> : null}
      </View>

      <Section title="About This Application">
        This application is a personal finance management system designed to
        help users track their assets, liabilities, and financial health in a
        simple and intelligent way.
      </Section>

      <Section title="Assets">
        Assets represent everything you own that has financial value, such as
        savings, investments, properties, or valuables. You can add, edit, and
        monitor assets to understand your total wealth.
      </Section>

      <Section title="Liabilities">
        Liabilities include loans, EMIs, and any financial commitments. The app
        analyzes liabilities to calculate risk levels based on income and
        repayment ratios.
      </Section>

      <Section title="AI Assistance">
        The AI assistant helps evaluate whether taking new liabilities is safe
        based on your existing financial data. It provides smart recommendations
        and warnings.
      </Section>

      <Section title="Dashboard">
        The dashboard gives a visual summary of your financial status, including
        balance, risk indicators, and recent activities.
      </Section>

      <Section title="Data Security">
        All user data is securely handled. Sensitive actions like account
        deletion and password updates require confirmation.
      </Section>

      <Section title="Need More Help?">
        Send us feedback above and our team will respond as soon as possible.
      </Section>
    </ScrollView>
  );
}

const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Text style={styles.text}>{children}</Text>
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#071013",
    padding: 20,
  },

  title: {
    marginTop: 30,
    color: "#e5fff6",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 20,
  },

  /* FEEDBACK FORM */

  feedbackCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 18,
    borderRadius: 16,
    marginBottom: 30,
  },

  formTitle: {
    color: "#00d48a",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 14,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    marginBottom: 10,
  },

  textArea: {
    backgroundColor: "rgba(255,255,255,0.06)",
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 10,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },

  attachBtn: {
    backgroundColor: "rgba(255,255,255,0.07)",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  attachText: {
    color: "#9aa8a6",
    fontWeight: "600",
  },

  submitBtn: {
    backgroundColor: "#00d48a",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  submitText: {
    color: "#071013",
    fontWeight: "800",
  },

  fileName: {
    color: "#9aa8a6",
    fontSize: 12,
    marginBottom: 6,
  },

  success: {
    color: "#00d48a",
    marginTop: 10,
    fontWeight: "700",
  },

  /* HELP SECTIONS */

  section: {
    marginBottom: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    padding: 16,
    borderRadius: 14,
  },

  sectionTitle: {
    color: "#00d48a",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 6,
  },

  text: {
    color: "#9aa8a6",
    fontSize: 14,
    lineHeight: 22,
  },
});
