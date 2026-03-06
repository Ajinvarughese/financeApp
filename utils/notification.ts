import axios from "axios"
import API_URL from "./ApiUrl";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Notification } from "@/types/entity";

export const createNotification = async (payload : Notification) : Promise<Notification> => {
    console.log(payload)
    const res = await axios.post(`${API_URL}/notification`, payload);
    return res.data;
}

export const getNotifications = async () : Promise<Notification[]> => {
    const token = await AsyncStorage.getItem("user");
    const res = await axios.get(`${API_URL}/notification/user`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
}

export const markAsRead = async (id : number) : Promise<Notification> => {
    const res = await axios.put(`${API_URL}/notification`, { id });
    return res.data;
}

export const deleteNotification = async (id : number) : Promise<void> => {
    await axios.delete(`${API_URL}/notification/${id}`);
}

export const deleteAllNotifications = async () : Promise<void> => {
    const token = await AsyncStorage.getItem("user");
    await axios.delete(`${API_URL}/notification/user`, { headers: { Authorization: `Bearer ${token}` } });
}