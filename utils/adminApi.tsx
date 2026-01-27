import { User } from "@/types/entity";
import axios from "axios";
import API_URL from "./ApiUrl";

export async function getUsers(): Promise<User[]> { 
    const res = await axios.get(`${API_URL}/user`);
    return res.data;
}
