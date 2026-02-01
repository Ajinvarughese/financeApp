import { Asset, BankStatement, MessageRequest } from "@/types/entity";
import axios from "axios";
import API_URL from "./ApiUrl";
import { Message } from "@/types/entity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { getUser } from "./auth";

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


export const uploadBankStatement = async (fileObj: any) => {
  const formData = new FormData();

  if (Platform.OS === "web" && fileObj.file) {
    formData.append("file", fileObj.file);
  } else {
    formData.append("file", {
      uri: fileObj.uri,
      name: fileObj.name ?? "statement.pdf",
      type: fileObj.mimeType ?? "application/pdf",
    } as any);
  }
  const user = await getUser();
  formData.append("user", user?.id  as any );

  // 🌐 WEB → Axios
  if (Platform.OS === "web") {
    return axios.post(
      `${API_URL}/bankstatement/file/upload`,
      formData,
      {
        headers: { Accept: "application/json" },
        transformRequest: (d) => d,
      }
    );
  }

  // 📱 ANDROID / IOS → Fetch (stable)
  const res = await fetch(
    `${API_URL}/bankstatement/file/upload`,
    {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text);
  }

  return res.json();
};