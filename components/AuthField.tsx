import React, { useState } from "react";
import { View, TextInput, Animated, StyleSheet } from "react-native";
import { AUTH } from "@/constants/authTheme";

export default function AuthField({ label, secure=false, value, onChange } : any) {
    const [focus] = useState(new Animated.Value(0));

    const animate = (x:number) =>
        Animated.timing(focus, { toValue: x, duration: 200, useNativeDriver: false }).start();

    return (
        <Animated.View style={[styles.box,{
            borderColor: focus.interpolate({
                inputRange:[0,1], outputRange:[AUTH.border0, AUTH.glow1]
            })
        }]}>
            <Animated.Text style={[styles.label,{
                top:focus.interpolate({inputRange:[0,1],outputRange:[18,-6]}),
                fontSize:focus.interpolate({inputRange:[0,1],outputRange:[16,12]}),
                color:focus.interpolate({inputRange:[0,1],outputRange:[AUTH.muted,AUTH.glow1]})
            }]}>
                {label}
            </Animated.Text>
            <TextInput
                value={value}
                onChangeText={onChange}
                secureTextEntry={secure}
                style={styles.input}
                onFocus={()=>animate(1)}
                onBlur={()=>animate(0)}
            />
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    box: {
        borderWidth: 1,
        borderRadius: 14,
        paddingHorizontal: 12,
        paddingTop: 18,
        marginBottom: 22,
        backgroundColor:"rgba(255,255,255,0.05)"
    },
    label:{position:"absolute",left:14},
    input:{height:40,color:"#fff",fontSize:16}
});
