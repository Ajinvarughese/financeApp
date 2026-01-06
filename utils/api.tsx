import { Asset } from "@/types/entity";
import axios from "axios";
import API_URL from "./ApiUrl";

// get assets
export async function fetchAssets(): Promise<Asset[]> {
  const res = await axios.get<Asset[]>(`${API_URL}/asset`);
  return res.data; 
}

export async function addAsset(asset: Asset): Promise<Asset> {
    const res = await axios.post<Asset>(`${API_URL}/asset`, asset);
    return res.data;
    
}

