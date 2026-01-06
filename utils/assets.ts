import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "./auth";
import { Asset } from "@/types/entity";

/* ---------------- TYPES ---------------- */


// /* ---------------- SAVE ASSET ---------------- */
// export async function saveAsset(asset: Omit<Asset, "id" | "createdAt">) {
//     const user = await getUser();
//     if (!user) return;

//     const key = `assets_${user.email}`;

//     const raw = await AsyncStorage.getItem(key);
//     const assets: Asset[] = raw ? JSON.parse(raw) : [];

//     const newAsset: Asset = {
//         id: Date.now().toString(),
//         createdAt: Date.now(),
//         ...asset,
//     };

//     assets.unshift(newAsset);
//     await AsyncStorage.setItem(key, JSON.stringify(assets));
// }

/* ---------------- GET ASSETS ---------------- */
// export async function getAssets(): Promise<Asset[]> {
//     const user = await getUser();
//     if (!user) return [];

//     const key = `assets_${user.email}`;
//     const raw = await AsyncStorage.getItem(key);

//     return raw ? JSON.parse(raw) : [];
// }

// /* ---------------- CLEAR ASSETS (OPTIONAL) ---------------- */
// export async function clearAssets() {
//     const user = await getUser();
//     if (!user) return;

//     await AsyncStorage.removeItem(`assets_${user.email}`);
// }
