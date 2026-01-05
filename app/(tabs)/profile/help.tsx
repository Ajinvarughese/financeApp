import { ScrollView, View, Text, StyleSheet } from "react-native";

export default function HelpSupport() {
    return (
        <ScrollView style={styles.root} contentContainerStyle={{ paddingBottom: 40 }}>
            <Text style={styles.title}>Help & Support</Text>

            <Section title="About This Application">
                This application is a personal finance management system designed
                to help users track their assets, liabilities, and financial health
                in a simple and intelligent way.
            </Section>

            <Section title="Assets">
                Assets represent everything you own that has financial value,
                such as savings, investments, properties, or valuables.
                You can add, edit, and monitor assets to understand your total wealth.
            </Section>

            <Section title="Liabilities">
                Liabilities include loans, EMIs, and any financial commitments.
                The app analyzes liabilities to calculate risk levels based on
                income and repayment ratios.
            </Section>

            <Section title="AI Assistance">
                The AI assistant helps evaluate whether taking new liabilities
                is safe based on your existing financial data.
                It provides smart recommendations and warnings.
            </Section>

            <Section title="Dashboard">
                The dashboard gives a visual summary of your financial status,
                including balance, risk indicators, and recent activities.
            </Section>

            <Section title="Data Security">
                All user data is securely handled. Sensitive actions like account
                deletion and password updates require confirmation.
            </Section>

            <Section title="Need More Help?">
                For further assistance, contact support through the official
                channels provided by the organization.
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
        color: "#e5fff6",
        fontSize: 24,
        fontWeight: "900",
        marginBottom: 20,
    },
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
