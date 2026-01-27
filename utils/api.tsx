import { Asset, BankStatement, MessageRequest } from "@/types/entity";
import axios from "axios";
import API_URL from "./ApiUrl";
import { Message } from "@/types/entity";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getChatLog(): Promise<Message[]> {
  const user = await AsyncStorage.getItem("user");
  const res = await axios.get(`${API_URL}/ai/chat`, { headers: { "Authorization": `Bearer ${(user)}` } });
  return res.data;
}

export async function generateAiResponse(redBody: MessageRequest) : Promise<Message> {  
  const res = await axios.post(
    `${API_URL}/ai/chat`,
    redBody,
    { headers: { "Content-Type": "application/json" } }
  );
  return res.data;
}


export async function deleteChatLog() {
  const user = await AsyncStorage.getItem("user");
  await axios.delete(`${API_URL}/ai/chat`, { headers: { "Authorization": `Bearer ${(user)}` } });
}


export async function getBankStatement(): Promise<BankStatement[]> {
  const user = await AsyncStorage.getItem("user");
  const res = await axios.get(`${API_URL}/bankstatement`, { headers: { "Authorization": `Bearer ${(user)}` } });
  return res.data;
}