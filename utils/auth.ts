import { User } from "@/types/financial";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API_URL from "./ApiUrl";


export const getUser = async () : Promise <User | null>  => {
    const token = await AsyncStorage.getItem("user");
    const res = await axios.get(`${API_URL}/user/auth/token`, {
      headers: {
        Authorization: `Bearer ${token}`,
       
      },
    });
    return res.data;
};

export const logout = async () => {
    await AsyncStorage.removeItem("user");
};
