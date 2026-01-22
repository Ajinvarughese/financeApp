import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUser } from "./auth";
import { Liability } from "@/types/entity";
import axios from "axios";
import API_URL from "./ApiUrl";


/* ---------------- SAVE LIABILITY ---------------- */
/* ---------------- SAVE LIABILITY ---------------- */
export async function saveLiability(
    data: Omit<Liability, "id" | "createdAt" | "updatedAt" | "riskClass" | "aiResponse">
): Promise<Liability> {
    const user = await getUser();

    const param = {
        name: data.name,
        amount: data.amount,
        interest: data.interest,
        months: data.months,
        emi: data.emi,
        note: data.note,
        user: {
            id: user?.id
        }
    };

    const res = await axios.post(
        `${API_URL}/liability`,
        param,
        { headers: { "Content-Type": "application/json" } }
    );

    // 🔥 THIS IS THE KEY LINE
    return res.data;
}


/* ---------------- GET LIABILITIES (USER ONLY) ---------------- */
export async function getLiabilities(): Promise<Liability[]> {
    const token = await AsyncStorage.getItem("user");
    const res = await axios.get(`${API_URL}/liability/user`, { headers: { "Authorization": `Bearer ${token}` } });
    return res.data;
}

/* ---------------- CLEAR (OPTIONAL) ---------------- */
export async function deleteLiability(id: number) {
    await axios.delete(`${API_URL}/liability/${id}`);
}
