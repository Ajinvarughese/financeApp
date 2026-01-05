import { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
} from "react-native";

type Message = {
    id: string;
    text: string;
    from: "user" | "ai";
};

export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "init",
            text: "Hi 👋 I’m your finance assistant. Ask me about assets, liabilities, or risk.",
            from: "ai",
        },
    ]);
    const [input, setInput] = useState("");

    const sendMessage = () => {
        if (!input.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            from: "user",
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // 🔹 Simulated AI response (replace later with real AI API)
        setTimeout(() => {
            const aiMsg: Message = {
                id: Date.now().toString() + "_ai",
                text: generateReply(userMsg.text),
                from: "ai",
            };
            setMessages((prev) => [...prev, aiMsg]);
        }, 600);
    };

    return (
        <View style={styles.wrapper}>
            {/* Messages */}
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.bubble,
                            item.from === "user"
                                ? styles.userBubble
                                : styles.aiBubble,
                        ]}
                    >
                        <Text
                            style={[
                                styles.text,
                                item.from === "user"
                                    ? styles.userText
                                    : styles.aiText,
                            ]}
                        >
                            {item.text}
                        </Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 10 }}
            />

            {/* Input */}
            <View style={styles.inputBox}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask about your finances..."
                    placeholderTextColor="#9aa8a6"
                    style={styles.input}
                />
                <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                    <Text style={styles.sendText}>➤</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ---------------- SIMPLE AI LOGIC ---------------- */

function generateReply(text: string) {
    const q = text.toLowerCase();

    if (q.includes("liability"))
        return "High liabilities increase risk. Try keeping EMIs under 40% of income.";

    if (q.includes("asset"))
        return "Assets with stable income and low expenses improve financial health.";

    if (q.includes("risk"))
        return "Risk rises when debt and expenses exceed savings consistently.";

    return "I can help analyze your assets, liabilities, and savings. Ask me anything!";
}

/* ---------------- STYLES (MATCHES YOUR THEME) ---------------- */

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.25)",
        borderRadius: 18,
        padding: 12,
    },

    bubble: {
        maxWidth: "80%",
        padding: 14,
        borderRadius: 16,
        marginBottom: 10,
    },
    aiBubble: {
        backgroundColor: "rgba(0,212,138,0.15)",
        alignSelf: "flex-start",
        borderTopLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: "rgba(255,255,255,0.12)",
        alignSelf: "flex-end",
        borderTopRightRadius: 4,
    },

    text: { fontSize: 15, lineHeight: 20 },
    aiText: { color: "#d5efe6" },
    userText: { color: "#ffffff", fontWeight: "600" },

    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.08)",
        padding: 10,
        borderRadius: 16,
        marginTop: 8,
    },
    input: {
        flex: 1,
        color: "#fff",
        paddingHorizontal: 10,
        fontSize: 15,
    },
    sendBtn: {
        backgroundColor: "#00d48a",
        padding: 12,
        borderRadius: 14,
        marginLeft: 6,
    },
    sendText: {
        fontSize: 16,
        fontWeight: "900",
        color: "#04211b",
    },
});
