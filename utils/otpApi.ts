import axios from "axios";
import API_URL from "./ApiUrl";

export const generateOtp = async (payload: any) => {
  const res = await axios.post(`${API_URL}/user/otp`, payload);
  return res.data;
};

export const validateOtp = async (payload: any) => {
  const res = await axios.post(`${API_URL}/user/otp/validate`, payload);
  return res.data;
};
