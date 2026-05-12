import { Platform } from "react-native";

const fetchUrl = (): string => {
  if (Platform.OS === "web") return "http://localhost:8080/api";
  else return "http://10.35.67.237:8080/api";
};

const API_URL = fetchUrl();

export default API_URL;
