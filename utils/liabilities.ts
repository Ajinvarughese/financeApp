import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "./auth";
import { Liability } from "@/types/entity";
import axios from "axios";
import API_URL from "./ApiUrl";
import { Platform } from "react-native";

/* ---------------- SAVE LIABILITY ---------------- */
export async function saveLiability(
  data: Omit<
    Liability,
    "id" | "createdAt" | "updatedAt" | "riskClass" | "aiResponse" | "document"
  >,
  file?: any
): Promise<Liability> {
  const user = await getUser();

  const liability = {
    name: data.name,
    amount: data.amount,
    interest: data.interest,
    months: data.months,
    emi: data.emi,
    note: data.note,
    institution: data.institution,
    user: { id: user?.id },
  };

  const formData = new FormData();

  // send JSON
  formData.append("liability", JSON.stringify(liability));

  if (file) {
    if (Platform.OS === "web") {
      // convert blob url -> real file
      const blob = await fetch(file.uri).then((r) => r.blob());

      const realFile = new File([blob], file.name, {
        type: file.type || "application/pdf",
      });

      formData.append("file", realFile);
    } else {
      formData.append("file", {
        uri: file.uri,
        name: file.name || "document.pdf",
        type: file.mimeType || "application/pdf",
      } as any);
    }
  }

  const res = await axios.post(`${API_URL}/liability`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

/* ---------------- GET LIABILITIES (USER ONLY) ---------------- */
export async function getLiabilities(): Promise<Liability[]> {
  const token = await AsyncStorage.getItem("user");
  const res = await axios.get(`${API_URL}/liability/user`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

/* ---------------- CLEAR (OPTIONAL) ---------------- */
export async function deleteLiability(id: number) {
  await axios.delete(`${API_URL}/liability/${id}`);
}
