import { User } from "@/types/entity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "./ApiUrl";
import { useRouter } from "expo-router";


export const getUser = async (): Promise<User | null> => {
  const token = await AsyncStorage.getItem("user");
  if (!token) return null;

  try {
    const res = await axios.get<User>(`${API_URL}/user/auth/token`, {
      headers: {
        "Authorization": `Bearer ${(token)}`,
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        // token expired / invalid
        await AsyncStorage.removeItem("user");
      }
    }
    return null;
  }
};


export const logout = async () => {
  await AsyncStorage.removeItem("user");
};
