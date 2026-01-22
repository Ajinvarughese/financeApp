import { getUser } from "@/utils/auth";
import { useEffect, useRef, useState } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Animated,
    Platform,
    Image,
    Text,
} from "react-native";
import Markdown from "react-native-markdown-display";
import { Message } from "@/types/entity";
import { deleteChatLog, generateAiResponse, getChatLog } from "@/utils/api";
import { Alert } from "react-native";
import Delete from "../assets/icons/delete.png";


export default function AIChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const dotAnim = useRef(new Animated.Value(0)).current;

    const handleDeleteChat = () => {
        if (Platform.OS === "web") {
            const confirmed = window.confirm(
                "This will permanently delete your chat history."
            );

            if (confirmed) {
                deleteChatLog();
                setMessages([]);
            }
            return;
        }

        Alert.alert(
            "Clear chat?",
            "This will permanently delete your chat history.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        await deleteChatLog();
                        setMessages([]);
                    },
                },
            ]
        );
    };



    /* ---------------- LOAD CHAT HISTORY ---------------- */
    const handleChatLog = async () => {
        const logs = await getChatLog();
        setMessages(logs ?? []);
    };

    useEffect(() => {
        handleChatLog();
    }, []);

    /* ---------------- DOT ANIMATION ---------------- */
    useEffect(() => {
        if (!isTyping) return;

        Animated.loop(
            Animated.sequence([
                Animated.timing(dotAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.timing(dotAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [isTyping]);

    /* ---------------- SEND MESSAGE ---------------- */
    const sendMessage = async () => {
        if (!input.trim() || isTyping) return;

        const user = await getUser();

        const userMsg: Message = {
            id: Date.now().toString(),
            text: input,
            textFrom: "USER",
            userId: user!.id,
        };

        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        try {
            const res = await generateAiResponse({
                text: userMsg.text,
                userId: userMsg.userId,
            });

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: res.text,
                textFrom: "ASSISTANT",
                userId: userMsg.userId,
            };

            setMessages((prev) => [...prev, aiMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    /* ---------------- UI ---------------- */
    return (
        <View style={styles.wrapper}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Image alt="logo" source={require("../assets/icons/logoo.png")} style={styles.aiIcon} />
                    <Text style={styles.aiName}>Financia AI</Text>
                </View>
                <TouchableOpacity onPress={handleDeleteChat} style={styles.deleteBtn}>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Image source={Delete} style={{ width: 16, height: 16 }} />
                        <Text style={styles.deleteText}>Delete Chat</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item, index) => item.id ?? index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.bubble,
                            item.textFrom === "USER"
                                ? styles.userBubble
                                : styles.aiBubble,
                        ]}
                    >
                        <Markdown
                            style={{
                                body:
                                    item.textFrom === "USER"
                                        ? styles.userText
                                        : styles.aiText,
                                strong: { fontWeight: "700" },
                                bullet_list: { marginVertical: 6 },
                            }}
                        >
                            {item.text}
                        </Markdown>
                    </View>
                )}
                ListFooterComponent={
                    isTyping ? (
                        <View style={[styles.bubble, styles.aiBubble]}>
                            <TypingDots anim={dotAnim} />
                        </View>
                    ) : null
                }
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 12 }}
            />

            {/* INPUT */}
            <View style={styles.inputBox}>
                <TextInput
                    value={input}
                    onChangeText={setInput}
                    placeholder="Ask about your finances..."
                    placeholderTextColor="#9aa8a6"
                    style={styles.input}
                    multiline
                    textAlignVertical="center"
                />

                <TouchableOpacity
                    style={[
                        styles.sendBtn,
                        isTyping && { opacity: 0.6 },
                    ]}
                    onPress={sendMessage}
                    disabled={isTyping}
                >
                    <Markdown style={{ body: styles.sendText }}>➤</Markdown>
                </TouchableOpacity>
            </View>
        </View>
    );
}

/* ---------------- TYPING DOTS ---------------- */

function TypingDots({ anim }: { anim: Animated.Value }) {
    const opacity = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 1],
    });

    return (
        <Animated.Text style={[styles.typingText, { opacity }]}>
            ● ● ●
        </Animated.Text>
    );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.3)",
        borderRadius: 20,
        padding: 12,
    },

    header: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 8,
        backgroundColor: "rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: 10,
    },

    deleteBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: "rgba(255,0,0,0.22)",
    },

    deleteText: {
        fontSize: 14,
        color: "#fff",
        fontWeight: "600",
    },


    bubble: {
        maxWidth: "82%",
        padding: 14,
        borderRadius: 18,
        marginBottom: 10,
    },
    aiBubble: {
        backgroundColor: "rgba(0,212,138,0.18)",
        alignSelf: "flex-start",
        borderTopLeftRadius: 6,
    },
    userBubble: {
        backgroundColor: "rgba(255,255,255,0.14)",
        alignSelf: "flex-end",
        borderTopRightRadius: 6,
    },

    aiText: {
        color: "#d5efe6",
        fontSize: 15,
        lineHeight: 21,
    },
    userText: {
        color: "#ffffff",
        fontSize: 15,
        lineHeight: 21,
        fontWeight: "600",
    },

    typingText: {
        color: "#d5efe6",
        fontSize: 18,
        letterSpacing: 3,
    },

    inputBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 10,
        borderRadius: 18,
        marginTop: 8,
    },
    input: {
        flex: 1,
        color: "#fff",
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: 15,
        minHeight: 34,        
    },

    sendBtn: {
        backgroundColor: "#00d48a",
        paddingVertical: 12,
        paddingHorizontal: 18,   // 🔥 wider button
        borderRadius: 16,
        marginLeft: 8,
        minWidth: 52,            // 🔥 consistent width
        alignItems: "center",
        justifyContent: "center",
    },

    sendText: {
        fontSize: 18,
        fontWeight: "900",
        color: "#04211b",
    },

    headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
},

aiIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    margin: 7,
    transform: [{ scale: 3 }],
},

aiName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e6fff6",
    letterSpacing: 0.3,
},


});
