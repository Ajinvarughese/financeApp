import { Feedback } from "@/types/entity";
import { getUser } from "./auth";
import { Platform } from "react-native";
import axios from "axios";
import API_URL from "./ApiUrl";

export async function createFeedback(
  data: any,
  file?: any
): Promise<Feedback> {
  const user = await getUser();

  const feedback = {
    title: data.title,
    comment: data.comment,
    user: { id: user?.id },
  };

  const formData = new FormData();

  // send JSON
  formData.append("feedback", JSON.stringify(feedback));

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

  const res = await axios.post(`${API_URL}/feedback`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}


export const fetchFeedbacks = async (): Promise<Feedback[]> => {
  const res = await axios.get(`${API_URL}/feedback`);
  return res.data;
};

export const resolveFeedback = async (payload : any): Promise<Feedback> => {
  const res = await axios.post(`${API_URL}/feedback`, payload);
  return res.data;
};

export const deleteFeedback = async (id : number) : Promise<void> => {
  await axios.delete(`${API_URL}/feedback/delete/${id}`);
}

export const deleteResolvedFeedbacks = async () : Promise<void> => {
  await axios.delete(`${API_URL}/feedback/delete/resolved`);
}