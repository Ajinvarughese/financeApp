import { EmailJSResponseStatus, send } from "@emailjs/react-native";
import axios from "axios";
import API_URL from "./ApiUrl";


export const sendOtp = async (otp: string, email: string) => {
  try {
    await send(
      "service_kcl5hvg",
      "template_9ay3w08",
      {
        email: email,
        passcode: otp,
      },
      {
        publicKey: "N3rbWoHsxYULnhJcA",
      }
    );
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      console.log("EmailJS Failed", err);
    }
  }
};

export const generateOtp = async (payload: any) => {
  const res = await axios.post(`${API_URL}/user/otp`, payload);
  return res.data;
};

export const validateOtp = async (payload: any) => {
  const res = await axios.post(`${API_URL}/user/otp/validate`, payload);
  return res.data;
};
