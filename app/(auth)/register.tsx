import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthField from "@/components/AuthField";
import { AUTH } from "@/constants/authTheme";
import axios from "axios";
import API_URL from "@/utils/ApiUrl";
import { generateOtp, validateOtp } from "@/utils/otpApi";

export default function Register() {
    const router = useRouter();
    const [firstName,setFirstName] = useState("");
    const [lastName, setlastName] = useState("");
    const [email,setEmail] = useState("");
    const [age, setAge] = useState("");
    const [password,setPassword] = useState("");
    const [confirm,setConfirm] = useState("");

    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otp, setOtp] = useState<string>("");

    const handleSendOtp = async () => {
    //   fresh copy paste. check email validation then send otp
      
        setLoading(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setLoading(false);
            return Alert.alert(
            "Invalid Email",
            "Please enter a valid email address"
            );
        }

       // Password checks
       if (password !== confirm) {
         setLoading(false);
         return Alert.alert("Mismatch", "Passwords do not match");
       }

       if (password.length < 6) {
         setLoading(false);
         return Alert.alert(
           "Weak",
           "Password must be at least 6 characters long"
         );
       }
       try {
            const payload = { email };

            const otp = await generateOtp(payload);
            console.log(otp);
            setOtpSent(true);
       } catch (error) {
         Alert.alert("Couldn't send OTP", "Failed to send OTP. Please try again");
       } finally {
         setLoading(false);
       }
    };

    const handleRegister = async ()=>{
        setLoading(true);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setLoading(false);
          return Alert.alert(
            "Invalid Email",
            "Please enter a valid email address"
          );
        }

        // Password checks
        if (password !== confirm) {
          setLoading(false);
          return Alert.alert("Mismatch", "Passwords do not match");
        }

        if (password.length < 6) {
          setLoading(false);
          return Alert.alert(
            "Weak",
            "Password must be at least 6 characters long"
          );
        }

        const regData = {
            firstName,
            lastName,
            email,
            age,
            password
        };
        const otpData = {
          email,
          otp
        };
        try {
          await validateOtp(otpData);

          const res = await axios.post(`${API_URL}/user/register`, regData, {
            headers: {
              "Content-Type": "application/json",
            },
          });

          const newUser = res.data.password;
          await AsyncStorage.setItem("user", newUser);

          router.replace("/(tabs)");
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              if (Platform.OS === "web") {
                alert("Incorrect OTP entered.");
              } else {
                Alert.alert("Invalid OTP", "Incorrect OTP entered.");
              }
            } else if (error.response?.status === 409) {
              Alert.alert("Exists", "Email already registered");
            } 
          } else {
            Alert.alert("Error", "Something went wrong");
          }
        } finally {
          setLoading(false);
        }
    }

    return (
      <View style={styles.root}>
        <View style={styles.glow1} />
        <View style={styles.glow2} />

        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.tag}>Start your money journey</Text>

        <View style={styles.card}>
          {!otpSent ? (
            <>
              <AuthField
                label="First name"
                value={firstName}
                onChange={setFirstName}
              />
              <AuthField
                label="Last name"
                value={lastName}
                onChange={setlastName}
              />
              <AuthField label="Email" value={email} onChange={setEmail} />
              <AuthField label="Your age" value={age} onChange={setAge} />
              <AuthField
                label="Password"
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
                label="Email address"
                value={email}
                editable={false}
                onChange={setFirstName}
              />
              <AuthField label="OTP" value={otp} onChange={setOtp} />
              <TouchableOpacity disabled={loading} style={styles.btn} onPress={handleRegister}>
                {loading ? (
                  <ActivityIndicator color={AUTH.bg} />
                ) : (
                  <Text style={styles.btnText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity onPress={() => router.push("/login")}>
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
