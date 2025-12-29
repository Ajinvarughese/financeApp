import { View, Text, StyleSheet } from "react-native";

export default function Forgot() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Forgot Password</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    text: { color: "#000", fontSize: 20 },
});
