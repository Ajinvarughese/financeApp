import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "./auth";
import { Asset } from "@/types/entity";
import axios from "axios";
import API_URL from "./ApiUrl";

/* ---------------- TYPES ---------------- */


/* ---------------- SAVE ASSET ---------------- */
export async function saveAsset(
    asset: Omit<Asset, "id" | "createdAt" | "updatedAt" | "user">
): Promise<Asset> {
    const user = await getUser();
    if (!user) {
        throw new Error("User not authenticated");
    }

    const payload = {
        name: asset.name,
        income: asset.income,
        expense: asset.expense,
        notes: asset.notes,
        user: {
            id: user.id,
        },
    };

    const res = await axios.post(
        `${API_URL}/asset`,
        payload,
        { headers: { "Content-Type": "application/json" } }
    );
    return res.data as Asset;
}
/* ---------------- GET ASSETS ---------------- */

export async function fetchAssets(): Promise<Asset[]> {
  const res = await axios.get<Asset[]>(`${API_URL}/asset`);
  return res.data; 
}

/* ---------------- CLEAR ASSETS (OPTIONAL) ---------------- */
export async function deleteAsset(id : number) {
   await axios.delete(`${API_URL}/asset/${id}`)
}
