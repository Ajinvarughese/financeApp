import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { saveUser } from "@/utils/auth";
import AuthField from "@/components/AuthField";
import { AUTH } from "@/constants/authTheme";
import axios from "axios";
import API_URL from "@/utils/ApiUrl";

export default function Register() {
    const router = useRouter();
    const [firstName,setFirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email,setEmail] = useState("");
    const [age, setAge] = useState("");
    const [password,setPassword] = useState("");
    const [confirm,setConfirm] = useState("");

    const handleRegister = async ()=>{
        if(password!==confirm) return Alert.alert("Mismatch","Passwords do not match");
        if(password.length < 6) return Alert.alert("Weak","Password must be at least 6 characters long");
        const regData = {
            firstName,
            lastName,
            email,
            age,
            password
        };
        try {
            const res = await axios.post(`${API_URL}/user/register`, regData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            const newUser = res.data;
            await AsyncStorage.setItem("user", JSON.stringify(newUser));
            await saveUser(newUser);

            router.replace("/(tabs)");
        } catch (error) {
            return Alert.alert("Exists", "Email already registered");
        }
    }

    return(
        <View style={styles.root}>
            <View style={styles.glow1}/>
            <View style={styles.glow2}/>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.tag}>Start your money journey</Text>

            <View style={styles.card}>
                <AuthField label="First name" value={firstName} onChange={setFirstName}/>
                <AuthField label="Last name" value={lastName} onChange={setlastName}/>
                <AuthField label="Email" value={email} onChange={setEmail}/>
                <AuthField label="Your age" value={age} onChange={setAge}/>
                <AuthField label="Password" secure value={password} onChange={setPassword}/>
                <AuthField label="Confirm Password" secure value={confirm} onChange={setConfirm}/>

                <TouchableOpacity style={styles.btn} onPress={handleRegister}>
                    <Text style={styles.btnText}>Sign Up</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={()=>router.push("/login")}>
                <Text style={styles.link}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    root:{flex:1,backgroundColor:AUTH.bg,justifyContent:"center",padding:28},
    glow1:{position:"absolute",width:400,height:400,borderRadius:400,
        backgroundColor:AUTH.glow1,opacity:0.07,top:-160,left:-120},
    glow2:{position:"absolute",width:400,height:400,borderRadius:400,
        backgroundColor:AUTH.glow2,opacity:0.07,bottom:-160,right:-120},
    title:{color:"#fff",fontSize:32,fontWeight:"900",textAlign:"center"},
    tag:{color:AUTH.muted,textAlign:"center",marginBottom:26},
    card:{
        backgroundColor:"rgba(255,255,255,0.05)",
        borderRadius:22,borderWidth:1,borderColor:"rgba(255,255,255,0.08)",
        padding:24,marginBottom:22
    },
    btn:{backgroundColor:AUTH.glow1,paddingVertical:14,borderRadius:16,marginTop:10},
    btnText:{textAlign:"center",fontWeight:"900",color:"#000",fontSize:17},
    link:{textAlign:"center",color:AUTH.glow1,fontSize:15,fontWeight:"700"}
});
