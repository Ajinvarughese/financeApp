// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { getUser } from "./auth";

// /* ---------------- TYPES ---------------- */
// export type Liability = {
//     id: string;
//     name: string;
//     amount: number;
//     interest?: number;
//     months?: number;
//     expense: number;
//     riskPercent: number;
//     createdAt: number;
//     updatedAt: number;
// };

// /* ---------------- SAVE LIABILITY ---------------- */
// export async function saveLiability(
//     data: Omit<Liability, "id" | "createdAt">
// ) {
//     const user = await getUser();
//     if (!user?.email) return;

//     const key = `liabilities_${user.email}`;

//     const raw = await AsyncStorage.getItem(key);
//     const list: Liability[] = raw ? JSON.parse(raw) : [];

//     const newItem: Liability = {
//         id: Date.now().toString(),
//         createdAt: Date.now(),
//         ...data,
//     };

//     list.unshift(newItem);
//     await AsyncStorage.setItem(key, JSON.stringify(list));
// }

// /* ---------------- GET LIABILITIES (USER ONLY) ---------------- */
// export async function getLiabilities(): Promise<Liability[]> {
//     const user = await getUser();
//     if (!user?.email) return [];

//     const key = `liabilities_${user.email}`;
//     const raw = await AsyncStorage.getItem(key);

//     return raw ? JSON.parse(raw) : [];
// }

// /* ---------------- CLEAR (OPTIONAL) ---------------- */
// export async function clearLiabilities() {
//     const user = await getUser();
//     if (!user?.email) return;

//     await AsyncStorage.removeItem(`liabilities_${user.email}`);
// }
