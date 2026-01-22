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
export async function getAssets(): Promise<Asset[]> {
    const user = await getUser();
    if (!user) return [];

    const key = `assets_${user.email}`;
    const raw = await AsyncStorage.getItem(key);

    return raw ? JSON.parse(raw) : [];
}

/* ---------------- CLEAR ASSETS (OPTIONAL) ---------------- */
export async function clearAssets() {
    const user = await getUser();
    if (!user) return;

    await AsyncStorage.removeItem(`assets_${user.email}`);
}
