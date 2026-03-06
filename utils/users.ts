import axios from "axios";
import API_URL from "./ApiUrl";
import { AccountStatus, FullUser, User } from "@/types/entity";

export const fetchAllUsers = async (): Promise<FullUser[]> => {
  const res = await axios.get(`${API_URL}/user/full-fetch`);
  return res.data;
};

export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get(`${API_URL}/user`);
  return res.data;
}

export const updateUserStatus = async (
  id: number,
  accountStatus: AccountStatus
): Promise<void> => {
  const payload = {
    id,
    accountStatus,
  };
  console.log(payload)
  await axios.put(`${API_URL}/user/status`, payload);
}; 

export const deleteUser = async (id : number) : Promise<void> => {
  await axios.delete(`${API_URL}/user/${id}`);
}